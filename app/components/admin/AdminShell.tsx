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

  if (pathname?.startsWith("/admin/login")) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-100">
      <div className="relative overflow-hidden">
        <div className="absolute -top-32 -right-16 h-72 w-72 rounded-full bg-sky-200/40 blur-[120px]" aria-hidden />
        <div className="absolute -bottom-40 -left-16 h-80 w-80 rounded-full bg-emerald-200/30 blur-[140px]" aria-hidden />

        <header className="relative z-10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10">
            <div className="flex flex-col gap-6 rounded-[32px] border border-slate-100 bg-white/80 px-6 py-6 shadow-sm backdrop-blur">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg font-black">
                    H
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Himalayan Agro</div>
                    <div className="text-2xl font-black text-slate-900">Admin Console</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Link
                    href="/"
                    className="rounded-full border border-slate-200 px-4 py-2 text-slate-600 hover:text-slate-900"
                  >
                    View Storefront
                  </Link>
                  <Link
                    href="/admin/dashboard"
                    className="rounded-full bg-slate-900 px-4 py-2 text-white"
                  >
                    Open Dashboard
                  </Link>
                </div>
              </div>

              <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-full px-4 py-2 ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-600 border border-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </header>

        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
