"use client";

import React, { useState } from "react";
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
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

export default function AdminNewsClient({ initialItems }: { initialItems: NewsItem[] }) {
  const [items, setItems] = useState<NewsItem[]>(initialItems || []);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    <section className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">News posts</h2>
          <p className="text-sm text-slate-500 mt-1">Create, edit, and publish news articles.</p>
        </div>
        <a className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm" href="/admin/news/add">Add news</a>
      </div>

      {items.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-500">No news yet</div>
      ) : (
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item._id} className="py-4 flex items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden">
                  {item.coverImage ? (
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div>
                  <div className="font-medium text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-400 mt-1">Slug: {item.slug}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {item.status === "published" ? "Published" : "Draft"} • {formatDate(item.publishedAt || item.updatedAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a className="text-sm text-slate-900" href={`/admin/news/${item._id}/edit`}>Edit</a>
                <a className="text-sm text-slate-600" href={`/news/${item.slug}`} target="_blank" rel="noreferrer">View</a>
                <button
                  className="text-sm text-rose-600"
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                >
                  {deletingId === item._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
