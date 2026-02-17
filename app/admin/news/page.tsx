import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import connectToDatabase from "../../../lib/mongodb";
import News from "../../../models/News";
import AdminNewsClient from "../../components/admin/AdminNewsClient";
import { hasPermission } from "../../../lib/permissions";

export default async function AdminNewsPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "news:read")) return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const items = await News.find({}).sort({ createdAt: -1 }).lean();
  const safe = items.map((n: any) => ({
    _id: String(n._id),
    title: n.title,
    slug: n.slug,
    status: n.status,
    category: n.category || "",
    coverImage: n.coverImage || "",
    updatedAt: n.updatedAt ? new Date(n.updatedAt).toISOString() : null,
    publishedAt: n.publishedAt ? new Date(n.publishedAt).toISOString() : null,
  }));

  const publishedCount = safe.filter((n: any) => n.status === "published").length;
  const draftCount = safe.filter((n: any) => n.status === "draft").length;
  const categories = [...new Set(safe.map((n: any) => n.category).filter(Boolean))];

  return (
    <main className="pb-16">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-sky-600">Content</span>
            <h1 className="mt-3 text-4xl font-black text-slate-900">News</h1>
            <p className="mt-3 text-sm text-slate-500">
              Manage your news posts and announcements — search, filter and publish.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/admin/news/add"
              className="rounded-full bg-slate-900 text-white px-5 py-2.5 text-sm"
            >
              Add news
            </a>
            <a
              href="/admin/news"
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-700"
            >
              Refresh
            </a>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Total Posts</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{safe.length}</div>
                <div className="mt-2 text-sm text-slate-400">All news articles</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 font-bold">N</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Published</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{publishedCount}</div>
                <div className="mt-2 text-sm text-slate-400">Live &amp; visible</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-bold">P</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Drafts</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{draftCount}</div>
                <div className="mt-2 text-sm text-slate-400">Awaiting publish</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-bold">D</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Categories</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{categories.length}</div>
                <div className="mt-2 text-sm text-slate-400">Unique topics</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 font-bold">C</div>
            </div>
          </div>
        </div>

        {/* News Table */}
        <div className="mt-8">
          <AdminNewsClient initialItems={safe} />
        </div>
      </div>
    </main>
  );
}
