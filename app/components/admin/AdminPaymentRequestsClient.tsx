"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

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

  function statusColor(s: string) {
    if (!s) return "bg-gray-100 text-gray-700";
    if (s === "approved") return "bg-emerald-50 text-emerald-700";
    if (s === "rejected") return "bg-rose-50 text-rose-700";
    return "bg-amber-50 text-amber-700";
  }

  return (
    <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <select className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900" value={status} onChange={(e) => { setStatus(e.target.value); fetchRequests({ status: e.target.value }); }}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-slate-500">Loading…</div>
      ) : requests.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-500">No payment requests</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {requests.map((r: any) => (
            <div key={r._id} className="py-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="font-semibold text-slate-900">{r.storeName || "Vendor"}</div>
                  <div className="text-sm text-slate-500">Owner: {r.ownerName || "—"}</div>
                  <div className="text-xs text-slate-400 mt-1">Requested {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</div>
                </div>

                <div className="text-lg font-black text-slate-900">₹{Number(r.amount || 0).toFixed(2)}</div>

                <div className="flex items-center gap-3">
                  <div className={`text-xs px-2 py-1 rounded-full ${statusColor(r.status)}`}>{r.status}</div>
                  <button
                    className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm disabled:opacity-60"
                    onClick={() => updateStatus(r._id, "approved")}
                    disabled={r.status === "approved"}
                  >
                    Approve
                  </button>
                  <button
                    className="rounded-full border border-rose-200 bg-white text-rose-700 px-4 py-2 text-sm disabled:opacity-60"
                    onClick={() => updateStatus(r._id, "rejected")}
                    disabled={r.status === "rejected"}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
