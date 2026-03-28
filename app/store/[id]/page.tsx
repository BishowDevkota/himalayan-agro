import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "../../../lib/mongodb";
import Distributor from "../../../models/Distributor";
import Product from "../../../models/Product";

export default async function StoreProfilePage({ params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = resolvedParams.id;

  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect(`/login?from=/store/${id}`);

  await connectToDatabase();
  const distributor = await Distributor.findById(id).lean();
  if (!distributor || distributor.status !== "approved") {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Store not found</h1>
          <p className="mt-2 text-sm text-slate-500">This distributor is not available.</p>
        </div>
      </div>
    );
  }

  const products = await Product.find({ distributor: distributor._id, isActive: true }).sort({ createdAt: -1 }).lean();
  const avgPrice = products.length
    ? products.reduce((sum: number, p: any) => sum + Number(p.price || 0), 0) / products.length
    : 0;

  return (
    <main className="pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full mb-3">Storefront</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{distributor.storeName}</h1>
            <p className="mt-1 text-sm text-slate-500">Public-facing overview of your approved store.</p>
          </div>
          <Link className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors shadow-sm" href="/store">Back to dashboard</Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Products</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{products.length}</p>
            <p className="text-xs text-slate-400 mt-3">Active listing count</p>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg price</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">₹{avgPrice.toFixed(0)}</p>
            <p className="text-xs text-slate-400 mt-3">Store catalog average</p>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Store status</p>
            <p className="text-lg font-bold text-emerald-700 mt-2 capitalize">{distributor.status}</p>
            <p className="text-xs text-slate-400 mt-3">Visibility approval</p>
          </div>
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Owner</p>
            <p className="text-lg font-bold text-slate-900 mt-2 truncate">{distributor.ownerName || "—"}</p>
            <p className="text-xs text-slate-400 mt-3">Primary account holder</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          <section className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">About this store</h2>
            <div className="mt-3 text-sm text-slate-600">{distributor.description || "No description provided."}</div>
            <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <dt className="text-slate-500 text-xs uppercase tracking-wider">Owner</dt>
                <dd className="mt-1 text-slate-900 font-medium">{distributor.ownerName || "—"}</dd>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <dt className="text-slate-500 text-xs uppercase tracking-wider">Contact</dt>
                <dd className="mt-1 text-slate-900 font-medium break-all">{distributor.contactEmail}</dd>
              </div>
            </dl>
          </section>

          <aside className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Store contact</h3>
            <div className="mt-3 text-sm text-slate-600 break-all">{distributor.contactEmail}</div>
            <div className="mt-1 text-sm text-slate-600">{distributor.contactPhone || "—"}</div>
            <div className="mt-3 text-sm text-slate-600">{distributor.address || "—"}</div>
          </aside>
        </div>

        <section className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-slate-900">Store products</h2>
            <div className="text-sm text-slate-500">{products.length} items</div>
          </div>

          {products.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">No products listed</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p: any) => (
                <Link key={String(p._id)} href={`/product/${p._id}`} className="group border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-44 bg-gray-100 overflow-hidden">
                    <img src={(p.images && p.images[0]) || "/placeholder.png"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                  <div className="p-4">
                    <div className="font-medium text-slate-900 truncate">{p.name}</div>
                    <div className="mt-1 text-sm text-slate-600 line-clamp-2">{p.description || ""}</div>
                    <div className="mt-3 text-sm font-semibold text-slate-900">₹{Number(p.price || 0).toFixed(2)}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
