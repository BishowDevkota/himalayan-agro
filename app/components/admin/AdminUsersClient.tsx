"use client";

import React, { useCallback, useEffect, useState } from "react";
import UserRow from "./UserRow";
import UserActionsClient from "./UserActionsClient";
import { toast } from "react-toastify";

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
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRole, setCreateRole] = useState<"user" | "admin">("user");

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
    // fetch on mount if there are no initial users
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
      await fetchUsers({ page: 1 });
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setCreating(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil((total || 0) / perPage));

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex items-center gap-3 w-full max-w-xl">
          <label htmlFor="admin-user-search" className="sr-only">Search users</label>
          <input id="admin-user-search" className="flex-1 rounded-lg border border-gray-200 px-4 py-2 shadow-sm placeholder-gray-400" placeholder="Search by name or email" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="rounded-lg bg-sky-600 text-white px-4 py-2 text-sm" type="submit">Search</button>
        </form>

        <form onSubmit={handleCreate} className="flex items-center gap-3">
          <input className="hidden" />
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-gray-100 rounded-lg px-3 py-2">
            <input className="w-36 bg-transparent text-sm placeholder-gray-400 focus:outline-none" placeholder="name (optional)" value={createName} onChange={(e) => setCreateName(e.target.value)} />
            <input className="w-40 bg-transparent text-sm placeholder-gray-400 focus:outline-none" placeholder="email" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} />
            <input className="w-36 bg-transparent text-sm placeholder-gray-400 focus:outline-none" placeholder="password" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} />
            <select className="bg-transparent text-sm" value={createRole} onChange={(e) => setCreateRole(e.target.value as any)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button className="rounded bg-sky-600 text-white px-3 py-1 text-sm" type="submit" disabled={creating}>{creating ? 'Creating…' : 'Create'}</button>
          </div>

          <a className="sm:hidden rounded bg-sky-600 text-white px-4 py-2 text-sm" href="/register">Create account</a>
        </form>
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="py-8 text-center text-sm text-slate-500">Loading…</div>
        ) : users.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">No users found</div>
        ) : (
          users.map((u: any) => (
            <div key={u._id} className="py-4">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-slate-700 font-bold">{(u.name || u.email || 'U')[0].toUpperCase()}</div>
                    <div>
                      <div className="font-medium text-slate-900">{u.name || '—'}</div>
                      <div className="text-sm text-slate-500">{u.email}</div>
                      <div className="text-xs text-slate-400 mt-1">Joined {new Date(u.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <div className="text-sm text-slate-500">{u.role}</div>
                  <UserActionsClient userId={u._id} initialRole={u.role} initialActive={u.isActive} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-slate-500">{total} users</div>
        <div className="flex items-center gap-2">
          <button className="rounded border border-gray-100 px-3 py-1 text-sm" disabled={page <= 1} onClick={() => { setPage((p) => Math.max(1, p-1)); fetchUsers({ page: Math.max(1, page-1) }); }}>Prev</button>
          <div className="text-sm text-slate-600">Page {page} / {totalPages}</div>
          <button className="rounded bg-sky-600 text-white px-3 py-1 text-sm" disabled={page >= totalPages} onClick={() => { setPage((p) => p+1); fetchUsers({ page: page+1 }); }}>Next</button>
        </div>
      </div>
    </div>
  );
}
