import React from "react";
import connectToDatabase from "../../../lib/mongodb";
import User from "../../../models/User";
import { getServerSession } from "next-auth/next";
import authOptions from "../../../lib/auth";
import AdminUsersClient from "../../components/admin/AdminUsersClient";

export default async function AdminUsersPage({ searchParams }: { searchParams?: { page?: string } }) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user?.role !== 'admin') return <div className="p-12">Unauthorized</div>;

  await connectToDatabase();
  const page = Math.max(1, parseInt(((searchParams as any)?.page as string) || '1', 10));
  const perPage = 20;

  const [total, users] = await Promise.all([
    User.countDocuments({}),
    User.find({}).sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage).select('name email role isActive createdAt').lean(),
  ]);

  // Convert any non-serializable fields (ObjectId, Date) into plain values
  const safeUsers = (users || []).map((u: any) => ({
    _id: String(u._id),
    name: u.name || null,
    email: u.email || null,
    role: u.role || 'user',
    isActive: !!u.isActive,
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
  }));

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold">User management</h1>
            <p className="mt-2 text-sm text-slate-500">Manage users, roles and activation status.</p>
          </div>
        </div>

        <AdminUsersClient initialUsers={safeUsers} initialTotal={Number(total || 0)} initialPage={page} initialPerPage={perPage} />
      </div>
    </main>
  );
}
