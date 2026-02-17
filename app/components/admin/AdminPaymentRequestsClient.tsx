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
    <div className="text-slate-900">
      {/* Filter Bar */}
      <div className="bg-white/90 border border-slate-100 rounded-3xl p-5 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <select className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900" value={status} onChange={(e) => { setStatus(e.target.value); fetchRequests({ status: e.target.value }); }}>
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600">
              Showing <span className="font-medium text-slate-800">{requests.length}</span> requests
            </div>
          </div>
        </div>
      </div>

      {/* Payment Requests Table */}
      <div className="bg-white/90 border border-slate-100 rounded-3xl shadow-sm overflow-auto">
        <table className="w-full text-sm text-slate-800">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-4">Vendor</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Requested</th>
              <th className="px-5 py-4">Actions</th>
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
              <tr key={r._id} className="align-top hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center font-bold shrink-0">₹</div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{r.storeName || "Vendor"}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">Owner: {r.ownerName || "—"}</div>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 font-extrabold text-slate-900">₹{Number(r.amount || 0).toFixed(2)}</td>

                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor(r.status)}`}>
                    {r.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-slate-500">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      className="text-sm font-medium text-emerald-600 hover:text-emerald-700 disabled:opacity-40"
                      onClick={() => updateStatus(r._id, "approved")}
                      disabled={r.status === "approved"}
                    >
                      Approve
                    </button>
                    <button
                      className="text-sm font-medium text-rose-600 hover:text-rose-700 disabled:opacity-40"
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
  );
}
