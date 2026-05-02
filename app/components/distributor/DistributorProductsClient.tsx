"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DistributorProductsClient({ initialProducts = [] }: { initialProducts?: any[] }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/distributor/products", { credentials: "same-origin" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load products");
      setProducts((json.items || []).map((p: any) => ({ ...p, _id: String(p._id) })));
    } catch (err: any) {
      toast.error(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialProducts || initialProducts.length === 0) fetchProducts();
  }, []);

  async function toggleActive(product: any) {
    try {
      const res = await fetch(`/api/distributor/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Update failed");
      toast.success("Updated");
      await fetchProducts();
    } catch (err: any) {
      toast.error(err.message || String(err));
    }
  }

  async function remove(product: any) {
    if (!confirm("Delete product? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/distributor/products/${product._id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Delete failed");
      toast.success("Deleted");
      await fetchProducts();
    } catch (err: any) {
      toast.error(err.message || String(err));
    }
  }

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Your products</h2>
          <p className="text-sm text-slate-500">Manage your store catalog with quick actions.</p>
        </div>
        <a className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-sm font-medium transition-colors shadow-sm" href="/store/products/new">Add product</a>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-slate-500">Loading…</div>
      ) : products.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-500">No products yet</div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {products.map((p: any) => (
            <div key={p._id} className="flex flex-col md:flex-row md:items-center gap-4 border border-slate-200 rounded-xl p-3.5 hover:bg-slate-50/60 transition-colors">
              <img src={p.images?.[0] || "/placeholder.png"} className="w-20 h-20 object-cover rounded-lg border border-slate-200" alt={p.name} />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-900 truncate">{p.name}</div>
                <div className="text-sm text-slate-600">₹{Number(p.price || 0).toFixed(2)} • {p.brand ? `${p.brand} • ` : ""}{p.category || "—"}</div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <span className={`px-2 py-0.5 rounded-full ${p.isActive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{p.isActive ? "Active" : "Disabled"}</span>
                  <span>Stock: {p.stock}{p.unit ? ` ${p.unit}` : ' units'}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white" href={`/store/products/edit/${p._id}`}>Edit</a>
                <button className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white" onClick={() => toggleActive(p)}>{p.isActive ? "Disable" : "Enable"}</button>
                <button className="inline-flex items-center rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50" onClick={() => remove(p)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
