"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function CategoryForm({ initial = null, onSaved }: { initial?: any; onSaved?: (cat: any) => void }) {
  const [name, setName] = useState(initial?.name || "");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name };
      const method = initial ? "PATCH" : "POST";
      const url = initial ? `/api/admin/categories/${initial._id}` : `/api/admin/categories`;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).message || "Save failed");
      const data = await res.json();
      toast.success("Category saved");
      if (onSaved) onSaved(data);
      else router.refresh();
      setName("");
    } catch (err: any) {
      toast.error(err.message || "Unable to save category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 max-w-sm">
      <div>
        <label className="block text-sm font-medium text-slate-700">Name</label>
        <input
          className="mt-2 block w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <button className="rounded-full bg-slate-900 text-white px-5 py-2" disabled={loading}>
          {loading ? 'Saving…' : initial ? 'Save' : 'Create category'}
        </button>
      </div>
    </form>
  );
}
