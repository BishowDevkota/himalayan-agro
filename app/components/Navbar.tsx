"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../../store/useCart";
import { motion, AnimatePresence } from "framer-motion";
import { adminLandingForPermissions } from "../../lib/permissions";

function IconSearch({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCart({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 6h15l-1.5 9h-12L4 2H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="20" r="1" fill="currentColor" />
      <circle cx="18" cy="20" r="1" fill="currentColor" />
    </svg>
  );
}

function IconChevronDown({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMenu({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconClose({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconStorefront({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 9l1.5-5h15L21 9M3 9h18M3 9v10a2 2 0 002 2h14a2 2 0 002-2V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21V13h6v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const companyDropdownItems = [
  { label: "Crop Cultivation", href: "/shop", description: "Seeds, fertilizers & crop care" },
  { label: "Dairy & Livestock", href: "/shop", description: "Animal husbandry products" },
  { label: "Horticulture", href: "/shop", description: "Fruits, flowers & vegetables" },
  { label: "Organic Farming", href: "/shop", description: "Certified organic supplies" },
  { label: "Irrigation & Water", href: "/shop", description: "Drip, sprinkler & pumps" },
  { label: "Agri-Tech Solutions", href: "/shop", description: "IoT sensors & smart tools" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Company", href: "#", isDropdown: true },
  { label: "Investor", href: "/investor" },
  { label: "About", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

// Unique background colors per mobile nav item (hex for inline styles)
const mobileBgColors = [
  "#ecfeff",
  "#fff7ed",
  "#ecfdf5",
  "#f0f9ff",
  "#fffbeb",
  "#f0fdfa",
  "#fff1f2",
];

const CYAN = "#0891b2";

const dropdownVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.22, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0, y: 8, scale: 0.97,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

// Mobile slide-from-left
const mobilePanelVariants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
  exit: {
    x: "-100%",
    transition: { duration: 0.3, ease: "easeIn" as const },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: 0.05 * i + 0.15, duration: 0.3, ease: "easeOut" as const },
  }),
};

// Animated underline for active nav link (CYAN)
function NavUnderline() {
  return (
    <motion.span
      layoutId="nav-underline"
      className="absolute -bottom-1 left-1 right-1 h-0.5 rounded-full"
      style={{ backgroundColor: CYAN }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
    />
  );
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session as any)?.user?.role;
  const permissions = (session as any)?.user?.permissions || [];
  const canAccessAdmin = role === "admin" || (Array.isArray(permissions) && permissions.length > 0);
  const adminTarget = role === "admin" ? "/admin/dashboard" : adminLandingForPermissions(permissions);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [companyMobileOpen, setCompanyMobileOpen] = useState(false);
  const companyRef = useRef<HTMLDivElement | null>(null);
  const cart = useCart((s) => s.items);
  const cartCount = cart.reduce((s, i) => s + (i.quantity || 0), 0);
  const router = useRouter();
  const headerRef = useRef<HTMLElement | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  function navigateAndClose(href: string) {
    setMobileOpen(false);
    setCompanyMobileOpen(false);
    router.push(href);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) setCompanyOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    if (!mobileOpen) { document.body.style.overflow = ""; return; }
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); setCompanyMobileOpen(false); }, [pathname]);

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className={`sticky top-0 w-full z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-sm"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-17">

          {/*  SECTION 1: Logo  */}
          <Link href="/" className="shrink-0 flex items-center" aria-label="Home">
            <motion.img
              src="/wide-logo.jpeg"
              alt="Himalayan"
              loading="eager"
              className="h-10 sm:h-12 w-auto object-contain"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.25 }}
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder.png"; }}
            />
          </Link>

          {/*  SECTION 2: Desktop Nav  */}
          <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setHoveredLink(null)}>
            {(() => {
              // Find the FIRST nav link whose href matches the current path — avoids multiple active underlines
              const activeLabel = navLinks.find(
                (l) => !l.isDropdown && isActivePath(pathname, l.href)
              )?.label ?? null;
              // The underline target: hovered link takes priority, otherwise the active link
              const underlineTarget = hoveredLink || activeLabel;

              return navLinks.map((link) => {
                if (link.isDropdown) {
                  return (
                    <div key={link.label} className="relative" ref={companyRef}
                      onMouseEnter={() => { setCompanyOpen(true); setHoveredLink(link.label); }}
                      onMouseLeave={() => { setCompanyOpen(false); setHoveredLink(null); }}
                    >
                      <button
                        onClick={() => setCompanyOpen((p) => !p)}
                        className="relative flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#0891b2] transition-colors duration-200"
                      >
                        {link.label}
                        <motion.span animate={{ rotate: companyOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="inline-flex">
                          <IconChevronDown size={14} />
                        </motion.span>
                        {underlineTarget === link.label && <NavUnderline />}
                      </button>
                      <AnimatePresence>
                        {companyOpen && (
                          <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-60 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 overflow-hidden"
                          >
                            {companyDropdownItems.map((item, idx) => (
                              <motion.button key={item.label}
                                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03, duration: 0.2 }}
                                onClick={() => { setCompanyOpen(false); router.push(item.href); }}
                                className="w-full text-left px-4 py-2.5 hover:bg-cyan-50 transition-colors duration-200 group"
                              >
                                <span className="block text-sm font-medium text-gray-700 group-hover:text-[#0891b2] transition-colors duration-200">{item.label}</span>
                                <span className="block text-[11px] text-gray-400 mt-0.5 leading-tight">{item.description}</span>
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                const active = isActivePath(pathname, link.href);
                return (
                  <Link key={link.label} href={link.href}
                    onMouseEnter={() => setHoveredLink(link.label)}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${active || hoveredLink === link.label ? "text-[#0891b2]" : "text-gray-600 hover:text-[#0891b2]"}`}
                  >
                    {link.label}
                    {underlineTarget === link.label && <NavUnderline />}
                  </Link>
                );
              });
            })()}
          </nav>

          {/*  SECTION 3: Right Actions  */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
              onClick={() => router.push("/search")}
              className="p-2 rounded-full text-gray-500 hover:text-[#0891b2] hover:bg-gray-50 transition-all duration-200" aria-label="Search"
            ><IconSearch size={18} /></motion.button>

            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
              onClick={() => router.push("/cart")}
              className="hidden sm:inline-flex relative p-2 rounded-full text-gray-500 hover:text-[#0891b2] hover:bg-gray-50 transition-all duration-200" aria-label="Cart"
            >
              <IconCart size={18} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                  >{cartCount}</motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {session ? (
              <div className="relative">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="flex items-center p-1.5 rounded-full hover:bg-gray-50 transition-all duration-200" aria-expanded={userMenuOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-[#0891b2] flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {(session as any).user?.image
                      ? <img src={(session as any).user.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                      : <span>{(session as any).user?.name?.[0]?.toUpperCase() ?? "U"}</span>}
                  </div>
                </motion.button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit"
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-medium text-sm text-gray-900">{(session as any).user?.name}</div>
                        <div className="text-xs text-gray-400">{(session as any).user?.email}</div>
                      </div>
                      <button onClick={() => { setUserMenuOpen(false); router.push("/cart"); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-[#0891b2] hover:bg-cyan-50 transition-colors sm:hidden">Cart</button>
                      <button onClick={() => { setUserMenuOpen(false); router.push("/my-orders"); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-[#0891b2] hover:bg-cyan-50 transition-colors">My Orders</button>
                      {canAccessAdmin && (
                        <button onClick={() => { setUserMenuOpen(false); router.push(adminTarget); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:text-[#0891b2] hover:bg-cyan-50 transition-colors border-t border-gray-100">Admin Panel</button>
                      )}
                      <button onClick={() => signOut()} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors border-t border-gray-100 font-medium">Sign out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[#0891b2] transition-colors duration-200"
                >Login</motion.button>
              </div>
            )}

            {/* Become a Vendor — always visible on desktop, rightmost */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(8,145,178,0.4)" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/register/vendor")}
              className="hidden lg:inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white rounded-full bg-[#0891b2] hover:bg-[#0e7490] shadow-md shadow-cyan-200/50 transition-all duration-300"
            >
              <IconStorefront size={15} />
              Become a Vendor
            </motion.button>

            {/* Hamburger */}
            <motion.button whileTap={{ scale: 0.88 }}
              className="lg:hidden p-2 rounded-full text-gray-600 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setMobileOpen((p) => !p)} aria-expanded={mobileOpen} aria-label="Toggle navigation"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen
                  ? <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><IconClose size={22} /></motion.span>
                  : <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><IconMenu size={22} /></motion.span>}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/*  Mobile Slide-from-Left Panel  */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/30"
              onClick={() => setMobileOpen(false)}
            />
            {/* Sliding panel */}
            <motion.div
              variants={mobilePanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-70 sm:w-[320px] bg-white shadow-2xl flex flex-col"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 shrink-0">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center">
                  <img src="/wide-logo.jpeg" alt="Himalayan" className="h-9 w-auto object-contain"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder.png"; }} />
                </Link>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close menu">
                  <IconClose size={20} />
                </motion.button>
              </div>

              {/* Nav items */}
              <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
                {navLinks.map((link, i) => {
                  const bgHex = mobileBgColors[i % mobileBgColors.length];
                  if (link.isDropdown) {
                    const active = companyMobileOpen;
                    return (
                      <motion.div key={link.label} custom={i} variants={mobileItemVariants} initial="hidden" animate="visible">
                        <button
                          onClick={() => setCompanyMobileOpen((p) => !p)}
                          style={{ backgroundColor: active ? bgHex : undefined }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 ${active ? "text-[#0891b2]" : "text-gray-700"}`}
                          onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = bgHex; }}
                          onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = ""; }}
                        >
                          Company
                          <motion.span animate={{ rotate: companyMobileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <IconChevronDown size={15} />
                          </motion.span>
                        </button>
                        <AnimatePresence>
                          {companyMobileOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeOut" as const }}
                              className="overflow-hidden"
                            >
                              <div className="pl-3 py-1 space-y-0.5">
                                {companyDropdownItems.map((item) => (
                                  <button key={item.label} onClick={() => navigateAndClose(item.href)}
                                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-gray-500 hover:text-[#0891b2] hover:bg-cyan-50 transition-colors duration-200"
                                  >{item.label}</button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  }
                  const active = isActivePath(pathname, link.href);
                  return (
                    <motion.button key={link.label} custom={i} variants={mobileItemVariants} initial="hidden" animate="visible"
                      onClick={() => navigateAndClose(link.href)}
                      style={{ backgroundColor: active ? bgHex : undefined }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 ${active ? "text-[#0891b2]" : "text-gray-700 hover:text-[#0891b2]"}`}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = bgHex; }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = ""; }}
                    >
                      <span className="flex items-center gap-2">
                        {link.label}
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-[#0891b2]" />}
                      </span>
                    </motion.button>
                  );
                })}
              </nav>

              {/* Bottom auth section */}
              <div className="shrink-0 border-t border-gray-100 p-4 space-y-2">
                {/* Become a Vendor — always in mobile panel */}
                <button
                  onClick={() => navigateAndClose("/register/vendor")}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-white rounded-full bg-[#0891b2] hover:bg-[#0e7490] shadow-md shadow-cyan-200/50 transition-all duration-300"
                >
                  <IconStorefront size={15} />
                  Become a Vendor
                </button>
                {!session ? (
                  <>
                    <button onClick={() => navigateAndClose("/login")} className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-200">Sign in</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => navigateAndClose("/cart")} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-[#0891b2] hover:bg-cyan-50 transition-colors duration-200">
                      Cart {cartCount > 0 && <span className="ml-1 text-[10px] text-white bg-red-500 rounded-full px-1.5 py-0.5">{cartCount}</span>}
                    </button>
                    <button onClick={() => navigateAndClose("/my-orders")} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-[#0891b2] hover:bg-cyan-50 transition-colors duration-200">My Orders</button>
                    {canAccessAdmin && (
                      <button onClick={() => navigateAndClose(adminTarget)} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:text-[#0891b2] hover:bg-cyan-50 transition-colors duration-200">Admin Panel</button>
                    )}
                    <button onClick={() => { setMobileOpen(false); signOut(); }} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200">Sign out</button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}