"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ProductRow({ product }: { product: any }) {
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm("Delete product? This action cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).message || 'delete failed');
      toast.success('Deleted');
      location.reload();
    } catch (err: any) {
      toast.error(err.message || 'Unable to delete');
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive() {
    setBusy(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, { method: "PATCH", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !product.isActive }) });
      if (!res.ok) throw new Error((await res.json()).message || 'update failed');
      toast.success('Updated');
      location.reload();
    } catch (err: any) {
      toast.error(err.message || 'Unable to update');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 border border-slate-100 bg-white rounded-3xl p-4">
      <img src={product.images?.[0] || '/placeholder.png'} className="w-20 h-20 object-cover rounded-2xl" alt={product.name} />
      <div className="flex-1">
        <div className="font-semibold text-slate-900">{product.name}</div>
        <div className="text-sm text-slate-500">${product.price.toFixed(2)} • {product.brand ? `${product.brand} • ` : ''}{product.category}</div>
        <div className="text-sm text-slate-400">Stock: {product.stock}</div>
      </div>
      <div className="flex items-center gap-3">
        <a className="text-sm text-slate-900" href={`/admin/products/edit/${product._id}`}>Edit</a>
        <button className="text-sm text-slate-600" onClick={toggleActive} disabled={busy}>{product.isActive ? 'Disable' : 'Enable'}</button>
        <button className="text-sm text-rose-600" onClick={remove} disabled={busy}>Delete</button>
      </div>
    </div>
  );
}