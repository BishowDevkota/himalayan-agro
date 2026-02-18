import React from "react";
import { getServerSession } from "next-auth";
import authOptions from "../../lib/auth";
import connectToDatabase from "../../lib/mongodb";
import Product from "../../models/Product";
import ProductCard from "../components/ProductCard";
import ShopFiltersClient from "./ShopFiltersClient";
import SubHeroSection from "../components/SubHeroSection";

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
    const session = await getServerSession(authOptions);

    return (
      <main className="bg-white text-gray-900">
        <SubHeroSection
          title="Our Products"
          description="Premium Nepalese agricultural products — from farm to your doorstep. Discover quality produce sourced directly from our partner farms."
          image="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=2000"
          tag="Browse & Discover"
          stats={[
            { value: `${total}`, label: "Products Available" },
            { value: "340+", label: "Partner Farms" },
          ]}
          btnText={!session ? "Become a Distributer" : undefined}
          btnHref={!session ? "/register/distributer" : undefined}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
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
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700">
              <span className="text-[#059669] font-bold">{total}</span> product{total === 1 ? '' : 's'} found
            </p>
            <p className="text-xs text-gray-400">
              Page {page} of {totalPages || 1} &middot; {limit} per page
            </p>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {safeItems.map((p: any) => (
              <ProductCard key={p._id} product={p} hideQuickView />
            ))}
          </div>

          {total === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-8 h-8 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              </div>
              <p className="text-gray-500 font-medium">No products found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {page > 1 && (
                <a href={`/shop?page=${page - 1}${(sp as any).category ? `&category=${(sp as any).category}` : ''}${(sp as any).minPrice ? `&minPrice=${(sp as any).minPrice}` : ''}${(sp as any).maxPrice ? `&maxPrice=${(sp as any).maxPrice}` : ''}`}
                  className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:border-[#059669] hover:text-[#059669] transition-colors"
                >
                  Previous
                </a>
              )}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <a key={p} href={`/shop?page=${p}${(sp as any).category ? `&category=${(sp as any).category}` : ''}${(sp as any).minPrice ? `&minPrice=${(sp as any).minPrice}` : ''}${(sp as any).maxPrice ? `&maxPrice=${(sp as any).maxPrice}` : ''}`}
                    className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${p === page ? 'bg-[#059669] text-white' : 'border border-gray-200 text-gray-600 hover:border-[#059669] hover:text-[#059669]'}`}
                  >
                    {p}
                  </a>
                );
              })}
              {page < totalPages && (
                <a href={`/shop?page=${page + 1}${(sp as any).category ? `&category=${(sp as any).category}` : ''}${(sp as any).minPrice ? `&minPrice=${(sp as any).minPrice}` : ''}${(sp as any).maxPrice ? `&maxPrice=${(sp as any).maxPrice}` : ''}`}
                  className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:border-[#059669] hover:text-[#059669] transition-colors"
                >
                  Next
                </a>
              )}
            </div>
          )}
        </div>
      </main>
    );
  } catch (err) {
    console.error('ShopPage — DB error (build/runtime):', err);
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto py-16 px-4 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
            <svg fill="none" stroke="#d97706" strokeWidth="1.5" viewBox="0 0 24 24" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop Temporarily Unavailable</h1>
          <p className="text-gray-500">Products are temporarily unavailable — please try again later.</p>
        </div>
      </div>
    );
  }
}