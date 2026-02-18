import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import authOptions from "../../lib/auth";

import CheckoutClient from "../components/CheckoutClient";

export default async function CheckoutPage() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return <div className="p-12 text-gray-900">Please sign in to checkout.</div>;

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <div className="bg-[#f8faf9] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-sm" aria-label="breadcrumb">
            <ol className="flex items-center gap-1.5 text-gray-500">
              <li><Link href="/" className="hover:text-[#059669] transition-colors">Home</Link></li>
              <li><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></li>
              <li><Link href="/cart" className="hover:text-[#059669] transition-colors">Cart</Link></li>
              <li><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></li>
              <li className="text-gray-900 font-medium">Checkout</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold text-[#0891b2] uppercase tracking-widest mb-1">Secure Checkout</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Checkout</h1>
          <p className="mt-2 text-sm text-gray-600">Add shipping details and confirm your order.</p>
        </div>
        <div className="mt-6">
          {/* client component handles cart fetch & submit */}
          <CheckoutClient />
        </div>
      </div>
    </div>
  );
}
