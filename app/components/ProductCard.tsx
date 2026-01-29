"use client";

import React from "react";
import Link from "next/link";

export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <Link href={`/product/${product._id}`} className="block">
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name}
          className="w-full h-56 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link href={`/product/${product._id}`} className="block">
          <h3 className="font-medium">{product.name}</h3>
        </Link>
        {product.brand && <div className="text-xs text-gray-500">{product.brand}</div>}
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm text-gray-600">${product.price.toFixed(2)}</div>
          <div className="text-xs text-gray-500">{product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}</div>
        </div>
      </div>
    </div>
  );
}