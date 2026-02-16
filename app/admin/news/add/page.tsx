import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../../lib/auth";
import { hasPermission } from "../../../../lib/permissions";
import NewsEditorClient from "../../../components/admin/NewsEditorClient";

export default async function AdminNewsAddPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || !hasPermission(session.user, "news:write")) return <div className="p-12">Unauthorized</div>;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">Add news</h1>
            <p className="mt-2 text-sm text-slate-500">Create a new announcement with a WordPress-like editor.</p>
          </div>
        </div>

        <NewsEditorClient mode="create" />
      </div>
    </main>
  );
}
