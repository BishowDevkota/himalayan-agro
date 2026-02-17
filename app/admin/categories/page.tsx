import React from "react";
import connectToDatabase from "../../../lib/mongodb";
import Category from "../../../models/Category";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import { serializeMany } from "../../../lib/serialize";
import CategoryForm from "../../components/admin/CategoryForm";
import CategoryRow from "../../components/admin/CategoryRow";
import { hasPermission } from "../../../lib/permissions";

export default async function AdminCategoriesPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "categories:read")) return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const categories = await Category.find().sort({ name: 1 }).lean();
  const safe = serializeMany(categories as any[]);

  const totalProducts = safe.reduce((sum: number, c: any) => sum + (c.products || []).length, 0);
  const emptyCategories = safe.filter((c: any) => !(c.products || []).length).length;

  return (
    <main className="pb-16">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-sky-600">Catalog</span>
            <h1 className="mt-3 text-4xl font-black text-slate-900">Categories</h1>
            <p className="mt-3 text-sm text-slate-500">Create and maintain product categories.</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/admin/categories"
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700"
            >
              Refresh
            </a>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Total Categories</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{safe.length}</div>
                <div className="mt-2 text-sm text-slate-400">All categories</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 font-bold">C</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Products</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{totalProducts}</div>
                <div className="mt-2 text-sm text-slate-400">Across all categories</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-bold">P</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">With Products</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{safe.length - emptyCategories}</div>
                <div className="mt-2 text-sm text-slate-400">Active categories</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-bold">✓</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Empty</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{emptyCategories}</div>
                <div className="mt-2 text-sm text-slate-400">No products assigned</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 font-bold">!</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Create category</h2>
            <p className="mt-1 text-xs text-slate-400">Add a new product category.</p>
            <div className="mt-6">
              <CategoryForm />
            </div>
          </section>
          <section className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Existing categories</h2>
            <p className="mt-1 text-xs text-slate-400">{safe.length} categories in the catalog.</p>
            <div className="mt-6 space-y-3">
              {safe.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">No categories yet</div>
              ) : (
                safe.map((c: any) => (
                  <CategoryRow key={c._id} category={c} />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
