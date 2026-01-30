"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Cat = { _id: string; name: string };

export default function ShopFiltersClient({
  categories = [],
  currentCategory,
  minPrice,
  maxPrice,
  initialQuery,
}: {
  categories?: Cat[];
  currentCategory?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  initialQuery?: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localMin, setLocalMin] = useState<string>(minPrice != null ? String(minPrice) : "");
  const [localMax, setLocalMax] = useState<string>(maxPrice != null ? String(maxPrice) : "");

  useEffect(() => {
    setLocalMin(minPrice != null ? String(minPrice) : "");
    setLocalMax(maxPrice != null ? String(maxPrice) : "");
  }, [minPrice, maxPrice]);

  function pushWith(params: URLSearchParams) {
    const base = `/shop`;
    const qs = params.toString();
    router.push(base + (qs ? `?${qs}` : ""));
  }

  function toggleCategory(cat?: string) {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (!cat) {
      params.delete("category");
    } else if (params.get("category") === cat) {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    params.delete("page"); // reset paging when filtering
    pushWith(params);
  }

  function applyPrice(ev?: React.FormEvent) {
    ev?.preventDefault();
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (localMin.trim() === "") params.delete("minPrice");
    else params.set("minPrice", String(Number(localMin) || 0));
    if (localMax.trim() === "") params.delete("maxPrice");
    else params.set("maxPrice", String(Number(localMax) || 0));
    params.delete("page");
    pushWith(params);
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("category");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("page");
    pushWith(params);
  }

  function applyPreset(min?: number, max?: number) {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (min == null) params.delete("minPrice"); else params.set("minPrice", String(min));
    if (max == null) params.delete("maxPrice"); else params.set("maxPrice", String(max));
    params.delete("page");
    pushWith(params);
  }

  return (
    <div className="space-y-4 bg-white text-black p-4 rounded-lg shadow-sm dark:bg-white dark:text-black">
      {/* categories (horizontal) */}
      <div>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">Categories</h4>
          <button onClick={() => toggleCategory(undefined)} className="text-xs text-gray-500 hover:underline">Show all</button>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => toggleCategory(undefined)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm border ${!currentCategory ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-700 border-gray-200'}`}
          >
            All
          </button>

          {categories.map((c) => {
            const isActive = String(currentCategory || '').toLowerCase() === String(c.name || '').toLowerCase();
            return (
              <button
                key={c._id}
                onClick={() => toggleCategory(c.name)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm border ${isActive ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-gray-700 border-gray-200'}`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* price */}
      <div>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">Price</h4>
          <button onClick={() => { setLocalMin(''); setLocalMax(''); }} className="text-xs text-gray-500 hover:underline">Reset</button>
        </div>

        <form onSubmit={applyPrice} className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
          <div className="sm:col-span-2 flex gap-2">
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Min"
              className="w-1/2 px-3 py-2 border rounded-md text-sm"
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
            />
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Max"
              className="w-1/2 px-3 py-2 border rounded-md text-sm"
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-3 py-2 bg-sky-600 text-white rounded-md text-sm">Apply</button>
            <button type="button" onClick={() => applyPreset(0, 50)} className="px-3 py-2 border rounded-md text-sm">Under ₹50</button>
            <button type="button" onClick={() => applyPreset(50, 200)} className="px-3 py-2 border rounded-md text-sm">₹50–₹200</button>
            <button type="button" onClick={() => applyPreset(200, undefined)} className="px-3 py-2 border rounded-md text-sm">Over ₹200</button>
          </div>
        </form>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>Tip: click a category or set a price to filter results.</div>
        <button onClick={clearAll} className="text-xs text-gray-500 hover:underline">Clear filters</button>
      </div>
    </div>
  );
}
