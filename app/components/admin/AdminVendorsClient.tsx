"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

function statusColor(s: string) {
  if (s === "approved") return "bg-emerald-50 text-emerald-700";
  if (s === "rejected") return "bg-rose-50 text-rose-700";
  return "bg-amber-50 text-amber-700";
}

export default function AdminVendorsClient({ initialVendors = [] }: { initialVendors?: any[] }) {
  const [vendors, setVendors] = useState(initialVendors || []);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchVendors = useCallback(async (opts: { status?: string; q?: string } = {}) => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/vendors", window.location.origin);
      const nextStatus = opts.status ?? status;
      const nextQ = opts.q ?? q;
      if (nextStatus) url.searchParams.set("status", nextStatus);
      if (nextQ) url.searchParams.set("q", nextQ);
      const res = await fetch(url.toString(), { credentials: "same-origin" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load vendors");
      setVendors(json.vendors || []);
    } catch (err: any) {
      toast.error(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [status, q]);

  useEffect(() => {
    if (!initialVendors || initialVendors.length === 0) fetchVendors();
  }, []);

  async function updateVendor(id: string, nextStatus: "approved" | "rejected") {
    const reason = nextStatus === "rejected" ? prompt("Reason for rejection (optional):") || "" : "";
    try {
      const res = await fetch(`/api/admin/vendors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, rejectionReason: reason || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Update failed");
      toast.success("Vendor updated");
      await fetchVendors();
    } catch (err: any) {
      toast.error(err.message || String(err));
    }
  }

  return (
    <div className="text-slate-900 space-y-5">
      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchVendors({ status, q });
          }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" strokeWidth="2"/><path strokeLinecap="round" d="M21 21l-4.35-4.35" strokeWidth="2"/></svg>
              <input
                aria-label="Search vendors"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                placeholder="Search by store, owner, or email..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select className="rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 text-sm font-medium transition-colors" type="submit">Filter</button>
          </div>

          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{vendors.length}</span> vendors
          </div>
        </form>
      </div>

      {/* Vendors Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-800">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Store</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Contact</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Applied</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">Loading…</td></tr>
            )}
            {!loading && vendors.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">No vendor requests.</td></tr>
            )}
            {!loading && vendors.map((v: any) => (
              <tr key={v._id} className="align-top hover:bg-cyan-50/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate text-sm">{v.storeName}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">Owner: {v.ownerName || "—"}</div>
                      {v.description && <div className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{v.description}</div>}
                    </div>
                  </div>
                </td>

                <td className="px-5 py-3.5">
                  <div className="text-sm text-slate-900">{v.contactEmail}</div>
                  {v.contactPhone && <div className="text-xs text-slate-400 mt-0.5">{v.contactPhone}</div>}
                </td>

                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${statusColor(v.status)}`}>
                    {v.status}
                  </span>
                  {v.rejectionReason && (
                    <div className="text-xs text-rose-500 mt-1 max-w-xs truncate">{v.rejectionReason}</div>
                  )}
                </td>

                <td className="px-5 py-3.5 text-sm text-slate-500">
                  {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "—"}
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-40"
                      onClick={() => updateVendor(v._id, "approved")}
                      disabled={v.status === "approved"}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-40"
                      onClick={() => updateVendor(v._id, "rejected")}
                      disabled={v.status === "rejected"}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
