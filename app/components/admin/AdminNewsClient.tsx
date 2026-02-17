"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

type NewsItem = {
  _id: string;
  title: string;
  slug: string;
  status: string;
  category?: string;
  coverImage?: string;
  updatedAt?: string | null;
  publishedAt?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

function statusColor(s: string) {
  if (s === "published") return "bg-emerald-50 text-emerald-700";
  if (s === "draft") return "bg-amber-50 text-amber-700";
  return "bg-gray-100 text-gray-700";
}

export default function AdminNewsClient({ initialItems }: { initialItems: NewsItem[] }) {
  const [items, setItems] = useState<NewsItem[]>(initialItems || []);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");

  const filtered = useMemo(() => {
    const term = (q || "").trim().toLowerCase();
    return items.filter((n) => {
      if (status && n.status !== status) return false;
      if (!term) return true;
      if (n.title.toLowerCase().includes(term)) return true;
      if (n.slug.toLowerCase().includes(term)) return true;
      if ((n.category || "").toLowerCase().includes(term)) return true;
      return false;
    });
  }, [items, q, status]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this news item? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Delete failed");
      setItems((prev) => prev.filter((n) => n._id !== id));
      toast.success("News deleted");
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="text-slate-900">
      {/* Search & Filter Bar */}
      <div className="bg-white/90 border border-slate-100 rounded-3xl p-5 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label htmlFor="admin-news-search" className="sr-only">Search news</label>
            <input
              id="admin-news-search"
              className="w-full sm:w-72 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Search by title, slug, category..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600">
              Showing <span className="font-medium text-slate-800">{filtered.length}</span> of <span className="font-medium text-slate-800">{items.length}</span>
            </div>
            <a href="/admin/news" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">Refresh</a>
          </div>
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white/90 border border-slate-100 rounded-3xl shadow-sm overflow-auto">
        <table className="w-full text-sm text-slate-800">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-4">Article</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <tr key={item._id} className="align-top hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden shrink-0">
                      {item.coverImage ? (
                        <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-lg font-bold">N</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{item.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">{item.slug}</div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  {item.category ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusColor(item.status)}`}>
                    {item.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-slate-500">
                  {formatDate(item.publishedAt || item.updatedAt)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <a href={`/admin/news/${item._id}/edit`} className="text-sm font-medium text-sky-600 hover:text-sky-700">Edit</a>
                    <a href={`/news/${item.slug}`} target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-slate-700">View</a>
                    <button
                      className="text-sm text-rose-600 hover:text-rose-700"
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                    >
                      {deletingId === item._id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">No news articles match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
