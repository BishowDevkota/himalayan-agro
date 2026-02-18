import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "../../../lib/mongodb";
import Distributer from "../../../models/Distributer";
import Product from "../../../models/Product";

export default async function StoreProfilePage({ params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = resolvedParams.id;

  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect(`/login?from=/store/${id}`);

  await connectToDatabase();
  const distributer = await Distributer.findById(id).lean();
  if (!distributer || distributer.status !== "approved") {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <div className="max-w-5xl mx-auto py-16 px-6">
          <h1 className="text-2xl font-semibold">Store not found</h1>
          <p className="mt-2 text-sm text-slate-500">This distributer is not available.</p>
        </div>
      </div>
    );
  }

  const products = await Product.find({ distributer: distributer._id, isActive: true }).sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto pt-28 pb-16 px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold">{distributer.storeName}</h1>
            <p className="mt-2 text-sm text-slate-500">Distributer store front</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">About this store</h2>
            <div className="mt-4 text-sm text-slate-600">{distributer.description || "No description provided."}</div>
            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-slate-500">Owner</dt>
                <dd className="mt-1 text-slate-900 font-medium">{distributer.ownerName || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Contact</dt>
                <dd className="mt-1 text-slate-900 font-medium">{distributer.contactEmail}</dd>
              </div>
            </dl>
          </section>

          <aside className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Store contact</h3>
            <div className="mt-3 text-sm text-slate-600">{distributer.contactEmail}</div>
            <div className="mt-1 text-sm text-slate-600">{distributer.contactPhone || "—"}</div>
            <div className="mt-3 text-sm text-slate-600">{distributer.address || "—"}</div>
          </aside>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Products</h2>
            <div className="text-sm text-slate-500">{products.length} items</div>
          </div>
          {products.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">No products listed</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p: any) => (
                <a key={String(p._id)} href={`/product/${p._id}`} className="group border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className="h-44 bg-gray-100 overflow-hidden">
                    <img src={(p.images && p.images[0]) || "/placeholder.png"} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div className="p-4">
                    <div className="font-medium text-slate-900 truncate">{p.name}</div>
                    <div className="mt-1 text-sm text-slate-600 truncate">{p.description || ""}</div>
                    <div className="mt-3 text-sm font-semibold text-slate-900">₹{Number(p.price || 0).toFixed(2)}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
