"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session as any)?.user?.role;

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">Shop</Link>
          <Link href="/shop" className="text-sm text-gray-600">Products</Link>
        </div>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/my-orders" className="text-sm">Orders</Link>
              <Link href="/cart" className="text-sm">Cart</Link>
              {role === "admin" ? (
                // use a full navigation so the browser sends the auth cookie and the
                // server-side render /api requests reliably see the session
                <a
                  href="/admin/dashboard"
                  className="text-sm"
                  onClick={(e) => {
                    // allow meta-click/new-tab; otherwise force a full reload
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                      e.preventDefault();
                      window.location.href = '/admin/dashboard';
                    }
                  }}
                >
                  Admin
                </a>
              ) : null}
              <button className="text-sm" onClick={() => signOut()}>Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm">Sign in</Link>
              <Link href="/register" className="text-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}