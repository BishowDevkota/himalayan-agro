"use client";

import React from "react";
import Link from "next/link";

export default function ProductCard({ product }: { product: any }) {
  const price = typeof product.price === 'number' ? `₹${product.price.toFixed(2)}` : product.price || '—';

  return (
    <article className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-colors duration-200 border border-gray-100">
      <div className="w-full bg-gray-50 overflow-hidden aspect-[4/3] relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* small status badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {product.isNew && <span className="bg-emerald-500 text-white text-[11px] font-semibold px-2 py-1 rounded">New</span>}
          {product.stock < 1 && <span className="bg-red-600 text-white text-[11px] font-medium px-2 py-1 rounded">Out of stock</span>}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 leading-snug truncate">{product.name}</h3>

        {/* Meta: category + brand (separated and visually distinct) */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {product.category && (
              <span className="inline-block text-xs bg-gray-100 text-black px-2 py-1 rounded-full truncate">{product.category}</span>
            )}
            {product.brand && (
              <span className="inline-block text-xs text-black truncate">{product.brand}</span>
            )}
          </div>

          <div className="text-sky-600 font-extrabold text-sm">{price}</div>
        </div>

        {/* Description (separated) */}
        <p
          className="mt-3 text-sm text-black leading-relaxed overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
          }}
        >
          {product.shortDescription || product.description || 'No description available.'}
        </p>

        {/* Single action */}
        <div className="mt-5">
          <Link
            href={`/product/${product._id}`}
            className="inline-flex w-full items-center justify-center px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            aria-label={`View details for ${product.name}`}
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
