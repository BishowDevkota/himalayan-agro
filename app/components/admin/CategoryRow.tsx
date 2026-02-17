"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

export default function CategoryRow({ category }: { category: any }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name || "");
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${category._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
      if (!res.ok) throw new Error((await res.json()).message || 'Save failed');
      toast.success('Saved');
      setEditing(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || 'Unable to save');
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (!confirm(`Delete category "${category.name}"? This will unset the category on its products.`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${category._id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).message || 'Delete failed');
      toast.success('Deleted');
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || 'Unable to delete');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 border border-slate-100 bg-white rounded-2xl p-4">
      <div>
        {editing ? (
          <input className="rounded-full border border-slate-200 px-3 py-1.5 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
        ) : (
          <div className="font-medium text-slate-900">
            {category.name} <span className="text-sm text-slate-400">({(category.products || []).length})</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {editing ? (
          <>
            <button className="text-sm text-slate-900" onClick={save} disabled={loading}>{loading ? 'Saving…' : 'Save'}</button>
            <button className="text-sm text-slate-500" onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="text-sm text-slate-900" onClick={() => setEditing(true)}>Edit</button>
            <button className="text-sm text-rose-600" onClick={remove} disabled={loading}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
