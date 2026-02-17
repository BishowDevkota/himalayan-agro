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
    <tr className="align-top hover:bg-slate-50/60 transition-colors">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <img src={product.images?.[0] || '/placeholder.png'} className="w-10 h-10 object-cover rounded-2xl" alt={product.name} />
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 truncate">{product.name}</div>
            <div className="text-xs text-slate-400 mt-0.5 truncate">{product.brand || '—'}</div>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 text-slate-600">{product.category || '—'}</td>
      <td className="px-5 py-4 font-extrabold text-slate-900">₹{product.price.toFixed(2)}</td>
      <td className="px-5 py-4">
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {product.stock}
        </span>
      </td>
      <td className="px-5 py-4">
        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
          {product.isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <a className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-sky-600 hover:bg-sky-50 whitespace-nowrap" href={`/admin/products/edit/${product._id}`}>Edit</a>
          <button className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 whitespace-nowrap" onClick={toggleActive} disabled={busy}>{product.isActive ? 'Disable' : 'Enable'}</button>
          <button className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 whitespace-nowrap" onClick={remove} disabled={busy}>Delete</button>
        </div>
      </td>
    </tr>
  );
}