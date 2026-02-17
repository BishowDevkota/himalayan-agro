"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/vendor", label: "Vendors" },
  { href: "/admin/payment-requests", label: "Payments" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/employees", label: "Employees" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  if (pathname?.startsWith("/admin/login")) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-slate-200">
      <div className="relative overflow-hidden">
        <div className="absolute -top-32 -right-16 h-72 w-72 rounded-full bg-sky-200/40 blur-[120px]" aria-hidden />
        <div className="absolute -bottom-40 -left-16 h-80 w-80 rounded-full bg-emerald-200/30 blur-[140px]" aria-hidden />

        <button
          type="button"
          className="fixed left-10 top-[100px] z-50 flex h-5 w-8 flex-col items-center justify-between"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="admin-sidebar"
        >
          <span
            className={`h-px w-full bg-black transition-transform duration-300 ${
              open ? "translate-y-2 rotate-45" : "translate-y-0"
            }`}
          />
          <span
            className={`h-px w-full bg-black transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-px w-full bg-black transition-transform duration-300 ${
              open ? "-translate-y-2 -rotate-45" : "translate-y-0"
            }`}
          />
        </button>

        <aside
          id="admin-sidebar"
          className={`fixed left-0 top-0 z-50 h-screen w-[90vw] transform overflow-y-auto border-r border-slate-900 bg-black px-10 pt-10 transition-transform duration-500 lg:w-[20vw] ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white text-black flex items-center justify-center text-lg font-black">
                H
              </div>
              <span className="text-white text-sm font-semibold tracking-wide">Himalayan Agro</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-6 text-[1.35rem] font-light text-white">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block transition-all duration-300 ${
                    isActive
                      ? "text-white"
                      : "text-white/70 hover:text-white hover:translate-x-2"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div
          className={`relative z-10 min-h-screen px-10 pt-10 transition-[padding] duration-500 ${
            open ? "lg:pl-[20vw]" : "lg:pl-10"
          }`}
        >
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
