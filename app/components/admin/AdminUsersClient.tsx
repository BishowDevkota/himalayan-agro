"use client";

import React, { useCallback, useEffect, useState } from "react";
import UserActionsClient from "./UserActionsClient";
import { toast } from "react-toastify";

function roleColor(r: string) {
  if (r === "admin") return "bg-amber-50 text-amber-700";
  if (r === "vendor") return "bg-emerald-50 text-emerald-700";
  return "bg-slate-100 text-slate-700";
}

export default function AdminUsersClient({
  initialUsers = [],
  initialTotal = 0,
  initialPage = 1,
  initialPerPage = 20,
}: {
  initialUsers?: any[];
  initialTotal?: number;
  initialPage?: number;
  initialPerPage?: number;
}) {
  const [users, setUsers] = useState(initialUsers || []);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(initialPage || 1);
  const [perPage, setPerPage] = useState(initialPerPage || 20);
  const [total, setTotal] = useState(initialTotal || 0);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRole, setCreateRole] = useState<"user" | "admin" | "vendor">("user");

  const fetchUsers = useCallback(async (opts: { page?: number; q?: string } = {}) => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/users', window.location.origin);
      url.searchParams.set('page', String(opts.page ?? page));
      url.searchParams.set('perPage', String(perPage));
      if (opts.q ?? q) url.searchParams.set('q', (opts.q ?? q) as string);
      const res = await fetch(url.toString(), { credentials: 'same-origin' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Failed to fetch users');
      setUsers(json.users || []);
      setTotal(json.total || 0);
      setPage(json.page || 1);
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [page, perPage, q]);

  useEffect(() => {
    if (!initialUsers || initialUsers.length === 0) fetchUsers({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    await fetchUsers({ page: 1, q });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createEmail || !createPassword) return toast.error('Email and password required');
    if (createPassword.length < 8) return toast.error('Password must be at least 8 characters');
    setCreating(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: createName || undefined, email: createEmail, password: createPassword, role: createRole }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || JSON.stringify(json));
      toast.success('User created');
      setCreateName('');
      setCreateEmail('');
      setCreatePassword('');
      setCreateRole('user');
      setShowCreate(false);
      await fetchUsers({ page: 1 });
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setCreating(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil((total || 0) / perPage));

  return (
    <div className="text-slate-900 space-y-5">
      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <form onSubmit={handleSearch} className="flex items-center gap-3 w-full sm:w-auto">
            <label htmlFor="admin-user-search" className="sr-only">Search users</label>
            <div className="relative w-full sm:w-72">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path strokeLinecap="round" d="M21 21l-4.35-4.35" strokeWidth="2"/></svg>
              <input
                id="admin-user-search"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                placeholder="Search by name or email..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <button className="rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-sm font-medium transition-colors" type="submit">Search</button>
          </form>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{users.length}</span> of <span className="font-semibold text-slate-700">{total}</span>
            </div>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${showCreate ? 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-sm' : 'bg-cyan-600 hover:bg-cyan-700 text-white'}`}
              onClick={() => setShowCreate(!showCreate)}
            >
              {showCreate ? "Cancel" : "+ Create user"}
            </button>
          </div>
        </div>

        {/* Inline Create Form */}
        {showCreate && (
          <form onSubmit={handleCreate} className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Name</label>
              <input className="w-36 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" placeholder="optional" value={createName} onChange={(e) => setCreateName(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Email</label>
              <input className="w-48 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" placeholder="email" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Password</label>
              <input className="w-36 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" placeholder="min 8 chars" type="password" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5">Role</label>
              <select className="rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" value={createRole} onChange={(e) => setCreateRole(e.target.value as any)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>
            <button className="rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50" type="submit" disabled={creating}>
              {creating ? 'Creating…' : 'Create'}
            </button>
          </form>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-800">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">User</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Role</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Joined</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">Loading…</td></tr>
            )}
            {!loading && users.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">No users found.</td></tr>
            )}
            {!loading && users.map((u: any) => (
              <tr key={u._id} className="align-top hover:bg-cyan-50/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 font-bold text-sm shrink-0">
                      {(u.name || u.email || 'U')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate text-sm">{u.name || '—'}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">{u.email}</div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${roleColor(u.role)}`}>
                    {u.role}
                  </span>
                </td>

                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>

                <td className="px-5 py-3.5 text-sm text-slate-500">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                </td>

                <td className="px-5 py-3.5">
                  <UserActionsClient userId={u._id} initialRole={u.role} initialActive={u.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">Page <span className="font-medium text-slate-700">{page}</span> of <span className="font-medium text-slate-700">{totalPages}</span></div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition-colors shadow-sm disabled:opacity-40" disabled={page <= 1} onClick={() => { setPage((p) => Math.max(1, p-1)); fetchUsers({ page: Math.max(1, page-1) }); }}>Prev</button>
          <button className="rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40" disabled={page >= totalPages} onClick={() => { setPage((p) => p+1); fetchUsers({ page: page+1 }); }}>Next</button>
        </div>
      </div>
    </div>
  );
}
