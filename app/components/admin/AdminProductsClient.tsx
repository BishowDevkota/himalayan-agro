"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import ProductRow from "./ProductRow";
import { toast } from "react-toastify";

export default function AdminProductsClient({
  initialProducts = [],
  initialTotal = 0,
  initialPage = 1,
  initialPerPage = 20,
  categories = [],
}: {
  initialProducts?: any[];
  initialTotal?: number;
  initialPage?: number;
  initialPerPage?: number;
  categories?: any[];
}) {
  const [products, setProducts] = useState(initialProducts || []);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(initialPage || 1);
  const [perPage, setPerPage] = useState(initialPerPage || 20);
  const [total, setTotal] = useState(initialTotal || 0);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil((total || 0) / perPage));

  const fetchProducts = useCallback(async (opts: { page?: number; q?: string; category?: string } = {}) => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/products', window.location.origin);
      url.searchParams.set('page', String(opts.page ?? page));
      url.searchParams.set('perPage', String(perPage));
      if ((opts.q ?? q) as string) url.searchParams.set('q', (opts.q ?? q) as string);
      if ((opts.category ?? category) as string) url.searchParams.set('category', (opts.category ?? category) as string);
      const res = await fetch(url.toString(), { credentials: 'same-origin' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed to fetch products');
      setProducts((json.items || []).map((p: any) => ({ ...p, _id: String(p._id) })));
      setTotal(json.meta?.total || 0);
      setPage(json.meta?.page || 1);
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [page, perPage, q, category]);

  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) fetchProducts({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    await fetchProducts({ page: 1, q, category });
  }

  const empty = !loading && (!products || products.length === 0);

  return (
    <div>
      <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <form onSubmit={handleSearch} className="flex items-center gap-3 w-full md:max-w-xl">
            <input
              aria-label="Search products"
              className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm placeholder-slate-400"
              placeholder="Search by name, brand or SKU"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <select className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c: any) => (
                <option key={c._id} value={c.name}>{c.name} ({c.productsCount || 0})</option>
              ))}
            </select>

            <button className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm" type="submit">Search</button>
          </form>

          <div className="flex items-center gap-3">
            <a className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm" href="/admin/products/new">New product</a>
            <div className="text-sm text-slate-500">{total} products</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4" disabled /> Bulk select (coming soon)</label>
            <div className="ml-auto">Show <select className="ml-2" value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); fetchProducts({ page: 1 }); }}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select> per page</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading && <div className="py-12 text-center text-sm text-slate-500">Loading…</div>}
        {empty && <div className="py-12 text-center text-sm text-slate-500">No products found</div>}

        {products.map((p: any) => (
          <ProductRow key={p._id} product={p} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-slate-500">Page {page} of {totalPages}</div>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm" disabled={page <= 1} onClick={() => { const np = Math.max(1, page-1); setPage(np); fetchProducts({ page: np }); }}>Prev</button>
          <button className="rounded-full bg-slate-900 text-white px-4 py-1.5 text-sm" disabled={page >= totalPages} onClick={() => { const np = Math.min(totalPages, page+1); setPage(np); fetchProducts({ page: np }); }}>Next</button>
        </div>
      </div>
    </div>
  );
}
