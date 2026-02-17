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

  const adminCount = safeUsers.filter((u: any) => u.role === 'admin').length;
  const vendorCount = safeUsers.filter((u: any) => u.role === 'vendor').length;
  const activeCount = safeUsers.filter((u: any) => u.isActive).length;

  return (
    <main className="pb-16">
      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-sky-600">Access</span>
            <h1 className="mt-3 text-4xl font-black text-slate-900">User management</h1>
            <p className="mt-3 text-sm text-slate-500">
              Manage users, roles and activation status.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/admin/users"
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
                <div className="text-xs uppercase tracking-widest text-slate-400">Total Users</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{total}</div>
                <div className="mt-2 text-sm text-slate-400">Registered accounts</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 font-bold">U</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Admins</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{adminCount}</div>
                <div className="mt-2 text-sm text-slate-400">Admin role users</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-bold">A</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Vendors</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{vendorCount}</div>
                <div className="mt-2 text-sm text-slate-400">Vendor accounts</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 font-bold">V</div>
            </div>
          </div>

          <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Active</div>
                <div className="mt-3 text-3xl font-black text-slate-900">{activeCount}</div>
                <div className="mt-2 text-sm text-slate-400">Currently active</div>
              </div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 font-bold">✓</div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-8">
          <AdminUsersClient
            initialUsers={safeUsers}
            initialTotal={Number(total || 0)}
            initialPage={page}
            initialPerPage={perPage}
          />
        </div>
      </div>
    </main>
  );
}
