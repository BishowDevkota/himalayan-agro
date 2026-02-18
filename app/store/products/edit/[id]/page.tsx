import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../../lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "../../../../../lib/mongodb";
import Distributor from "../../../../../models/Distributor";
import Product from "../../../../../models/Product";
import DistributorProductForm from "../../../../components/distributor/DistributorProductForm";

export default async function StoreEditProductPage({ params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = resolvedParams.id;

  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return redirect(`/login?from=/store/products/edit/${id}`);
  if (session.user?.role !== "distributor") return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const distributor = await Distributor.findOne({ user: session.user?.id }).lean();
  if (!distributor) return <div className="p-12">Distributor profile missing</div>;

  const product = await Product.findOne({ _id: id, distributor: distributor._id }).lean();
  if (!product) return <div className="p-12">Product not found</div>;

  const safeProduct = { ...product, _id: String(product._id) } as any;

  return (
    <div className="max-w-7xl mx-auto pt-28 pb-12 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit product</h1>
      </div>
      <div className="mt-6">
        <DistributorProductForm initial={safeProduct} />
      </div>
    </div>
  );
}
