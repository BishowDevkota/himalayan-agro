import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth";
import { redirect } from "next/navigation";
import DistributorProductForm from "../../../components/distributor/DistributorProductForm";

export default async function StoreNewProductPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login?from=/store/products/new");
  if (session.user?.role !== "distributor") {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">Unauthorized</div>
      </div>
    );
  }

  return (
    <main className="pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full mb-3">Catalog</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">New product</h1>
            <p className="mt-1 text-sm text-slate-500">Add a product to your store catalog.</p>
          </div>
          <Link className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors shadow-sm" href="/store/products">Back to products</Link>
        </div>

        <DistributorProductForm />
      </div>
    </main>
  );
}
