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

        {open ? (
          <div
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur"
            onClick={() => setOpen(false)}
            aria-hidden
          />
        ) : null}

        <aside
          id="admin-sidebar"
          className={`fixed left-0 top-0 z-50 h-screen w-[90vw] transform overflow-y-auto border-r border-slate-200 bg-white px-10 pt-[120px] transition-transform duration-500 lg:w-[25vw] ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex flex-col gap-6 text-[1.35rem] font-light text-slate-900">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block transition-all duration-300 ${
                    isActive
                      ? "text-slate-900"
                      : "text-slate-900/80 hover:text-slate-500 hover:translate-x-2"
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
            open ? "lg:pl-[25vw]" : "lg:pl-10"
          }`}
        >
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
