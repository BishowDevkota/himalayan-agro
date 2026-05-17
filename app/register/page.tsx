import React from "react";
import { getServerSession } from "next-auth/next";
import authOptions from "../../lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RegisterPage({ searchParams }: { searchParams?: { from?: string } | Promise<{ from?: string }> }) {
  const sp = (searchParams && typeof (searchParams as any)?.then === "function") ? await searchParams : (searchParams || {});
  const from = (sp as any).from || "/";

  const session = await getServerSession(authOptions as any);
  if (session) return redirect(from);
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 shadow-2xl shadow-slate-900/20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Registration</p>
        <h1 className="mt-4 text-3xl sm:text-4xl font-black leading-tight">Choose your registration type.</h1>
        <p className="mt-4 text-sm text-slate-300 leading-6">
          Regular users can buy products online and pay via eSewa. Distributors can buy with credit after admin approval.
        </p>
        <div className="mt-8 space-y-4 text-sm text-slate-300">
          <div className="flex items-start gap-3">
            <span className="font-bold text-cyan-300">User:</span>
            <span>Register instantly, pay via eSewa, collect at outlet.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="font-bold text-cyan-300">Distributor:</span>
            <span>Apply, wait for admin approval, buy with credit limit.</span>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/register/user" className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">Register as User</Link>
          <Link href="/register/distributor" className="rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10">Apply as Distributor</Link>
          <Link href="/outlet" className="rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10">Visit outlet</Link>
          <Link href="/login" className="rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10">Sign in</Link>
        </div>
      </div>
    </div>
  );
}