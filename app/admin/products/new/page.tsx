import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth";
import ProductForm from "../../../components/admin/ProductForm";
import connectToDatabase from "../../../../lib/mongodb";
import Product from "../../../../models/Product";
import { hasPermission } from "../../../../lib/permissions";

export default async function NewProductPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "products:write")) return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const recent = await Product.find({}).sort({ createdAt: -1 }).limit(3).lean();

  return (
    <main className="pb-16">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-sky-600">Catalog</span>
            <h1 className="mt-3 text-4xl font-black text-slate-900">New product</h1>
            <p className="mt-3 text-sm text-slate-500">
              Add a product to the catalog - fill required fields and upload clear photos.
            </p>
          </div>

          <div className="text-sm text-slate-500">
            Logged in as <span className="font-medium text-slate-700">{session.user?.email}</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
              <ProductForm />
            </div>
          </div>

          <aside className="order-first lg:order-last">
            <div className="bg-white/90 text-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold">Quick tips</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Use high-quality square images (800x800 or larger).</li>
                <li>Keep the description short and benefit-focused (1-2 lines).</li>
                <li>Set an accurate stock value to avoid oversells.</li>
              </ul>
              <a href="/admin/categories" className="mt-4 inline-block text-sm bg-slate-900 text-white px-4 py-2 rounded-full">Manage categories</a>
            </div>

            <div className="mt-6 bg-white/90 border border-slate-100 rounded-3xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">Recent products</h4>
                <a className="text-sm text-slate-700" href="/admin/products">View all</a>
              </div>

              <div className="mt-3 space-y-3">
                {recent.map((r: any) => (
                  <div key={String(r._id)} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden">
                      <img src={(r.images && r.images[0]) || '/placeholder.png'} alt={r.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{r.name}</div>
                      <div className="text-xs text-slate-500">₹{Number(r.price || 0).toFixed(2)}</div>
                    </div>
                  </div>
                ))}

                {recent.length === 0 && (
                  <div className="text-sm text-slate-500">No recent products</div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}