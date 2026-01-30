import React from "react";
import connectToDatabase from "../../../lib/mongodb";
import Product from "../../../models/Product";
import ProductRow from "../../components/admin/ProductRow";
import AdminProductsClient from "../../components/admin/AdminProductsClient";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";

export default async function AdminProductsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "admin") return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  const { serializeMany } = await import('../../../lib/serialize');
  const safeProducts = serializeMany(products as any[]);

  // categories for filter dropdown
  const Category = (await import('../../../models/Category')).default;
  const cats = await Category.find().sort({ name: 1 }).lean();
  const publicCats = cats.map((c: any) => ({ _id: String(c._id), name: c.name, productsCount: (c.products || []).length }));

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold">Products</h1>
            <p className="mt-2 text-sm text-slate-500">Manage catalog — create, edit and publish products.</p>
          </div>

          <div className="flex gap-3">
            <a className="rounded bg-sky-600 text-white px-4 py-2" href="/admin/products/new">New product</a>
            <a className="rounded border border-gray-100 px-4 py-2 text-slate-700" href="/products">View store</a>
          </div>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AdminProductsClient initialProducts={safeProducts} initialTotal={safeProducts.length} initialPage={1} initialPerPage={20} categories={publicCats} />
            </div>

            <aside className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Catalog insights</h3>
              <div className="mt-4 text-sm text-slate-600">Quick controls and metrics for your product catalog.</div>

              <dl className="mt-6 grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center justify-between"><dt className="text-slate-500">Total products</dt><dd className="font-semibold text-slate-900">{safeProducts.length}</dd></div>
                <div className="flex items-center justify-between"><dt className="text-slate-500">Categories</dt><dd className="font-semibold text-slate-900">{publicCats.length}</dd></div>
                <div className="flex items-center justify-between"><dt className="text-slate-500">Out of stock</dt><dd className="font-semibold text-rose-600">{/* TODO: calculate */}0</dd></div>
              </dl>

              <div className="mt-6 border-t pt-4 text-sm text-slate-500">
                <div>Tip: use the filters to find products quickly.</div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}