import React from "react";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import connectToDatabase from "../../../lib/mongodb";
import Product from "../../../models/Product";
import AddToCart from "../../components/AddToCart";

export const revalidate = 60;

export default async function ProductPage({ params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  await connectToDatabase();

  const ps = (params && typeof (params as any)?.then === "function") ? await (params as any) : (params as any);
  const id = ps?.id;
  // validate ObjectId early to avoid cast errors and provide a proper 404
  if (!id || !mongoose.isValidObjectId(id)) return notFound();

  const product = await Product.findById(id).lean();
  if (!product) return notFound();
  const { serialize } = await import("../../../lib/serialize");
  const safeProduct = serialize(product);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <img
          src={safeProduct.images?.[0] || "/placeholder.png"}
          alt={safeProduct.name}
          className="w-full h-[420px] object-cover rounded-lg shadow-sm"
        />
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{safeProduct.name}</h1>
        <p className="mt-4 text-lg font-medium">${safeProduct.price.toFixed(2)}</p>
        <p className="mt-6 text-gray-700">{safeProduct.description}</p>
        <div className="mt-6">
          <AddToCart product={safeProduct} />
        </div>
      </div>
    </div>
  );
}