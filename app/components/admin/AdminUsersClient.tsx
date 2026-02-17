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
    <div className="text-slate-900">
      {/* Search & Filter Bar */}
      <div className="bg-white/90 border border-slate-100 rounded-3xl p-5 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <form onSubmit={handleSearch} className="flex items-center gap-3 w-full sm:w-auto">
            <label htmlFor="admin-user-search" className="sr-only">Search users</label>
            <input
              id="admin-user-search"
              className="w-full sm:w-72 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Search by name or email..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm" type="submit">Search</button>
          </form>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600">
              Showing <span className="font-medium text-slate-800">{users.length}</span> of <span className="font-medium text-slate-800">{total}</span>
            </div>
            <button
              className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm"
              onClick={() => setShowCreate(!showCreate)}
            >
              {showCreate ? "Cancel" : "Create user"}
            </button>
          </div>
        </div>

        {/* Inline Create Form */}
        {showCreate && (
          <form onSubmit={handleCreate} className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Name</label>
              <input className="w-36 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400" placeholder="optional" value={createName} onChange={(e) => setCreateName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Email</label>
              <input className="w-48 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400" placeholder="email" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Password</label>
              <input className="w-36 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400" placeholder="min 8 chars" type="password" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Role</label>
              <select className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900" value={createRole} onChange={(e) => setCreateRole(e.target.value as any)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>
            <button className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm" type="submit" disabled={creating}>
              {creating ? 'Creating…' : 'Create'}
            </button>
          </form>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white/90 border border-slate-100 rounded-3xl shadow-sm overflow-auto">
        <table className="w-full text-sm text-slate-800">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-4">User</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Joined</th>
              <th className="px-5 py-4">Actions</th>
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
              <tr key={u._id} className="align-top hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900/5 flex items-center justify-center text-slate-700 font-bold shrink-0">
                      {(u.name || u.email || 'U')[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{u.name || '—'}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">{u.email}</div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roleColor(u.role)}`}>
                    {u.role}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-slate-500">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                </td>

                <td className="px-5 py-4">
                  <UserActionsClient userId={u._id} initialRole={u.role} initialActive={u.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-slate-500">Page {page} of {totalPages}</div>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm text-slate-700" disabled={page <= 1} onClick={() => { setPage((p) => Math.max(1, p-1)); fetchUsers({ page: Math.max(1, page-1) }); }}>Prev</button>
          <button className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm" disabled={page >= totalPages} onClick={() => { setPage((p) => p+1); fetchUsers({ page: page+1 }); }}>Next</button>
        </div>
      </div>
    </div>
  );
}
