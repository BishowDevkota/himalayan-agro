"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed"];

export default function AdminOrderActions({ orderId, initialOrderStatus, initialPaymentStatus }: { orderId: string; initialOrderStatus: string; initialPaymentStatus: string }) {
  const [orderStatus, setOrderStatus] = useState(initialOrderStatus);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function save() {
    if (!confirm('Apply status changes?')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Update failed');
      toast.success('Order updated');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Unable to update order');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="text-sm text-gray-600">Order actions</div>
      <div className="mt-3 space-y-3">
        <div>
          <label className="block text-sm">Order status</label>
          <select className="mt-1 block w-full rounded border px-3 py-2" value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm">Payment status</label>
          <select className="mt-1 block w-full rounded border px-3 py-2" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <button className="w-full rounded bg-sky-600 text-white py-2" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save changes'}</button>
        </div>
      </div>
    </div>
  );
}