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
    <div className="space-y-3">
      <label className="block">
        <div className="relative rounded-lg border-2 border-dashed border-gray-200 bg-white/5 p-5 text-center cursor-pointer hover:border-sky-300 transition-colors">
          <input aria-label="Upload product images" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" multiple accept="image/*" onChange={onFiles} />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="text-sm font-semibold">Upload images</div>
            <div className="text-xs text-slate-400">PNG, JPG — first image will be primary. Drag & drop supported by your browser.</div>
            {uploading && <div className="mt-2 text-sm text-slate-500">Uploading…</div>}
          </div>
        </div>
      </label>

      <div className="flex gap-3 mt-3 flex-wrap">
        {images.map((src, i) => (
          <div key={src + i} className="w-28 h-28 relative rounded-lg overflow-hidden shadow-sm border border-gray-100">
            <img src={src} className="w-full h-full object-cover" alt={`img-${i}`} />
            <button type="button" onClick={() => removeAt(i)} className="absolute top-2 right-2 bg-white/90 text-xs rounded-full w-6 h-6 grid place-items-center">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}