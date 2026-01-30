"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

export default function AdminOrdersClient({ initialOrders = [] }: { initialOrders?: any[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string | "">("");

  const orders = initialOrders || [];

  const filtered = useMemo(() => {
    const term = (q || "").trim().toLowerCase();
    return orders.filter((o: any) => {
      if (status && String(o.orderStatus) !== String(status)) return false;
      if (!term) return true;
      if (String(o._id).toLowerCase().includes(term)) return true;
      if ((o.shippingAddress?.name || "").toLowerCase().includes(term)) return true;
      if ((o.shippingAddress?.email || "").toLowerCase().includes(term)) return true;
      if ((o.items || []).some((it: any) => (it.name || "").toLowerCase().includes(term))) return true;
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
    <div className="bg-white text-slate-900">
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label htmlFor="admin-order-search" className="sr-only">Search orders</label>
            <input
              id="admin-order-search"
              className="w-full sm:w-72 rounded-lg border border-gray-200 px-3 py-2 shadow-sm text-slate-900 placeholder:text-slate-400"
              placeholder="Search by id, customer, item..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select className="rounded-lg border border-gray-200 px-3 py-2 text-slate-900" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600">Showing <span className="font-medium text-slate-800">{filtered.length}</span> of <span className="font-medium text-slate-800">{orders.length}</span></div>
            <Link href="/admin/orders" className="inline-flex items-center gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm text-slate-700">Refresh</Link>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-auto">
        <table className="w-full text-sm text-slate-800">
          <thead>
            <tr className="text-left text-xs text-slate-600">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((o: any) => (
              <tr key={o._id} className="align-top">
                <td className="px-4 py-4 w-[14rem]">
                  <div className="font-medium text-slate-900">#{String(o._id).slice(-8)}</div>
                  <div className="text-xs text-slate-500">{o.items.length} items</div>
                </td>

                <td className="px-4 py-4 w-[18rem]">
                  <div className="font-medium text-slate-900">{o.shippingAddress?.name || o.email || '—'}</div>
                  <div className="text-xs text-slate-500 mt-1 truncate">{o.shippingAddress?.phone || o.shippingAddress?.email || ''}</div>
                </td>

                <td className="px-4 py-4 text-slate-800">{o.items.length}</td>

                <td className="px-4 py-4 font-extrabold text-slate-900">{typeof o.totalAmount === 'number' ? `₹${o.totalAmount.toFixed(2)}` : o.totalAmount}</td>

                <td className="px-4 py-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : o.paymentStatus === 'failed' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                    {o.paymentStatus}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${statusColor(o.orderStatus)}`}>
                    {o.orderStatus}
                  </div>
                </td>

                <td className="px-4 py-4 text-sm text-slate-500">{new Date(o.createdAt).toLocaleString()}</td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <a href={`/admin/orders/${o._id}`} className="text-sm text-sky-600">View</a>
                    <a href={`/admin/orders/${o._id}#actions`} className="text-sm text-slate-700">Actions</a>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">No orders match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
