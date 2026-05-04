"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function DistributorSignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      businessName: String(formData.get("businessName") || "").trim(),
      phoneNumber: String(formData.get("phoneNumber") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
    };

    setLoading(true);
    try {
      const res = await fetch("/api/distributors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to submit distributor application");
      toast.success(json?.message || "Distributor application submitted");
      e.currentTarget.reset();
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.message || "Unable to submit distributor application");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-3xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/70 border border-slate-100">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Apply as a distributor</h2>
        <p className="mt-2 text-sm text-slate-500">Your account will be reviewed by the super admin before buying online.</p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Full name</span>
        <input name="name" required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Business name</span>
        <input name="businessName" required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Phone number</span>
        <input name="phoneNumber" required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Email</span>
        <input type="email" name="email" required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Password</span>
        <input type="password" name="password" minLength={8} required className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
      </label>

      <button type="submit" disabled={loading} className="w-full rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-60">
        {loading ? "Submitting…" : "Submit distributor application"}
      </button>

      <p className="text-xs text-slate-400 leading-5">
        Only approved distributors can place online orders. Normal customers should visit the outlet to buy directly.
      </p>
    </form>
  );
}
