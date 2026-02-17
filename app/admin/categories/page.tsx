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

  return (
    <main className="pb-16">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-sky-600">Catalog</span>
            <h1 className="mt-3 text-4xl font-black">Categories</h1>
            <p className="mt-3 text-sm text-slate-500">Create and maintain product categories.</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Create category</h2>
            <div className="mt-4">
              <CategoryForm />
            </div>
          </section>
          <section className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Existing categories</h2>
            <div className="mt-4 space-y-3">
              {safe.map((c: any) => (
                <CategoryRow key={c._id} category={c} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
