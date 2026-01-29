"use client";

import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ProductForm({ initial = null }: { initial?: any }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [price, setPrice] = useState(initial?.price || 0);
  const [categories, setCategories] = useState<Array<any>>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [images, setImages] = useState<string[]>(initial?.images || []);
  const [stock, setStock] = useState(initial?.stock || 0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    let mounted = true;
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        setCategories(data.categories || []);
        // if editing, pick the category id that matches the product's category name
        if (initial?.category) {
          const match = (data.categories || []).find((c: any) => c.name === initial.category);
          if (match) setSelectedCategoryId(match._id);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [initial]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = { name, description, price, images, stock };
      // prefer selected category id (from dropdown). If editing and no selection was changed, preserve initial category.
      if (selectedCategoryId) payload.category = selectedCategoryId;
      else if (initial?.category) payload.category = initial.category;

      const method = initial ? "PATCH" : "POST";
      const url = initial ? `/api/products/${initial._id}` : `/api/products`;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error((await res.json()).message || "Save failed");
      toast.success("Product saved");
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err.message || "Unable to save product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-3xl">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input className="mt-1 block w-full rounded border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea className="mt-1 block w-full rounded border px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input type="number" step="0.01" className="mt-1 block w-full rounded border px-3 py-2" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Stock</label>
          <input type="number" className="mt-1 block w-full rounded border px-3 py-2" value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Category</label>
        <select value={selectedCategoryId} onChange={(e) => { setSelectedCategoryId(e.target.value); }} className="mt-1 block w-full rounded border px-3 py-2">
          <option value="">— none —</option>
          {categories.map((c: any) => (
            <option key={c._id} value={c._id}>{c.name} ({c.productsCount ?? 0})</option>
          ))}
        </select>
        {initial?.category && !selectedCategoryId && (
          <div className="mt-2 text-sm text-gray-500">Current category: <span className="font-medium">{initial.category}</span></div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Images</label>
        <ImageUpload images={images} onChange={setImages} />
      </div>
      <div>
        <button className="rounded bg-sky-600 text-white px-4 py-2" disabled={loading}>{loading ? 'Saving…' : 'Save product'}</button>
      </div>
    </form>
  );
}