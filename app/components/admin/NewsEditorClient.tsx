"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import RichTextEditorClient from "./RichTextEditorClient";

type NewsFormData = {
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  status: "draft" | "published";
  contentHtml: string;
};

export default function NewsEditorClient({
  mode,
  newsId,
  initial,
}: {
  mode: "create" | "edit";
  newsId?: string;
  initial?: Partial<NewsFormData>;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [status, setStatus] = useState<"draft" | "published">(initial?.status || "draft");
  const [contentHtml, setContentHtml] = useState(initial?.contentHtml || "");
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  async function uploadCover(file: File) {
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "ecom_news");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Upload failed");
      setCoverImage(json.url);
      toast.success("Cover image uploaded");
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");
    if (!contentHtml.trim()) return toast.error("Content is required");

    setSaving(true);
    try {
      const payload = {
        title,
        excerpt,
        coverImage,
        category,
        status,
        contentHtml,
      };
      const res = await fetch(mode === "create" ? "/api/admin/news" : `/api/admin/news/${newsId}`, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || JSON.stringify(json));
      toast.success(mode === "create" ? "News created" : "News updated");
      router.push("/admin/news");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Title</label>
            <input
              className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
              placeholder="News headline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Excerpt</label>
            <textarea
              className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2 text-sm min-h-[90px]"
              placeholder="Short summary shown on the news list"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Content</label>
            <div className="mt-2">
              <RichTextEditorClient value={contentHtml} onChange={setContentHtml} />
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Publish settings</h3>
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-xs text-slate-500">Status</label>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-500">Category</label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  placeholder="e.g. Company, Technology"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Cover image</h3>
            <div className="mt-3 space-y-3">
              {coverImage ? (
                <div className="rounded-lg overflow-hidden border border-gray-100">
                  <img src={coverImage} alt="Cover" className="w-full h-48 object-cover" />
                </div>
              ) : (
                <div className="h-40 rounded-lg border border-dashed border-gray-200 bg-slate-50 flex items-center justify-center text-sm text-slate-500">
                  No cover selected
                </div>
              )}

              <label className="block">
                <div className="relative rounded-lg border border-gray-200 px-3 py-2 text-sm text-center cursor-pointer hover:bg-slate-50">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadCover(file);
                      if (e.currentTarget) e.currentTarget.value = "";
                    }}
                    disabled={uploadingCover}
                  />
                  {uploadingCover ? "Uploading..." : "Upload cover image"}
                </div>
              </label>
              <input
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                placeholder="Or paste image URL"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-sky-600 text-white px-4 py-2 text-sm"
            disabled={saving}
          >
            {saving ? "Saving..." : mode === "create" ? "Publish news" : "Save changes"}
          </button>
        </aside>
      </div>
    </form>
  );
}
