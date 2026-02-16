import React from "react";
import { notFound } from "next/navigation";
import connectToDatabase from "../../../lib/mongodb";
import News from "../../../models/News";

function formatDate(dateValue?: Date | null) {
  if (!dateValue) return "";
  return new Date(dateValue).toLocaleDateString();
}

export default async function NewsDetailPage({ params }: { params: { slug: string } } | { params: Promise<{ slug: string }> }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const slug = resolvedParams.slug;

  await connectToDatabase();
  const item = await News.findOne({ slug, status: "published" }).lean();
  if (!item) return notFound();

  return (
    <main className="bg-white text-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">{item.category || "News"}</span>
          <span>{formatDate(item.publishedAt || item.createdAt)}</span>
        </div>

        <h1 className="text-4xl font-black leading-tight mb-6">{item.title}</h1>

        {item.coverImage ? (
          <div className="rounded-3xl overflow-hidden border border-gray-100 mb-8">
            <img src={item.coverImage} alt={item.title} className="w-full h-auto object-cover" />
          </div>
        ) : null}

        <div className="news-content" dangerouslySetInnerHTML={{ __html: item.contentHtml || "" }} />
      </div>
    </main>
  );
}
