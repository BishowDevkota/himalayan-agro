"use client";

import React, { useMemo, useState } from "react";

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export default function DistributerOrdersClient({ initialOrders = [] }: { initialOrders?: any[] }) {
  const [orders, setOrders] = useState(initialOrders || []);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => {
    const term = (q || "").trim().toLowerCase();
    return (orders || []).filter((o: any) => {
      if (status && String(o.orderStatus) !== String(status)) return false;
      if (!term) return true;
      if (String(o._id).toLowerCase().includes(term)) return true;
      if ((o.shippingAddress?.name || "").toLowerCase().includes(term)) return true;
      if ((o.vendorItems || []).some((it: any) => (it.name || "").toLowerCase().includes(term))) return true;
      return false;
    });
  }, [orders, q, status]);


  function statusColor(s: string) {
    if (!s) return "bg-gray-100 text-gray-700";
    if (s === "delivered") return "bg-emerald-50 text-emerald-700";
    if (s === "processing") return "bg-amber-50 text-amber-700";
    if (s === "shipped") return "bg-sky-50 text-sky-700";
    if (s === "cancelled") return "bg-red-50 text-red-700";
    return "bg-gray-100 text-gray-700";
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input
            aria-label="Search orders"
            className="w-full sm:w-72 rounded-lg border border-gray-200 px-3 py-2 shadow-sm text-slate-900 placeholder:text-slate-400"
            placeholder="Search by id, customer, item"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className="rounded-lg border border-gray-200 px-3 py-2 text-slate-900" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="text-sm text-slate-600">Showing <span className="font-medium text-slate-800">{filtered.length}</span> of <span className="font-medium text-slate-800">{orders.length}</span></div>
      </div>

      <div className="space-y-4">
        {filtered.map((o: any) => (
          <div key={o._id} className="border border-gray-100 rounded-xl p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-sm text-slate-500">Order</div>
                <div className="font-semibold text-slate-900">#{String(o._id).slice(-8)}</div>
                <div className="text-xs text-slate-400 mt-1">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}</div>
              </div>

              <div>
                <div className="text-sm text-slate-500">Customer</div>
                <div className="text-sm text-slate-900">{o.shippingAddress?.name || "—"}</div>
                <div className="text-xs text-slate-400">{o.shippingAddress?.phone || ""}</div>
              </div>

              <div>
                <div className="text-sm text-slate-500">Distributer total</div>
                <div className="text-lg font-extrabold text-slate-900">₹{Number(o.vendorTotal || 0).toFixed(2)}</div>
              </div>

              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${statusColor(o.orderStatus)}`}>
                  {o.orderStatus}
                </div>
              </div>

              <div className="text-xs text-slate-400">Status is managed by admin</div>
            </div>

            <div className="mt-4 text-sm text-slate-600">
              {o.vendorItems?.length ? (
                <div className="space-y-1">
                  {o.vendorItems.map((it: any, idx: number) => (
                    <div key={`${o._id}-${idx}`} className="flex items-center justify-between">
                      <div className="truncate">{it.name}</div>
                      <div className="text-slate-500">{it.quantity} × ₹{Number(it.price || 0).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No distributer items</div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">No orders found</div>
        ) : null}
      </div>
    </div>
  );
}
