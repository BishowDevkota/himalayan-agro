"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function CancelOrderButton({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const cancellable = !["shipped", "delivered", "cancelled"].includes(currentStatus);

  async function cancel() {
    if (!cancellable) return;
    if (!confirm("Cancel this order?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Cancel failed");
      toast.success("Order cancelled");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Unable to cancel");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button className={`text-sm ${cancellable ? 'text-red-600' : 'text-gray-400'}`} onClick={cancel} disabled={!cancellable || busy}>{busy ? 'Cancelling…' : 'Cancel order'}</button>
  );
}