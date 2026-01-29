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
    <div className="max-w-md mx-auto py-20 px-6">
      <h1 className="text-2xl font-semibold mb-6">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={8} required />
          <div className="text-xs text-gray-500 mt-1">Minimum 8 characters</div>
        </div>
        <div>
          <button className="w-full rounded-md bg-sky-600 text-white py-2 disabled:opacity-60" disabled={loading}>{loading ? "Creating…" : "Create account"}</button>
        </div>
      </form>
      <div className="mt-4 text-sm text-gray-600">Already have an account? <a className="text-sky-600" href="/login">Sign in</a></div>
    </div>
  );
}