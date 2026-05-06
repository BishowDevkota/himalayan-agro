import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import authOptions from "../../../lib/auth";
import connectToDatabase from "../../../lib/mongodb";
import Outlet from "../../../models/Outlet";
import Product from "../../../models/Product";
import Category from "../../../models/Category";

export default async function AdminOutletDashboard({ params }: { params: { slug: string } } | { params: Promise<{ slug: string }> }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const { slug } = resolvedParams;

  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) {
    return redirect(`/login?from=/admin/${slug}`);
  }

  if (session.user?.role !== "admin" && session.user?.role !== "outlet-admin") {
    return redirect("/admin/dashboard");
  }

  if (session.user?.role === "outlet-admin" && session.user?.outletSlug !== slug) {
    return redirect(`/admin/${session.user?.outletSlug || "dashboard"}`);
  }

  await connectToDatabase();

  const outlet = await Outlet.findOne({ slug }).lean();
  if (!outlet) {
    return redirect("/admin/outlets");
  }

  const [totalProducts, activeProducts, outOfStock, categories] = await Promise.all([
    Product.countDocuments({ outlet: outlet._id }),
    Product.countDocuments({ outlet: outlet._id, isActive: true }),
    Product.countDocuments({ outlet: outlet._id, stock: { $lte: 0 } }),
    Category.find().sort({ name: 1 }).lean(),
  ]);

  return (
    <main className="pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{outlet.name}</h1>
          <p className="mt-2 text-sm text-slate-500">Outlet Management Dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Products</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{totalProducts}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{activeProducts}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Out of Stock</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{outOfStock}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Categories</p>
            <p className="text-3xl font-bold text-cyan-600 mt-2">{categories.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link href={`/admin/${slug}/products`} className="bg-cyan-600 hover:bg-cyan-700 text-white p-6 rounded-2xl font-semibold transition-colors">
            Manage Products
          </Link>
          <Link href={`/admin/${slug}/orders`} className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-2xl font-semibold transition-colors">
            Manage Orders
          </Link>
          <Link href={`/admin/${slug}/categories`} className="bg-emerald-600 hover:bg-emerald-700 text-white p-6 rounded-2xl font-semibold transition-colors">
            Manage Categories
          </Link>
          <Link href={`/admin/${slug}/outlet-info`} className="bg-slate-700 hover:bg-slate-800 text-white p-6 rounded-2xl font-semibold transition-colors">
            Outlet Info
          </Link>
          <Link href={`/admin/${slug}/employees`} className="bg-amber-600 hover:bg-amber-700 text-white p-6 rounded-2xl font-semibold transition-colors">
            Employees
          </Link>
        </div>
      </div>
    </main>
  );
}