"use client";

import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ProductForm({ initial = null }: { initial?: any }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [brand, setBrand] = useState(initial?.brand || "");
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
      const payload: any = { name, description, brand, price, images, stock };
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
    <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* form */}
      <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Product details</h2>
            <p className="mt-1 text-sm text-slate-500">Add title, description and pricing information. Fields marked * are required.</p>
          </div>
          <div className="text-xs uppercase tracking-wider text-slate-400">Draft</div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name <span className="text-rose-600">*</span></label>
            <input
              className="mt-2 block w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-900"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium text-slate-700">Brand</label>
            <input className="mt-2 block w-full rounded-full border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-900" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium">Category</label>
              <select value={selectedCategoryId} onChange={(e) => { setSelectedCategoryId(e.target.value); }} className="mt-2 block w-full rounded-full border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200">
                <option value="">— none —</option>
                {categories.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.name} ({c.productsCount ?? 0})</option>
                ))}
              </select>
              {initial?.category && !selectedCategoryId && (
                <div className="mt-2 text-sm text-slate-500">Current: <span className="font-medium">{initial.category}</span></div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Short description</label>
            <textarea className="mt-2 block w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 text-slate-800" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
            <div className="mt-2 text-xs text-slate-500">Keep it concise — shown on category cards and listings.</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Price (INR) <span className="text-rose-600">*</span></label>
              <div className="mt-2 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">₹</span>
                <input type="number" step="0.01" className="pl-8 pr-3 w-full rounded-full border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Stock <span className="text-rose-600">*</span></label>
              <input type="number" className="mt-2 block w-full rounded-full border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200" value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Images</label>
            <div className="mt-2">
              <ImageUpload images={images} onChange={setImages} />
              <div className="mt-3 text-xs text-slate-400">Tip: drag high-contrast photos; first image is used as the primary thumbnail.</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white" disabled={loading}>{loading ? 'Saving…' : 'Save product'}</button>
            <a role="button" onClick={() => window.history.back()} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 cursor-pointer">Cancel</a>
            <button type="button" onClick={() => window.open(`/product/preview?name=${encodeURIComponent(name)}`, '_blank')} className="ml-auto rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50">Preview</button>
          </div>
        </div>
      </div>

      {/* aside: live preview + helpers */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <h4 className="text-sm font-semibold text-slate-900">Live preview</h4>

        <div className="mt-4 border border-slate-100 rounded-2xl overflow-hidden">
          <div className="w-full h-44 bg-slate-100 flex items-center justify-center overflow-hidden">
            <img src={images[0] || '/placeholder.png'} alt={name || 'preview'} className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <div className="text-sm font-semibold text-slate-900 truncate">{name || 'Product title'}</div>
            <div className="mt-1 text-sm text-slate-500 truncate">{description ? description.split('\n')[0] : 'Short description will appear here.'}</div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-lg font-extrabold text-slate-900">{typeof price === 'number' && price > 0 ? `₹${Number(price).toFixed(2)}` : '—'}</div>
              <div className="text-sm text-slate-500">Stock: <span className="font-medium">{stock}</span></div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h5 className="text-xs font-semibold text-slate-500 uppercase">Checklist</h5>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>At least one clear image</li>
            <li>Title: 3–60 characters</li>
            <li>Price and stock set</li>
            <li>Assigned to a category (recommended)</li>
          </ul>
        </div>
      </div>
    </form>
  );
}