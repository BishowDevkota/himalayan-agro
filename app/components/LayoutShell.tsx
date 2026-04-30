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
      <main style={!isDashboardArea ? { paddingTop: "var(--top-bar-height, 0px)" } : undefined}>
        {children}
      </main>
      {!isDashboardArea && <Footer />}
    </>
  );
}
