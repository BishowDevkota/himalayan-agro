"use client";

import React from "react";
import Link from "next/link";

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" },
      { label: "About Us", href: "/about" },
      { label: "News", href: "/news" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Our Divisions",
    links: [
      { label: "Crop Cultivation", href: "/company/crop-cultivation" },
      { label: "Dairy & Livestock", href: "/company/dairy-livestock" },
      { label: "Horticulture", href: "/company/horticulture" },
      { label: "Organic Farming", href: "/company/organic-farming" },
      { label: "Irrigation & Water", href: "/company/irrigation-water" },
      { label: "Agri-Tech", href: "/company/agri-tech" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/login" },
      { label: "Create Account", href: "/register" },
      { label: "My Orders", href: "/my-orders" },
      { label: "Cart", href: "/cart" },
      { label: "Become a Distributor", href: "/register/distributor" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Investor Relations", href: "/investor" },
      { label: "Contact Us", href: "/contact" },
      { label: "Search Products", href: "/search" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-5" aria-label="Himalaya home">
              <img
                src="/logo.jpeg"
                alt="Himalaya Nepal Krishi"
                className="h-16 sm:h-20 w-auto object-contain"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/wide-logo.jpeg";
                }}
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Empowering farmers with modern agricultural solutions — from precision farming and smart irrigation to organic supplies and agri-tech innovation.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a aria-label="Facebook" href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-cyan-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a aria-label="Instagram" href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-cyan-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a aria-label="X / Twitter" href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-cyan-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a aria-label="YouTube" href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-cyan-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Himalaya Nepal Krishi Company. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>Made by</span>
            <span>Techvion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
