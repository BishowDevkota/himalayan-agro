import React from "react";

export const metadata = {
  title: "Admin — Himalayan Agro",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // enforce a white page background for all admin routes (overrides dark-mode)
    <div className="min-h-screen bg-white dark:bg-white text-slate-900 dark:text-slate-900">
      {children}
    </div>
  );
}
