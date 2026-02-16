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

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">News</h1>
            <p className="mt-2 text-sm text-slate-500">Manage your news posts and announcements.</p>
          </div>
        </div>

        <AdminNewsClient initialItems={safe} />
      </div>
    </main>
  );
}
