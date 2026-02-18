import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "../../../lib/mongodb";
import Distributer from "../../../models/Distributer";
import Product from "../../../models/Product";
import DistributerProductsClient from "../../components/distributer/DistributerProductsClient";

export default async function StoreProductsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login?from=/store/products");
  if (session.user?.role !== "distributer") return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const distributer = await Distributer.findOne({ user: session.user?.id }).lean();
  if (!distributer) return <div className="p-12">Distributer profile missing</div>;

  const products = await Product.find({ distributer: distributer._id }).sort({ createdAt: -1 }).lean();
  const safe = products.map((p: any) => ({ ...p, _id: String(p._id) }));

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto pt-28 pb-16 px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Products</h1>
            <p className="mt-2 text-sm text-slate-500">Manage items for {distributer.storeName}.</p>
          </div>
        </div>

        <DistributerProductsClient initialProducts={safe} />
      </div>
    </div>
  );
}
