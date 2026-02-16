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
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">New product</h1>
            <p className="mt-1 text-sm text-slate-600">Add a product to the catalog - fill required fields and upload clear photos.</p>
          </div>

          <div className="text-sm text-slate-500">Logged in as <span className="font-medium text-slate-700">{session.user?.email}</span></div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <ProductForm />
            </div>
          </div>

          <aside className="order-first lg:order-last">
            <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold">Quick tips</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Use high-quality square images (800x800 or larger).</li>
                <li>Keep the description short and benefit-focused (1–2 lines).</li>
                <li>Set an accurate stock value to avoid oversells.</li>
              </ul>
              <a href="/admin/categories" className="mt-4 inline-block text-sm bg-slate-100 text-slate-900 px-3 py-2 rounded-lg">Manage categories</a>
            </div>

            <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-900">Recent products</h4>
                <a className="text-sm text-sky-600" href="/admin/products">View all</a>
              </div>

              <div className="mt-3 space-y-3">
                {recent.map((r: any) => (
                  <div key={String(r._id)} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden">
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
    </div>
  );
}