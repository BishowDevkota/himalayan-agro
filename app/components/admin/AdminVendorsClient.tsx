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
    <div className="text-slate-900">
      {/* Search & Filter Bar */}
      <div className="bg-white/90 border border-slate-100 rounded-3xl p-5 shadow-sm mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchVendors({ status, q });
          }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              aria-label="Search vendors"
              className="w-full sm:w-72 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Search by store, owner, or email..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm" type="submit">Filter</button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600">
              Showing <span className="font-medium text-slate-800">{vendors.length}</span> vendors
            </div>
          </div>
        </form>
      </div>

      {/* Vendors Table */}
      <div className="bg-white/90 border border-slate-100 rounded-3xl shadow-sm overflow-auto">
        <table className="w-full text-sm text-slate-800">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-4">Store</th>
              <th className="px-5 py-4">Contact</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Applied</th>
              <th className="px-5 py-4">Actions</th>
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
              <tr key={v._id} className="align-top hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">V</div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{v.storeName}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">Owner: {v.ownerName || "—"}</div>
                      {v.description && <div className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{v.description}</div>}
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="text-sm text-slate-900">{v.contactEmail}</div>
                  {v.contactPhone && <div className="text-xs text-slate-400 mt-0.5">{v.contactPhone}</div>}
                </td>

                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor(v.status)}`}>
                    {v.status}
                  </span>
                  {v.rejectionReason && (
                    <div className="text-xs text-rose-500 mt-1 max-w-xs truncate">{v.rejectionReason}</div>
                  )}
                </td>

                <td className="px-5 py-4 text-sm text-slate-500">
                  {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "—"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 disabled:opacity-40"
                      onClick={() => updateVendor(v._id, "approved")}
                      disabled={v.status === "approved"}
                    >
                      Approve
                    </button>
                    <button
                      className="text-sm font-medium text-rose-600 hover:text-rose-700 disabled:opacity-40"
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
  );
}
