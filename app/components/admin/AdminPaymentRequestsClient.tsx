"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

function statusColor(s: string) {
  if (!s) return "bg-gray-100 text-gray-700";
  if (s === "approved") return "bg-emerald-50 text-emerald-700";
  if (s === "rejected") return "bg-rose-50 text-rose-700";
  return "bg-amber-50 text-amber-700";
}

export default function AdminPaymentRequestsClient({ initialRequests = [] }: { initialRequests?: any[] }) {
  const [requests, setRequests] = useState(initialRequests || []);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async (opts: { status?: string } = {}) => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/payment-requests", window.location.origin);
      const nextStatus = opts.status ?? status;
      if (nextStatus) url.searchParams.set("status", nextStatus);
      const res = await fetch(url.toString(), { credentials: "same-origin" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load requests");
      setRequests(json.requests || []);
    } catch (err: any) {
      toast.error(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (!initialRequests || initialRequests.length === 0) fetchRequests();
  }, []);

  async function updateStatus(id: string, nextStatus: "approved" | "rejected") {
    if (!confirm("Update payment request?")) return;
    try {
      const res = await fetch(`/api/admin/payment-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Update failed");
      toast.success("Request updated");
      await fetchRequests({ status });
    } catch (err: any) {
      toast.error(err.message || String(err));
    }
  }

  return (
    <div className="text-slate-900 space-y-5">
      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <select className="rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all" value={status} onChange={(e) => { setStatus(e.target.value); fetchRequests({ status: e.target.value }); }}>
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{requests.length}</span> requests
          </div>
        </div>
      </div>

      {/* Payment Requests Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-800">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Distributer</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Amount</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Status</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Requested</th>
              <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">Loading…</td></tr>
            )}
            {!loading && requests.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-400">No payment requests.</td></tr>
            )}
            {!loading && requests.map((r: any) => (
              <tr key={r._id} className="align-top hover:bg-cyan-50/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate text-sm">{r.storeName || "Distributer"}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">Owner: {r.ownerName || "—"}</div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-3.5 font-bold text-slate-900">₹{Number(r.amount || 0).toFixed(2)}</td>

                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${statusColor(r.status)}`}>
                    {r.status}
                  </span>
                </td>

                <td className="px-5 py-3.5 text-sm text-slate-500">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                </td>

                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-40"
                      onClick={() => updateStatus(r._id, "approved")}
                      disabled={r.status === "approved"}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-40"
                      onClick={() => updateStatus(r._id, "rejected")}
                      disabled={r.status === "rejected"}
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
