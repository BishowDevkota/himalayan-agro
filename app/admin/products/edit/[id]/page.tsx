import React from "react";
import connectToDatabase from "../../../../../lib/mongodb";
import Product from "../../../../../models/Product";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../../lib/auth";
import ProductForm from "../../../../components/admin/ProductForm";
import { hasPermission } from "../../../../../lib/permissions";

export default async function EditProductPage({ params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  // `params` can be a Promise in some Next.js runtimes — unwrap it safely.
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = resolvedParams.id;

  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "products:write")) return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const product = await Product.findById(id).lean();
  if (!product) return <div className="p-12">Product not found</div>;
  const { serialize } = await import('../../../../../lib/serialize');
  const safeProduct = serialize(product);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit product</h1>
      </div>
      <div className="mt-6">
        <ProductForm initial={safeProduct} />
      </div>
    </div>
  );
}