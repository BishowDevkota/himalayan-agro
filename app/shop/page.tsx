import React from "react";
import connectToDatabase from "../../lib/mongodb";
import Product from "../../models/Product";
import ProductCard from "../components/ProductCard";
import ShopFiltersClient from "./ShopFiltersClient";

export const revalidate = 30;

export default async function ShopPage({ searchParams }: { searchParams?: { q?: string; page?: string; limit?: string } | Promise<{ q?: string; page?: string; limit?: string } | undefined> }) {
  try {
    await connectToDatabase();
    const sp = (searchParams && typeof (searchParams as any)?.then === "function") ? (await searchParams) : (searchParams || {});
    const page = Math.max(1, Number((sp as any).page || 1));
    const limit = Math.min(100, Number((sp as any).limit || 12));
    const filter: any = { isActive: true };
    if ((sp as any).q) filter.$text = { $search: (sp as any).q };
    // category filter (expects category name)
    if ((sp as any).category) filter.category = (sp as any).category;
    // price filters
    const minP = Number((sp as any).minPrice);
    const maxP = Number((sp as any).maxPrice);
    if (!Number.isNaN(minP)) filter.price = { ...(filter.price || {}), $gte: minP };
    if (!Number.isNaN(maxP)) filter.price = { ...(filter.price || {}), $lte: maxP };

    const [items, total] = await Promise.all([
      Product.find(filter).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    const { serializeMany } = await import('../../lib/serialize');
    const safeItems = serializeMany(items as any[]);

    // fetch categories server-side and render top filters + grid
    const Category = (await import('../../models/Category')).default;
    const cats = await Category.find().sort({ name: 1 }).lean();
    const { serializeMany: serializeCats } = await import('../../lib/serialize');
    const safeCats = serializeCats(cats as any[]);

    return (
      <div className="bg-white text-black dark:bg-white dark:text-black min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4 text-black dark:text-black">
          <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Shop</h1>
            <p className="mt-2 text-sm text-gray-600">Browse products — use the filters to narrow results.</p>
          </div>
            <a className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-slate-700 hover:border-slate-300" href="/register/vendor">
              Become a vendor
            </a>
        </div>

        {/* top filters (category chips + price) */}
        <div className="mb-8">
          <ShopFiltersClient
            categories={safeCats}
            currentCategory={(sp as any).category}
            minPrice={((sp as any).minPrice ? Number((sp as any).minPrice) : undefined)}
            maxPrice={((sp as any).maxPrice ? Number((sp as any).maxPrice) : undefined)}
            initialQuery={(sp as any).q}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">{total} result{total === 1 ? '' : 's'}</div>
          <div className="text-sm text-gray-500">Showing page {page} • {limit} per page</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {safeItems.map((p: any) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>

        {total === 0 && <p className="mt-6 text-muted-foreground">No products found.</p>}
        </div>
      </div>
    );
  } catch (err) {
    // don't crash the build — show a graceful fallback and let ISR revalidate later
    // (build environments that cannot reach MongoDB will no longer fail here)
    // Log for diagnostics (visible in build logs)
    // eslint-disable-next-line no-console
    console.error('ShopPage — DB error (build/runtime):', err);
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4">
          <h1 className="text-3xl font-semibold mb-6">Shop</h1>
          <p className="text-muted-foreground">Products are temporarily unavailablee — try again later.</p>
        </div>
      </div>
    );
  }
}