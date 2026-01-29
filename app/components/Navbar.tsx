"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session as any)?.user?.role;
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
              {/* Cart stays visible; account actions are behind a hover/click menu */}
              <Link href="/cart" className="text-sm">Cart</Link>

              {role === "admin" ? (
                // keep admin link visible separately
                <a
                  href="/admin/dashboard"
                  className="text-sm"
                  onClick={(e) => {
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                      e.preventDefault();
                      window.location.href = '/admin/dashboard';
                    }
                  }}
                >
                  Admin
                </a>
              ) : null}

              <div
                className="relative"
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
              >
                <button
                  className="text-sm inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                  onClick={() => setUserMenuOpen((v) => !v)}
                >
                  Account
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-md py-2 z-30">
                    <Link href="/my-orders" className="block px-4 py-2 text-sm hover:bg-gray-50">My orders</Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50">Account</Link>
                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => signOut()}>Sign out</button>
                  </div>
                )}
              </div>
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