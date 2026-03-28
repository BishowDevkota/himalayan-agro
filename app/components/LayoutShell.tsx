"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardArea = pathname?.startsWith("/admin") || pathname?.startsWith("/store");

  return (
    <>
      {!isDashboardArea && <Navbar />}
      <main>{children}</main>
      {!isDashboardArea && <Footer />}
    </>
  );
}
