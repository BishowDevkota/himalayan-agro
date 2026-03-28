import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import authOptions from "../../lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "../../lib/mongodb";
import Distributor from "../../models/Distributor";
import Product from "../../models/Product";
import Order from "../../models/Order";

export default async function StoreDashboardPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login?from=/store");
  if (session.user?.role !== "distributor") {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">Unauthorized</div>
      </div>
    );
  }

  await connectToDatabase();
  const distributor = await Distributor.findOne({ user: session.user?.id }).lean();
  if (!distributor) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Store profile missing</h1>
          <p className="mt-2 text-sm text-slate-500">Your distributor profile was not found. Contact support to restore access.</p>
        </div>
      </div>
    );
  }

  const products = await Product.find({ distributor: distributor._id }).sort({ createdAt: -1 }).lean();
  const productIds = products.map((p: any) => p._id);
  const productIdSet = new Set(productIds.map((id: any) => String(id)));

  let totalRevenue = 0;
  let totalOrders = 0;
  const activeProducts = products.filter((p: any) => p.isActive).length;
  const lowStockProducts = products.filter((p: any) => Number(p.stock || 0) <= 5).length;

  if (productIds.length > 0) {
    const orders = await Order.find({ "items.product": { $in: productIds } }).lean();
    totalOrders = orders.length;
    orders.forEach((o: any) => {
      (o.items || []).forEach((item: any) => {
        if (productIdSet.has(String(item.product))) {
          totalRevenue += Number(item.price || 0) * Number(item.quantity || 0);
        }
      });
    });
  }

  return (
    <main className="pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full mb-3">Store Ops</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{distributor.storeName}</h1>
            <p className="mt-1 text-sm text-slate-500">Manage products, orders, payments and storefront visibility.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-sm font-medium transition-colors shadow-sm" href="/store/products">Manage products</Link>
            <Link className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors shadow-sm" href="/store/orders">Orders</Link>
            <Link className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors shadow-sm" href="/store/revenue">Revenue</Link>
            <Link className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors shadow-sm" href={`/store/${distributor._id}`}>View store page</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Products</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{products.length}</p>
            <p className="text-xs text-slate-400 mt-3">Catalog size</p>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{activeProducts}</p>
            <p className="text-xs text-slate-400 mt-3">Published products</p>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Orders</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{totalOrders}</p>
            <p className="text-xs text-slate-400 mt-3">Orders with your items</p>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Revenue</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">₹{totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-slate-400 mt-3">Low stock: {lowStockProducts}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <section className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold text-slate-900">Store profile</h2>
              <div className={`text-xs px-2.5 py-1 rounded-full font-medium ${distributor.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {distributor.status}
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <dt className="text-slate-500 text-xs uppercase tracking-wider">Owner</dt>
                <dd className="mt-1 text-slate-900 font-medium">{distributor.ownerName || "—"}</dd>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <dt className="text-slate-500 text-xs uppercase tracking-wider">Contact email</dt>
                <dd className="mt-1 text-slate-900 font-medium break-all">{distributor.contactEmail}</dd>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <dt className="text-slate-500 text-xs uppercase tracking-wider">Contact phone</dt>
                <dd className="mt-1 text-slate-900 font-medium">{distributor.contactPhone || "—"}</dd>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <dt className="text-slate-500 text-xs uppercase tracking-wider">Address</dt>
                <dd className="mt-1 text-slate-900 font-medium">{distributor.address || "—"}</dd>
              </div>
              <div className="sm:col-span-2 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <dt className="text-slate-500 text-xs uppercase tracking-wider">Description</dt>
                <dd className="mt-1 text-slate-900">{distributor.description || "—"}</dd>
              </div>
            </dl>
          </section>

          <aside className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Recent products</h3>
            <div className="mt-4 space-y-3">
              {products.slice(0, 5).map((p: any) => (
                <div key={String(p._id)} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    <img src={(p.images && p.images[0]) || "/placeholder.png"} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900 truncate">{p.name}</div>
                    <div className="text-xs text-slate-500">₹{Number(p.price || 0).toFixed(2)}</div>
                  </div>
                </div>
              ))}
              {products.length === 0 && <div className="text-sm text-slate-500">No products yet</div>}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
