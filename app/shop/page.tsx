import React from "react";
import connectToDatabase from "../../lib/mongodb";
import Product from "../../models/Product";
import ProductCard from "../components/ProductCard";

export const revalidate = 30;

export default async function ShopPage({ searchParams }: { searchParams?: { q?: string; page?: string; limit?: string } | Promise<{ q?: string; page?: string; limit?: string } | undefined> }) {
  await connectToDatabase();
  const sp = (searchParams && typeof (searchParams as any)?.then === "function") ? (await searchParams) : (searchParams || {});
  const page = Math.max(1, Number((sp as any).page || 1));
  const limit = Math.min(100, Number((sp as any).limit || 12));
  const filter: any = { isActive: true };
  if ((sp as any).q) filter.$text = { $search: (sp as any).q };

  const [items, total] = await Promise.all([
    Product.find(filter).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  const { serializeMany } = await import('../../lib/serialize');
  const safeItems = serializeMany(items as any[]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-semibold mb-6">Shop</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {safeItems.map((p: any) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      {total === 0 && <p className="mt-6 text-muted-foreground">No products found.</p>}
    </div>
  );
}