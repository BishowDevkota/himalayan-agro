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
      {/* Toolbar */}
      <div className="bg-white/90 border border-slate-100 rounded-3xl p-4 shadow-sm mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              aria-label="Search products"
              className="w-full sm:w-60 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400"
              placeholder="Search by name, brand or SKU"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c: any) => (
                <option key={c._id} value={c.name}>{c.name} ({c.productsCount || 0})</option>
              ))}
            </select>
            <button className="rounded-full bg-slate-900 text-white px-4 py-1.5 text-xs font-medium whitespace-nowrap" type="submit">Search</button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500">Showing <span className="font-medium text-slate-800">{products.length}</span> of <span className="font-medium text-slate-800">{total}</span></div>
            <a className="rounded-full bg-slate-900 text-white px-4 py-1.5 text-xs font-medium whitespace-nowrap" href="/admin/products/new">New product</a>
          </div>
        </form>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <label className="flex items-center gap-2"><input type="checkbox" className="h-3.5 w-3.5" disabled /> Bulk select (coming soon)</label>
          <div>Show <select className="ml-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-900" value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); fetchProducts({ page: 1 }); }}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select> per page</div>
        </div>
      </div>

      {/* Product table */}
      <div className="bg-white/90 border border-slate-100 rounded-3xl shadow-sm overflow-auto">
        <table className="w-full text-sm text-slate-800">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">Loading…</td></tr>
            )}
            {empty && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">No products found.</td></tr>
            )}
            {!loading && products.map((p: any) => (
              <ProductRow key={p._id} product={p} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-xs text-slate-500">Page {page} of {totalPages}</div>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs text-slate-700 font-medium" disabled={page <= 1} onClick={() => { const np = Math.max(1, page-1); setPage(np); fetchProducts({ page: np }); }}>Prev</button>
          <button className="rounded-full bg-slate-900 text-white px-4 py-1.5 text-xs font-medium" disabled={page >= totalPages} onClick={() => { const np = Math.min(totalPages, page+1); setPage(np); fetchProducts({ page: np }); }}>Next</button>
        </div>
      </div>
    </div>
  );
}
