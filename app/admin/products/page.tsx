import React from "react";
import connectToDatabase from "../../../lib/mongodb";
import Product from "../../../models/Product";
import AdminProductsClient from "../../components/admin/AdminProductsClient";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import { hasPermission } from "../../../lib/permissions";

export default async function AdminProductsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "products:read")) return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  const { serializeMany } = await import('../../../lib/serialize');
  const safeProducts = serializeMany(products as any[]);

  // categories for filter dropdown
  const Category = (await import('../../../models/Category')).default;
  const cats = await Category.find().sort({ name: 1 }).lean();
  const publicCats = cats.map((c: any) => ({ _id: String(c._id), name: c.name, productsCount: (c.products || []).length }));

  const outOfStock = safeProducts.filter((p: any) => (p.stock ?? 0) <= 0).length;
  const activeCount = safeProducts.filter((p: any) => p.isActive).length;

  return (
    <main className="pb-16">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-sky-600">Catalog</span>
            <h1 className="mt-3 text-4xl font-black text-slate-900">Products</h1>
            <p className="mt-3 text-sm text-slate-500">Manage catalog — create, edit and publish products.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a className="rounded-full bg-slate-900 text-white px-4 py-1.5 text-xs font-medium" href="/admin/products/new">New product</a>
            <a className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-700" href="/products">View store</a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Total Products</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{safeProducts.length}</div>
                <div className="mt-2 text-sm text-slate-400">All product listings</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 font-bold">P</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Active</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{activeCount}</div>
                <div className="mt-2 text-sm text-slate-400">Published & visible</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-bold">A</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Categories</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{publicCats.length}</div>
                <div className="mt-2 text-sm text-slate-400">Product categories</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-bold">C</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Out of Stock</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{outOfStock}</div>
                <div className="mt-2 text-sm text-slate-400">Needs restocking</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 font-bold">!</div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <AdminProductsClient
            initialProducts={safeProducts}
            initialTotal={safeProducts.length}
            initialPage={1}
            initialPerPage={20}
            categories={publicCats}
          />
        </div>
      </div>
    </main>
  );
}