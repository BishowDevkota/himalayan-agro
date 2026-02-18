"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DistributerProductsClient({ initialProducts = [] }: { initialProducts?: any[] }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/distributer/products", { credentials: "same-origin" });
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
      const res = await fetch(`/api/distributer/products/${product._id}`, {
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
      const res = await fetch(`/api/distributer/products/${product._id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Delete failed");
      toast.success("Deleted");
      await fetchProducts();
    } catch (err: any) {
      toast.error(err.message || String(err));
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold">Your products</h2>
          <p className="text-sm text-slate-500">Manage your store catalog.</p>
        </div>
        <a className="rounded bg-emerald-600 text-white px-4 py-2 text-sm" href="/store/products/new">Add product</a>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-slate-500">Loading…</div>
      ) : products.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-500">No products yet</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((p: any) => (
            <div key={p._id} className="flex items-center gap-4 border rounded p-3">
              <img src={p.images?.[0] || "/placeholder.png"} className="w-20 h-20 object-cover rounded" alt={p.name} />
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">₹{Number(p.price || 0).toFixed(2)} • {p.brand ? `${p.brand} • ` : ""}{p.category || "—"}</div>
                <div className="text-sm text-gray-500">Stock: {p.stock}</div>
              </div>
              <div className="flex items-center gap-2">
                <a className="text-sm text-emerald-600" href={`/store/products/edit/${p._id}`}>Edit</a>
                <button className="text-sm" onClick={() => toggleActive(p)}>{p.isActive ? "Disable" : "Enable"}</button>
                <button className="text-sm text-rose-600" onClick={() => remove(p)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
