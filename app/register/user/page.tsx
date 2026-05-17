"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

export default function UserRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phoneNumber }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Registration failed");
      toast.success("Account created successfully");
      const signInRes = await signIn("credentials", { redirect: false, email, password });
      if (signInRes?.error) {
        router.push("/login");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      toast.error(err.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-4 pt-32 sm:pt-36 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr] lg:items-stretch">
        <div className="rounded-[2rem] bg-slate-900 p-8 sm:p-10 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden h-full flex flex-col">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">User registration</p>
          <h1 className="mt-4 text-3xl sm:text-5xl font-black leading-tight">Buy online with eSewa payment.</h1>
          <p className="mt-5 max-w-xl text-sm sm:text-base text-slate-300 leading-7">
            Regular users can register to buy products online. Pay via eSewa and collect your order from the outlet.
            No credit system - immediate payment required.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">No admin approval required</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Pay instantly via eSewa</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Collect order at outlet</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Simple registration</div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/outlet" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Visit outlet</a>
            <a href="/login" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Sign in</a>
          </div>
        </div>

        <div className="h-full">
          <form onSubmit={onSubmit} className="h-full space-y-4 rounded-3xl bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/70 border border-slate-100">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
              <p className="mt-2 text-sm text-slate-500">Register to buy products online. Pay via eSewa and collect at outlet.</p>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Full name</span>
              <input name="name" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Phone number</span>
              <input name="phoneNumber" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Email</span>
              <input type="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Password</span>
              <input type="password" name="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none" />
            </label>

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-60">
              {loading ? "Creating..." : "Create account"}
            </button>

            <p className="text-xs text-slate-400 leading-5">
              Already have an account? <a href="/login" className="text-cyan-600 hover:underline">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}