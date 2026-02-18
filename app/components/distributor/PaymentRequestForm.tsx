"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function PaymentRequestForm({ maxAmount }: { maxAmount: number }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount || 0);
    if (!Number.isFinite(value) || value <= 0) return toast.error("Enter a valid amount");
    if (value > maxAmount) return toast.error("Amount exceeds unrealized revenue");

    setLoading(true);
    try {
      const res = await fetch("/api/distributor/payment-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: value }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Request failed");
      toast.success("Payment request submitted");
      router.push("/store/revenue");
    } catch (err: any) {
      toast.error(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="request-amount" className="block text-sm font-medium text-slate-700">Request amount</label>
        <input
          id="request-amount"
          className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          inputMode="decimal"
          min={1}
          max={maxAmount}
          step="0.01"
          placeholder="0.00"
          required
        />
        <div className="mt-2 text-xs text-slate-500">Available to request: ₹{Number(maxAmount || 0).toFixed(2)}</div>
      </div>

      <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-white font-semibold shadow-md hover:bg-emerald-700 disabled:opacity-60" disabled={loading || maxAmount <= 0}>
        {loading ? "Submitting…" : "Request payment"}
      </button>
    </form>
  );
}
