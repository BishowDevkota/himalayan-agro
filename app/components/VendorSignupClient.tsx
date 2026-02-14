"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function VendorSignupClient({ from }: { from?: string }) {
  const [ownerName, setOwnerName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/vendors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerName,
          storeName,
          email,
          contactEmail: contactEmail || email,
          contactPhone,
          address,
          description,
          password,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Unable to submit request");
      toast.success("Vendor request submitted. Await admin approval.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Unable to submit request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="hidden md:flex flex-col gap-6 p-8 bg-white rounded-2xl shadow-md border border-gray-100">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-black">S</div>
          <h2 className="text-3xl font-extrabold text-slate-900">Open your store</h2>
          <p className="text-sm text-slate-600 max-w-sm">Submit your vendor application. Our team will review your details and activate your store account.</p>

          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3 text-slate-600">✅ <span className="text-slate-700">List products in minutes</span></li>
            <li className="flex items-start gap-3 text-slate-600">✅ <span className="text-slate-700">Track sales and orders</span></li>
            <li className="flex items-start gap-3 text-slate-600">✅ <span className="text-slate-700">Reach new customers</span></li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-slate-900">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900">Vendor application</h1>
              <p className="mt-1 text-sm text-slate-600">Provide your store details to start selling.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label htmlFor="vendor-owner" className="block text-sm font-medium text-slate-700">Owner name</label>
                <input
                  id="vendor-owner"
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="vendor-store" className="block text-sm font-medium text-slate-700">Store name</label>
                <input
                  id="vendor-store"
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Your store name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vendor-email" className="block text-sm font-medium text-slate-700">Account email</label>
                  <input
                    id="vendor-email"
                    className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="vendor-contact-email" className="block text-sm font-medium text-slate-700">Contact email</label>
                  <input
                    id="vendor-contact-email"
                    className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    type="email"
                    placeholder="support@store.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vendor-phone" className="block text-sm font-medium text-slate-700">Contact phone</label>
                  <input
                    id="vendor-phone"
                    className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+977-9800000000"
                    autoComplete="tel"
                  />
                </div>

                <div>
                  <label htmlFor="vendor-password" className="block text-sm font-medium text-slate-700">Password</label>
                  <input
                    id="vendor-password"
                    className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Create a password"
                    minLength={8}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="vendor-address" className="block text-sm font-medium text-slate-700">Business address</label>
                <input
                  id="vendor-address"
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, city"
                  autoComplete="street-address"
                />
              </div>

              <div>
                <label htmlFor="vendor-desc" className="block text-sm font-medium text-slate-700">Store description</label>
                <textarea
                  id="vendor-desc"
                  className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="What do you sell?"
                />
              </div>

              <button
                className="w-full inline-flex items-center justify-center gap-3 rounded-lg bg-emerald-600 px-5 py-3 text-white font-semibold shadow-md hover:brightness-105 disabled:opacity-60"
                disabled={loading}
              >
                <span>{loading ? "Submitting…" : "Submit application"}</span>
              </button>

              <div className="text-center text-sm text-gray-500">
                Already approved? <a href="/login" className="text-emerald-600 hover:underline">Sign in</a>
              </div>

              {from ? (
                <div className="text-center text-xs text-slate-400">You will return to {from} after signing in.</div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
