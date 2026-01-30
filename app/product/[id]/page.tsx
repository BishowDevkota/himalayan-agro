import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import connectToDatabase from "../../../lib/mongodb";
import Product from "../../../models/Product";
import AddToCart from "../../components/AddToCart";
import ProductCard from "../../components/ProductCard";

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

  // load categories for the "browse by category" block
  const Category = (await import("../../../models/Category")).default;
  const rawCats = await Category.find().sort({ name: 1 }).lean();
  const safeCats = (rawCats || []).map((c: any) => ({ _id: c._id, name: c.name, count: (c.products || []).length }));

  // related products (same category)
  const related = await Product.find({ category: safeProduct.category, _id: { $ne: safeProduct._id }, isActive: true }).limit(4).lean();
  const { serializeMany } = await import("../../../lib/serialize");
  const relatedSafe = serializeMany(related || []);

  const price = typeof safeProduct.price === 'number' ? `₹${safeProduct.price.toFixed(2)}` : safeProduct.price || '—';

  return (
    <div className="bg-white text-black dark:bg-white dark:text-black min-h-screen">
      <main className="max-w-7xl mx-auto py-12 px-4 text-black dark:text-black">
      <nav className="text-sm text-black mb-6" aria-label="breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li>›</li>
          <li><Link href="/shop" className="hover:underline">Shop</Link></li>
          {safeProduct.category && (
            <>
              <li>›</li>
              <li><Link href={`/shop?category=${encodeURIComponent(safeProduct.category)}`} className="hover:underline">{safeProduct.category}</Link></li>
            </>
          )}
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* gallery */}
        <div className="lg:col-span-2">
          {/* Product details — reordered per spec */}
          <section className="mt-2 bg-white border border-gray-50 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Product details</h2>

            {/* 1) Image (inside details) */}
            <div className="mt-4">
              <div className="w-full overflow-hidden rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={safeProduct.images?.[0] || '/placeholder.png'} alt={safeProduct.name} className="w-full h-56 sm:h-72 md:h-80 lg:h-96 object-cover rounded-lg" />
              </div>
            </div>

            {/* 2) Name + Price (same row) */}
            <div className="mt-4 flex items-start justify-between gap-4">
              <h1 className="text-2xl font-semibold leading-tight min-w-0 truncate">{safeProduct.name}</h1>
              <div className="text-2xl font-extrabold text-sky-600">{price}</div>
            </div>

            {/* 3) Brand + Category (separated) */}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-black">
              {safeProduct.brand && <div className="truncate">Brand: <span className="font-medium text-black">{safeProduct.brand}</span></div>}
              {safeProduct.category && <div className="truncate">Category: <span className="font-medium text-black">{safeProduct.category}</span></div>}
            </div>

            {/* 4) Description */}
            <div className="mt-4 text-sm text-black">
              <p>{safeProduct.shortDescription || safeProduct.description || 'No description available.'}</p>
            </div>

            {/* 5) Availability count (SKU removed as requested) */}
            <div className="mt-4 text-sm text-gray-700">
              <div>Availability: <span className="font-medium text-gray-800">{safeProduct.stock > 0 ? `${safeProduct.stock} available` : 'Out of stock'}</span></div>
            </div>

            {/* 6) Add to cart (primary action inside details) */}
            <div className="mt-6">
              <AddToCart product={safeProduct} />
            </div>
          </section> 

          {/* related products */}
          {relatedSafe.length > 0 && (
            <section className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">You may also like</h3>
                <Link href={`/shop?category=${encodeURIComponent(safeProduct.category || '')}`} className="text-sm text-gray-500 hover:underline">See all</Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {relatedSafe.map((p: any) => <ProductCard key={p._id} product={p} />)}
              </div>
            </section>
          )}
        </div>

        {/* right column: summary + actions + categories */}
        <aside className="space-y-6">
          <div className="sticky top-24 bg-white border border-gray-50 rounded-xl p-5 shadow-sm">
            {/* Important summary — always visible in sidebar */}
            <div className="rounded-md border border-yellow-100 bg-yellow-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-yellow-800">Important</div>
                <div className="text-sm font-medium text-yellow-800">{safeProduct.stock > 0 ? 'Available' : 'Unavailable'}</div>
              </div>

              <div className="mt-2 text-sm text-yellow-900">
                {safeProduct.stock > 0 ? (
                  <div>
                    {safeProduct.stock <= 5 ? (
                      <div className="font-medium">Only {safeProduct.stock} left — order soon</div>
                    ) : (
                      <div>{safeProduct.stock} in stock</div>
                    )}
                    <div className="mt-1 text-xs text-yellow-800">Usually dispatched within 1 business day</div>
                  </div>
                ) : (
                  <div className="font-medium">Currently out of stock</div>
                )}
              </div>

              <div className="mt-3 text-sm text-gray-600">Estimated delivery: <span className="font-medium text-gray-800">2–5 business days</span></div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-gray-700">Need help?</div>
                <div className="mt-1 text-xs text-gray-500">Questions about this product? <Link href="/contact" className="text-sky-600">Contact us</Link></div>
              </div>
              <div className="text-xs text-gray-500 text-right">
                <div>Free returns</div>
                <div>Secure payments</div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="rounded-md bg-sky-50 text-sky-700 px-3 py-2 text-sm">Fast shipping</div>
              <div className="rounded-md bg-gray-50 text-gray-600 px-3 py-2 text-sm">30-day returns</div>
            </div>
          </div>

          <div className="lg:sticky lg:top-96 bg-white border border-gray-50 rounded-xl p-4 shadow-sm" aria-labelledby="browse-cats">
            <div className="flex items-center justify-between">
              <h4 id="browse-cats" className="text-sm font-medium text-gray-700">Browse categories</h4>
              <div className="text-xs text-gray-400">Explore</div>
            </div>

            <p className="mt-2 text-xs text-gray-500">Quick links to popular categories.</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {/* user-provided priority categories first */}
              {['bishow','flowers','hey'].map((name) => (
                <Link
                  key={name}
                  href={`/shop?category=${encodeURIComponent(name)}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-sm text-gray-700 rounded-full border border-gray-100 hover:bg-gray-50"
                >
                  <span className="truncate">{name}</span>
                </Link>
              ))}

              {/* then show real categories from the DB (deduped) */}
              {safeCats.filter((c: any) => !['bishow','flowers','hey'].includes(String(c.name).toLowerCase())).slice(0,8).map((c: any) => (
                <Link
                  key={c._id}
                  href={`/shop?category=${encodeURIComponent(c.name)}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 rounded-full border border-gray-100 hover:bg-gray-50"
                >
                  <span className="truncate">{c.name}</span>
                  {typeof c.count === 'number' && <span className="ml-1 text-xs text-gray-400">({c.count})</span>}
                </Link>
              ))}
            </div>

            <div className="mt-4 text-xs text-gray-500">Can't find a category? <Link href="/contact" className="text-sky-600">Tell us</Link></div>
          </div>
        </aside>
      </div>
      </main>
    </div>
  );
}
