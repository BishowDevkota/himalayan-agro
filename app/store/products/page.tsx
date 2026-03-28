import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "../../../lib/mongodb";
import Distributor from "../../../models/Distributor";
import Product from "../../../models/Product";
import DistributorProductsClient from "../../components/distributor/DistributorProductsClient";

export default async function StoreProductsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login?from=/store/products");
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
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">Distributor profile missing</div>
      </div>
    );
  }

  const products = await Product.find({ distributor: distributor._id }).sort({ createdAt: -1 }).lean();
  const safe = products.map((p: any) => ({ ...p, _id: String(p._id) }));
  const activeCount = safe.filter((p: any) => p.isActive).length;
  const outOfStock = safe.filter((p: any) => Number(p.stock || 0) <= 0).length;
  const avgPrice = safe.length ? safe.reduce((sum: number, p: any) => sum + Number(p.price || 0), 0) / safe.length : 0;

  return (
    <main className="pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full mb-3">Catalog</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Products</h1>
            <p className="mt-1 text-sm text-slate-500">Manage items for {distributor.storeName}.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-sm font-medium transition-colors shadow-sm" href="/store/products/new">New product</Link>
            <Link className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors shadow-sm" href="/store">Dashboard</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{safe.length}</p>
            <p className="text-xs text-slate-400 mt-3">Catalog items</p>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{activeCount}</p>
            <p className="text-xs text-slate-400 mt-3">Visible in store</p>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Out of stock</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{outOfStock}</p>
            <p className="text-xs text-slate-400 mt-3">Needs refill</p>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg price</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">₹{avgPrice.toFixed(0)}</p>
            <p className="text-xs text-slate-400 mt-3">Across products</p>
          </div>
        </div>

        <DistributorProductsClient initialProducts={safe} />
      </div>
    </main>
  );
}
