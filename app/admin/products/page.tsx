import React from "react";
import connectToDatabase from "../../../lib/mongodb";
import Product from "../../../models/Product";
import ProductRow from "../../components/admin/ProductRow";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";

export default async function AdminProductsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== "admin") return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();
  const { serializeMany } = await import('../../../lib/serialize');
  const safeProducts = serializeMany(products as any[]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <a className="rounded bg-sky-600 text-white px-4 py-2" href="/admin/products/new">New product</a>
      </div>

      <div className="mt-6 space-y-3">
        {safeProducts.map((p: any) => (
          <ProductRow key={p._id} product={p} />
        ))}
        {safeProducts.length === 0 && <div className="text-sm text-gray-600">No products yet.</div>}
      </div>
    </div>
  );
}