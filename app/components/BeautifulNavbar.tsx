"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useCart } from "../../store/useCart";

function IconUser({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20.59 21a9 9 0 0 0-17.18 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function IconCart({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M6 6h15l-1.5 9h-12L4 2H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="20" r="1" fill="currentColor" />
      <circle cx="18" cy="20" r="1" fill="currentColor" />
    </svg>
  );
}

export default function BeautifulNavbar() {
  const { data: session } = useSession();
  const role = (session as any)?.user?.role;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [rndOpen, setRndOpen] = useState(false);
  const companyRef = useRef<HTMLDivElement | null>(null);
  const rndRef = useRef<HTMLDivElement | null>(null);
  const cart = useCart((s) => s.items);
  const cartCount = cart.reduce((s, i) => s + (i.quantity || 0), 0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) setCompanyOpen(false);
      if (rndRef.current && !rndRef.current.contains(e.target as Node)) setRndOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <header className="w-full border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-sky-700">Himalayan</Link>

          <nav className="hidden md:flex items-center gap-4 text-sm text-gray-700">
            <Link href="/" className="px-3 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-200">Home</Link>
            <Link href="/about" className="px-3 py-2 rounded-md hover:bg-gray-50">About</Link>

            <div className="relative" ref={companyRef}>
              <button
                aria-expanded={companyOpen}
                onClick={() => setCompanyOpen((v) => !v)}
                className="px-3 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
              >
                Company
                <svg className={`transition-transform ${companyOpen ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {companyOpen && (
                <div className="absolute mt-2 w-44 bg-white border rounded shadow-md py-2 z-30">
                  <Link href="#" className="block px-4 py-2 text-sm hover:bg-gray-50">Item 1</Link>
                  <Link href="#" className="block px-4 py-2 text-sm hover:bg-gray-50">Item 2</Link>
                  <Link href="#" className="block px-4 py-2 text-sm hover:bg-gray-50">Item 3</Link>
                </div>
              )}
            </div>

            <Link href="/shop" className="px-3 py-2 rounded-md hover:bg-gray-50">Shop</Link>

            <div className="relative" ref={rndRef}>
              <button
                aria-expanded={rndOpen}
                onClick={() => setRndOpen((v) => !v)}
                className="px-3 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50"
              >
                R&amp;D
                <svg className={`transition-transform ${rndOpen ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {rndOpen && (
                <div className="absolute mt-2 w-44 bg-white border rounded shadow-md py-2 z-30">
                  <Link href="#" className="block px-4 py-2 text-sm hover:bg-gray-50">Item 1</Link>
                  <Link href="#" className="block px-4 py-2 text-sm hover:bg-gray-50">Item 2</Link>
                  <Link href="#" className="block px-4 py-2 text-sm hover:bg-gray-50">Item 3</Link>
                </div>
              )}
            </div>

            <Link href="/contact" className="px-3 py-2 rounded-md hover:bg-gray-50">Contact</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/shop" className="hidden md:inline text-sm text-gray-600">Explore</Link>

          <Link href="/cart" className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50">
            <IconCart />
            <span className="sr-only">Cart</span>
            <span className="text-sm">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white bg-rose-600 rounded-full">{cartCount}</span>
            )}
          </Link>

          {session ? (
            <div
              className="relative"
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <button
                className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-50"
                aria-label="Open user menu"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((v) => !v)}
              >
                <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                  {(session as any).user?.image ? (
                    <img src={(session as any).user.image} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <IconUser />
                  )}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-md py-2 z-30">
                  <Link href="/my-orders" className="block px-4 py-2 text-sm hover:bg-gray-50">My orders</Link>
                  <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50">Account</Link>
                  {role === 'admin' && <a href="/admin/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50">Admin</a>}
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" onClick={() => signOut()}>Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 text-sm bg-sky-600 text-white rounded-md shadow-sm hover:bg-sky-700">Log in</Link>
            </div>
          )}

          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-50"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            <Link href="/" className="block px-3 py-2 rounded-md">Home</Link>
            <Link href="/about" className="block px-3 py-2 rounded-md">About</Link>
            <div>
              <div className="text-sm font-medium">Company</div>
              <div className="mt-2 space-y-1 pl-2">
                <Link href="#" className="block px-3 py-2 rounded-md">Item 1</Link>
                <Link href="#" className="block px-3 py-2 rounded-md">Item 2</Link>
                <Link href="#" className="block px-3 py-2 rounded-md">Item 3</Link>
              </div>
            </div>
            <Link href="/shop" className="block px-3 py-2 rounded-md">Shop</Link>
            <div>
              <div className="text-sm font-medium">R&amp;D</div>
              <div className="mt-2 space-y-1 pl-2">
                <Link href="#" className="block px-3 py-2 rounded-md">Item 1</Link>
                <Link href="#" className="block px-3 py-2 rounded-md">Item 2</Link>
                <Link href="#" className="block px-3 py-2 rounded-md">Item 3</Link>
              </div>
            </div>
            <Link href="/contact" className="block px-3 py-2 rounded-md">Contact</Link>

            <div className="pt-2 border-t flex items-center justify-between">
              {session ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center justify-center w-9 h-9 bg-gray-100 rounded-full text-sm font-medium text-gray-700">{(session as any).user?.name?.[0] ?? 'U'}</div>
                    <div>
                      <div className="text-sm font-medium">{(session as any).user?.name}</div>
                      <div className="text-xs text-gray-500">{(session as any).user?.email}</div>
                    </div>
                  </div>
                  <div>
                    <Link href="/cart" className="inline-flex items-center gap-2 px-3 py-2 rounded-md">Cart ({cartCount})</Link>
                    <button className="ml-2 text-sm" onClick={() => signOut()}>Sign out</button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="px-4 py-2 text-sm bg-sky-600 text-white rounded-md">Log in</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
