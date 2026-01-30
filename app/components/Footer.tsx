"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white/90 pt-12 pb-8 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">

          {/* Brand (no mission paragraph) */}
          <div className="md:max-w-sm">
            <Link href="/" className="flex items-center gap-3 mb-4" aria-label="Himalaya home">
              <div className="w-9 h-9 bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-white font-semibold">H</div>
              <span className="text-xl font-semibold tracking-tight">Himalaya</span>
            </Link>

            <div className="mt-2 flex items-center gap-3">
              <a aria-label="Instagram" href="#" className="text-white opacity-90 hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><circle cx="17.5" cy="6.5" r="0.5"/></svg>
              </a>
              <a aria-label="Facebook" href="#" className="text-white opacity-90 hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 2h-3a4 4 0 0 0-4 4v3H8v4h3v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a aria-label="Twitter" href="#" className="text-white opacity-90 hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43 1s-2 .95-3 1.18A4.5 4.5 0 0 0 12 6v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
            </div>

            <div className="mt-6 text-sm text-white/60">
              <div>Support: <a href="/contact" className="text-white hover:underline">contact@himalaya.example</a></div>
              <div className="mt-2">Open: <span className="font-medium">Mon — Fri</span></div>
            </div>
          </div>

          {/* Links grid (3 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 flex-1">
            <div>
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white">Press</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Explore</h4>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li><Link href="/shop" className="hover:text-white">Shop collections</Link></li>
                <li><Link href="/shop?best-sellers" className="hover:text-white">Best sellers</Link></li>
                <li><Link href="/collections/handmade" className="hover:text-white">Handmade</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Support</h4>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li><Link href="/help" className="hover:text-white">Help center</Link></li>
                <li><Link href="/orders" className="hover:text-white">Order tracking</Link></li>
                <li><Link href="/returns" className="hover:text-white">Returns & refunds</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/6 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
          <div>© {new Date().getFullYear()} <Link href="/" className="text-white">Himalaya</Link>. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
