import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "../../lib/mongodb";
import Vendor from "../../models/Vendor";
import Product from "../../models/Product";
import Order from "../../models/Order";

export default async function StoreDashboardPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login?from=/store");
  if (session.user?.role !== "vendor") return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const vendor = await Vendor.findOne({ user: session.user?.id }).lean();
  if (!vendor) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <div className="max-w-5xl mx-auto py-16 px-6">
          <h1 className="text-2xl font-semibold">Store profile missing</h1>
          <p className="mt-2 text-sm text-slate-500">Your vendor profile was not found. Contact support to restore access.</p>
        </div>
      </div>
    );
  }

  const products = await Product.find({ vendor: vendor._id }).sort({ createdAt: -1 }).lean();
  const productIds = products.map((p: any) => p._id);
  const productIdSet = new Set(productIds.map((id: any) => String(id)));

  let totalRevenue = 0;
  let totalOrders = 0;

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
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto pt-28 pb-16 px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold">{vendor.storeName}</h1>
            <p className="mt-2 text-sm text-slate-500">Vendor dashboard — manage your store, products and sales.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a className="rounded bg-emerald-600 text-white px-4 py-2 text-sm" href="/store/products">Manage products</a>
            <a className="rounded border border-gray-200 px-4 py-2 text-sm" href="/store/orders">Orders</a>
            <a className="rounded border border-gray-200 px-4 py-2 text-sm" href="/store/revenue">Revenue</a>
            <a className="rounded border border-gray-200 px-4 py-2 text-sm" href={`/store/${vendor._id}`}>View store page</a>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-slate-500">Products</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{products.length}</div>
            <div className="mt-2 text-sm text-slate-400">Active catalog size</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-slate-500">Orders</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{totalOrders}</div>
            <div className="mt-2 text-sm text-slate-400">Orders containing your items</div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-slate-500">Revenue</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">₹{totalRevenue.toFixed(2)}</div>
            <div className="mt-2 text-sm text-slate-400">Gross sales (item totals)</div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Store profile</h2>
              <div className={`text-xs px-2 py-1 rounded-full ${vendor.status === "approved" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {vendor.status}
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">Owner</dt>
                <dd className="mt-1 text-slate-900 font-medium">{vendor.ownerName || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Contact email</dt>
                <dd className="mt-1 text-slate-900 font-medium">{vendor.contactEmail}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Contact phone</dt>
                <dd className="mt-1 text-slate-900 font-medium">{vendor.contactPhone || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Address</dt>
                <dd className="mt-1 text-slate-900 font-medium">{vendor.address || "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-500">Description</dt>
                <dd className="mt-1 text-slate-900">{vendor.description || "—"}</dd>
              </div>
            </dl>
          </section>

          <aside className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Recent products</h3>
            <div className="mt-4 space-y-4">
              {products.slice(0, 4).map((p: any) => (
                <div key={String(p._id)} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden">
                    <img src={(p.images && p.images[0]) || "/placeholder.png"} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="text-xs text-slate-500">₹{Number(p.price || 0).toFixed(2)}</div>
                  </div>
                </div>
              ))}
              {products.length === 0 && <div className="text-sm text-slate-500">No products yet</div>}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
