"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SignupClient({ from }: { from?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Signup failed");

      // auto sign-in after successful registration
      const signInRes = await signIn("credentials", { redirect: false, email, password });
      // @ts-ignore
      if (signInRes?.error) {
        toast.success("Account created — please sign in");
        router.push("/login");
      } else {
        toast.success("Signed in");
        router.push((from as string) || "/");
      }
    } catch (err: any) {
      toast.error(err.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Illustration / value prop (desktop only) - converted to white card so canvas is fully white */}
        <div className="hidden md:flex flex-col justify-center gap-6 p-8 bg-white rounded-2xl shadow-md border border-gray-100">
          <div className="w-12 h-12 bg-sky-600 text-white rounded-lg flex items-center justify-center font-black">H</div>
          <h2 className="text-3xl font-extrabold text-slate-900">Get started</h2>
          <p className="text-sm text-slate-600 max-w-sm">Create an account to save orders, track shipments and access buyer-only pricing. It takes under a minute.</p>

          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3 text-slate-600">✅ <span className="text-slate-700">Faster checkout</span></li>
            <li className="flex items-start gap-3 text-slate-600">✅ <span className="text-slate-700">Order history</span></li>
            <li className="flex items-start gap-3 text-slate-600">✅ <span className="text-slate-700">Secure payments</span></li>
          </ul>
        </div>

        {/* Signup card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-slate-900">
          <div className="max-w-md mx-auto">
            <div className="flex items-start mb-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
                <p className="mt-1 text-sm text-slate-600">Join the marketplace — simple onboarding for buyers.</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-6" aria-describedby={undefined}>
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-slate-700">Full name</label>
                <input
                  id="signup-name"
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  id="signup-email"
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700">Password</label>
                  <div className="text-xs text-slate-400">Minimum 8 characters</div>
                </div>
                <input
                  id="signup-password"
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Create a password"
                  minLength={8}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div>
                <button
                  className="w-full inline-flex items-center justify-center gap-3 rounded-lg bg-sky-600 px-5 py-3 text-white font-semibold shadow-md hover:brightness-105 disabled:opacity-60"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`${loading ? 'animate-spin' : ''} h-5 w-5`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M12 4v4m0 8v4m8-8h-4M4 12H0" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{loading ? 'Creating…' : 'Create account'}</span>
                </button>
              </div>

              <div className="pt-2">
                <div className="text-center text-sm text-gray-500">Already have an account? <a href="/login" className="text-sky-600 hover:underline">Sign in</a></div>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden>
                    <div className="w-full border-t border-gray-100" />
                  </div>
                  <div className="relative flex justify-center text-xs text-gray-400">Payments & data secured</div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}