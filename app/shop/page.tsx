import React from "react";
import connectToDatabase from "../../lib/mongodb";
import Product from "../../models/Product";
import ProductCard from "../components/ProductCard";
import ShopFiltersClient from "./ShopFiltersClient";
import Link from "next/link";

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

    const totalPages = Math.ceil(total / limit);
    const hasActiveFilters = !!(
      (sp as any).category || (sp as any).minPrice || (sp as any).maxPrice || (sp as any).q
    );

    return (
      <div className="bg-[#fafbfc] text-gray-900 min-h-screen">
        {/* ── Hero banner ── */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#0e7490] via-[#0891b2] to-[#06b6d4]">
          {/* Decorative shapes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" />
            <div className="absolute top-1/2 left-1/2 w-150 h-150 rounded-full bg-white/3 -translate-x-1/2 -translate-y-1/2" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
              <div className="max-w-xl">
                <p className="text-cyan-100 text-sm font-medium tracking-widest uppercase mb-3">Himalayan Agro</p>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                  Shop Our Collection page status
                </h1>
                <p className="mt-4 text-cyan-100/90 text-base sm:text-lg leading-relaxed">
                  Discover premium agricultural products — use filters to find exactly what you need.
                </p>
              </div>
              
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-[#fafbfc] to-transparent" />
        </section>

        {/* ── Main content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10 pb-16">
          {/* Filters card */}
          <div className="mb-8">
            <ShopFiltersClient
              categories={safeCats}
              currentCategory={(sp as any).category}
              minPrice={((sp as any).minPrice ? Number((sp as any).minPrice) : undefined)}
              maxPrice={((sp as any).maxPrice ? Number((sp as any).maxPrice) : undefined)}
              initialQuery={(sp as any).q}
            />
          </div>

          {/* Results bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {hasActiveFilters ? 'Filtered Results' : 'All Products'}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-100">
                {total} {total === 1 ? 'product' : 'products'}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Page {page} of {totalPages || 1} &middot; {limit} per page
            </p>
          </div>

          {/* Product grid */}
          {total > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
              {safeItems.map((p: any) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">No products found</h3>
              <p className="text-sm text-gray-500 max-w-xs">Try adjusting your filters or search query to find what you&apos;re looking for.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
              {page > 1 && (
                <Link
                  href={`/shop?${new URLSearchParams({ ...((sp as any) || {}), page: String(page - 1) }).toString()}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:text-gray-900 transition-all duration-200 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  Previous
                </Link>
              )}

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <Link
                    key={pageNum}
                    href={`/shop?${new URLSearchParams({ ...((sp as any) || {}), page: String(pageNum) }).toString()}`}
                    className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200 ${
                      pageNum === page
                        ? 'bg-[#0891b2] text-white shadow-md shadow-cyan-200'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:text-gray-900 shadow-sm'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              {page < totalPages && (
                <Link
                  href={`/shop?${new URLSearchParams({ ...((sp as any) || {}), page: String(page + 1) }).toString()}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:text-gray-900 transition-all duration-200 shadow-sm"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('ShopPage — DB error (build/runtime):', err);
    return (
      <div className="bg-[#fafbfc] min-h-screen">
        <section className="bg-linear-to-br from-[#0e7490] via-[#0891b2] to-[#06b6d4] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Shop</h1>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Products temporarily unavailable</h3>
            <p className="text-sm text-gray-500">Please try again in a few moments.</p>
          </div>
        </div>
      </div>
    );
  }
}