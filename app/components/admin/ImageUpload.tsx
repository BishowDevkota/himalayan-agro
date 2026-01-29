"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ImageUpload({ images = [], onChange }: { images?: string[]; onChange: (imgs: string[]) => void }) {
  const [uploading, setUploading] = useState(false);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !files.length) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch(`/api/admin/upload`, { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'upload failed');
        uploaded.push(json.url);
      }
      const next = [...images, ...uploaded];
      onChange(next);
      toast.success("Images uploaded");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(i: number) {
    const next = images.slice();
    next.splice(i, 1);
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 rounded bg-white border px-3 py-2 cursor-pointer">
          <input type="file" className="hidden" multiple accept="image/*" onChange={onFiles} />
          <span className="text-sm">Upload images</span>
        </label>
        {uploading && <div className="text-sm text-gray-500">Uploading…</div>}
      </div>
      <div className="flex gap-3 mt-2 flex-wrap">
        {images.map((src, i) => (
          <div key={src + i} className="w-28 h-28 relative border rounded overflow-hidden">
            <img src={src} className="w-full h-full object-cover" alt={`img-${i}`} />
            <button type="button" onClick={() => removeAt(i)} className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}