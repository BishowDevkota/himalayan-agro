import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "../../../lib/mongodb";
import Distributor from "../../../models/Distributor";
import Product from "../../../models/Product";
import DistributorProductsClient from "../../components/distributor/DistributorProductsClient";

export default async function StoreProductsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect("/login?from=/store/products");
  if (session.user?.role !== "distributor") return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const distributor = await Distributor.findOne({ user: session.user?.id }).lean();
  if (!distributor) return <div className="p-12">Distributor profile missing</div>;

  const products = await Product.find({ distributor: distributor._id }).sort({ createdAt: -1 }).lean();
  const safe = products.map((p: any) => ({ ...p, _id: String(p._id) }));

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto pt-28 pb-16 px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Products</h1>
            <p className="mt-2 text-sm text-slate-500">Manage items for {distributor.storeName}.</p>
          </div>
        </div>

        <DistributorProductsClient initialProducts={safe} />
      </div>
    </div>
  );
}
