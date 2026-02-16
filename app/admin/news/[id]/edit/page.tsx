import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../../lib/auth";
import connectToDatabase from "../../../../../lib/mongodb";
import News from "../../../../../models/News";
import { hasPermission } from "../../../../../lib/permissions";
import NewsEditorClient from "../../../../components/admin/NewsEditorClient";

export default async function AdminNewsEditPage({ params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = resolvedParams.id;

  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "news:write")) return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const item = await News.findById(id).lean();
  if (!item) return <div className="p-12">News not found</div>;

  const initial = {
    title: item.title || "",
    excerpt: item.excerpt || "",
    coverImage: item.coverImage || "",
    category: item.category || "",
    status: item.status || "draft",
    contentHtml: item.contentHtml || "",
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Edit news</h1>
            <p className="mt-2 text-sm text-slate-500">Update the content and publish status.</p>
          </div>
        </div>

        <NewsEditorClient mode="edit" newsId={id} initial={initial} />
      </div>
    </main>
  );
}
