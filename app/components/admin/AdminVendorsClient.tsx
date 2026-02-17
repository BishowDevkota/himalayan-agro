"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

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
    <div className="bg-white/90 border border-slate-100 rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchVendors({ status, q });
          }}
          className="flex items-center gap-3 w-full md:max-w-xl"
        >
          <input
            aria-label="Search vendors"
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm placeholder-slate-400"
            placeholder="Search by store, owner, or email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm" type="submit">Filter</button>
        </form>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-slate-500">Loading…</div>
      ) : vendors.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-500">No vendor requests</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {vendors.map((v: any) => (
            <div key={v._id} className="py-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">V</div>
                    <div>
                      <div className="font-semibold text-slate-900">{v.storeName}</div>
                      <div className="text-sm text-slate-500">Owner: {v.ownerName || "—"}</div>
                      <div className="text-sm text-slate-500">Contact: {v.contactEmail}{v.contactPhone ? ` • ${v.contactPhone}` : ""}</div>
                      <div className="text-xs text-slate-400 mt-1">Applied {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "—"}</div>
                      {v.description ? <div className="mt-2 text-sm text-slate-600">{v.description}</div> : null}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`text-xs px-2 py-1 rounded-full ${v.status === "approved" ? "bg-emerald-50 text-emerald-700" : v.status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>
                    {v.status}
                  </div>
                  <button
                    className="rounded-full bg-slate-900 text-white px-4 py-2 text-sm disabled:opacity-60"
                    onClick={() => updateVendor(v._id, "approved")}
                    disabled={v.status === "approved"}
                  >
                    Approve
                  </button>
                  <button
                    className="rounded-full border border-rose-200 bg-white text-rose-700 px-4 py-2 text-sm disabled:opacity-60"
                    onClick={() => updateVendor(v._id, "rejected")}
                    disabled={v.status === "rejected"}
                  >
                    Reject
                  </button>
                </div>
              </div>
              {v.rejectionReason ? (
                <div className="mt-3 text-xs text-rose-600">Rejected: {v.rejectionReason}</div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
