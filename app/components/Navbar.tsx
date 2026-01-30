"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../store/useCart";

// Icon Components
function IconSearch({ size = 20 }: { size?: number }) {
 return (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
 <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
 </svg>
 );
}

function IconCart({ size = 20 }: { size?: number }) {
 return (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M6 6h15l-1.5 9h-12L4 2H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
 <circle cx="9" cy="20" r="1" fill="currentColor" />
 <circle cx="18" cy="20" r="1" fill="currentColor" />
 </svg>
 );
}

function IconUser({ size = 20 }: { size?: number }) {
 return (
 <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
 <path d="M20.59 21a9 9 0 0 0-17.18 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

export default function Navbar() {
 const { data: session } = useSession();
 const role = (session as any)?.user?.role;
 const [mobileOpen, setMobileOpen] = useState(false);
 const [companyOpen, setCompanyOpen] = useState(false);
 const [resourcesOpen, setResourcesOpen] = useState(false);
 const [companyMobileOpen, setCompanyMobileOpen] = useState(false);
 const [resourcesMobileOpen, setResourcesMobileOpen] = useState(false);
 const companyRef = useRef<HTMLDivElement | null>(null);
 const resourcesRef = useRef<HTMLDivElement | null>(null);
 const mobileMenuRef = useRef<HTMLDivElement | null>(null);
 const cart = useCart((s) => s.items);
 const cartCount = cart.reduce((s, i) => s + (i.quantity || 0), 0);
 const router = useRouter();
 // header measurement used to position the mobile menu as a fixed overlay
 const headerRef = useRef<HTMLElement | null>(null);
 const [menuTop, setMenuTop] = useState<number>(0);
 function navigateAndClose(href: string) {
   setMobileOpen(false);
   router.push(href);
 }
 useEffect(() => {
   function update() {
     const h = headerRef.current?.getBoundingClientRect().height ?? 0;
     setMenuTop(Math.round(h));
   }
   update();
   window.addEventListener('resize', update);
   return () => window.removeEventListener('resize', update);
 }, []);
 const [userMenuOpen, setUserMenuOpen] = useState(false);

 useEffect(() => {
 function onDoc(e: MouseEvent) {
 if (companyRef.current && !companyRef.current.contains(e.target as Node)) setCompanyOpen(false);
 if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) setResourcesOpen(false);
 }
 document.addEventListener('click', onDoc);
 return () => document.removeEventListener('click', onDoc);
 }, []);

 useEffect(() => {
 if (!mobileOpen) {
 document.body.style.overflow = '';
 return;
 }
 const prevOverflow = document.body.style.overflow;
 document.body.style.overflow = 'hidden';
 const el = mobileMenuRef.current;
 const firstFocusable = el?.querySelector<HTMLElement>('a,button,[tabindex]:not([tabindex="-1"])') || null;
 firstFocusable?.focus();

 function onKey(e: KeyboardEvent) {
 if (e.key === 'Escape') setMobileOpen(false);
 }
 window.addEventListener('keydown', onKey);
 return () => {
 window.removeEventListener('keydown', onKey);
 document.body.style.overflow = prevOverflow;
 };
 }, [mobileOpen]);

 return (
 <header ref={headerRef} className="sticky top-0 w-full z-40 backdrop-blur-md bg-white border-b border-blue-100/50 shadow-lg">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex items-center justify-between gap-4 py-3 sm:py-4">
 {/* Logo */}
 <Link href="/" className="flex items-center gap-3 group" aria-label="Himalayan — home">
 {/* mobile-only wordmark */}
 <img
   src="https://res-console.cloudinary.com/dk7ggjvlw/thumbnails/v1/image/upload/v1769796349/Y3JvcHBlZEltYWdlX3R3bGVrdw==/drilldown"
   alt="Himalayan logo"
   className="sm:hidden h-10 w-auto object-contain transform group-hover:scale-105 transition-transform"
 />
 {/* desktop / larger screens (keeps existing image) */}
 <img
   src="https://res-console.cloudinary.com/dk7ggjvlw/thumbnails/v1/image/upload/v1769794847/bG9nb19weGx0bTI=/drilldown"
   alt="Himalayan logo"
   className="hidden sm:inline-block w-12 h-12 rounded-lg object-cover transform group-hover:scale-105 transition-transform"
 />
 <span className="sr-only">Himalayan</span>
 </Link>

 {/* Desktop Navigation */}
 <nav className="hidden lg:flex items-center gap-1">
 <Link
 href="/"
 className="px-4 py-2 rounded-lg text-gray-700 hover:text-cyan-600 transition-colors duration-200"
 >
 Home
 </Link>
 <Link
 href="/about"
 className="px-4 py-2 rounded-lg text-gray-700 hover:text-cyan-600 transition-colors duration-200"
 >
 About
 </Link>

 {/* Company Dropdown */}
 <div
 className="relative group"
 ref={companyRef}
 onMouseEnter={() => setCompanyOpen(true)}
 onMouseLeave={() => setCompanyOpen(false)}
 >
 <button
 onClick={() => setCompanyOpen(!companyOpen)}
 className="px-4 py-2 rounded-lg text-gray-700 hover:text-cyan-600 transition-colors duration-200 flex items-center gap-1"
 >
 Company
 <IconChevronDown />
 </button>

 {companyOpen && (
 <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animated-in fade-in slide-in-from-top-2">
 <button
 onClick={() => router.push('/')}
 className="w-full text-left px-4 py-3 text-gray-700 hover:text-cyan-600 hover:bg-blue-50 transition-colors"
 >
 Our Mission
 </button>
 <button
 onClick={() => router.push('/')}
 className="w-full text-left px-4 py-3 text-gray-700 hover:text-cyan-600 hover:bg-blue-50 transition-colors"
 >
 Team
 </button>
 <button
 onClick={() => router.push('/')}
 className="w-full text-left px-4 py-3 text-gray-700 hover:text-cyan-600 hover:bg-blue-50 transition-colors"
 >
 Careers
 </button>
 </div>
 )}
 </div>

 <Link
 href="/shop"
 className="px-4 py-2 rounded-lg text-gray-700 hover:text-cyan-600 transition-colors duration-200"
 >
 Shop
 </Link>

 {/* Resources Dropdown */}
 <div
 className="relative group"
 ref={resourcesRef}
 onMouseEnter={() => setResourcesOpen(true)}
 onMouseLeave={() => setResourcesOpen(false)}
 >
 <button
 onClick={() => setResourcesOpen(!resourcesOpen)}
 className="px-4 py-2 rounded-lg text-gray-700 hover:text-cyan-600 transition-colors duration-200 flex items-center gap-1"
 >
 Resources
 <IconChevronDown />
 </button>

 {resourcesOpen && (
 <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2">
 <button
 onClick={() => router.push('/')}
 className="w-full text-left px-4 py-3 text-gray-700 hover:text-cyan-600 hover:bg-blue-50 transition-colors"
 >
 Blog
 </button>
 <button
 onClick={() => router.push('/')}
 className="w-full text-left px-4 py-3 text-gray-700 hover:text-cyan-600 hover:bg-blue-50 transition-colors"
 >
 Documentation
 </button>
 <button
 onClick={() => router.push('/')}
 className="w-full text-left px-4 py-3 text-gray-700 hover:text-cyan-600 hover:bg-blue-50 transition-colors"
 >
 Support
 </button>
 </div>
 )}
 </div>

 <Link
 href="/contact"
 className="px-4 py-2 rounded-lg text-gray-700 hover:text-cyan-600 transition-colors duration-200"
 >
 Contact
 </Link>
 </nav>

 {/* Right Section */}
 <div className="flex items-center gap-2 sm:gap-3">
 {/* Search Icon */}
 <button
 onClick={() => router.push('/search')}
 className="p-2.5 rounded-lg text-gray-700 hover:text-cyan-600 transition-colors duration-200"
 aria-label="Search"
 >
 <IconSearch size={20} />
 </button>

 {/* Cart Icon */}
 <button
 onClick={() => router.push('/cart')}
 className="relative p-2.5 rounded-lg text-gray-700 hover:text-cyan-600 transition-colors duration-200"
 aria-label="Shopping cart"
 >
 <IconCart size={20} />
 {cartCount > 0 && (
 <span className="absolute top-1 right-1 w-5 h-5 bg-linear-to-br from-red-500 to-rose-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
 {cartCount}
 </span>
 )}
 </button>

 {/* User Menu */}
 {session ? (
 <div className="relative">
 <button
 onClick={() => setUserMenuOpen(!userMenuOpen)}
 className="flex items-center gap-2 px-3 py-2 rounded-lg hover:text-cyan-600 transition-colors duration-200"
 aria-expanded={userMenuOpen}
 >
 <div className="w-8 h-8 rounded-full bg-linear-to-br from-cyan-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
 {(session as any).user?.image ? (
 <img src={(session as any).user.image} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
 ) : (
 <span>{(session as any).user?.name?.[0]?.toUpperCase() ?? 'U'}</span>
 )}
 </div>
 </button>

 {userMenuOpen && (
 <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
 <div className="px-4 py-3 border-b border-gray-100">
 <div className="font-semibold text-sm text-gray-900">{(session as any).user?.name}</div>
 <div className="text-xs text-gray-500">{(session as any).user?.email}</div>
 </div>
 <button
 onClick={() => router.push('/my-orders')}
 className="w-full text-left px-4 py-3 text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
 >
 📦 My Orders
 </button>
 {role === 'admin' && (
 <button
 onClick={() => router.push('/admin/dashboard')}
 className="w-full text-left px-4 py-3 text-gray-700 hover:text-cyan-600 hover:bg-cyan-50 transition-colors border-t border-gray-100"
 >
 ⚙️ Admin Dashboard
 </button>
 )}
 <button
 onClick={() => signOut()}
 className="w-full text-left px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors border-t border-gray-100 font-medium"
 >
 Sign out
 </button>
 </div>
 )}
 </div>
 ) : (
 <button
 onClick={() => router.push('/login')}
 className="hidden sm:block px-4 py-2 rounded-lg font-semibold text-white bg-linear-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200 shadow-lg hover:shadow-xl"
 >
 Sign in
 </button>
 )}

 {/* Mobile Menu Button */}
 <button
 className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-cyan-600 transition-colors"
 onClick={() => setMobileOpen(!mobileOpen)}
 aria-expanded={mobileOpen}
 aria-label="Toggle navigation"
 >
 {mobileOpen ? <IconClose size={24} /> : <IconMenu size={24} />}
 </button>
 </div>
 </div>
 </div>

 {/* Mobile Menu */}
 {mobileOpen && (
 <div
 id="mobile-menu"
 ref={mobileMenuRef}
 role="dialog"
 aria-modal="true"
 className="lg:hidden fixed left-0 right-0 z-30 overflow-auto bg-white backdrop-blur-sm shadow-lg"
 style={{ top: menuTop, height: `calc(100vh - ${menuTop}px)` }}
 >
 <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
 <button
 onClick={() => { navigateAndClose('/'); }}
 className="w-full text-left px-4 py-2.5 rounded-lg text-gray-700 hover:text-cyan-600 transition-colors"
 >
 Home
 </button>
 <button
 onClick={() => { navigateAndClose('/about'); }}
 className="w-full text-left px-4 py-2.5 rounded-lg text-gray-700 hover:text-cyan-600 transition-colors"
 >
 About
 </button>

 <div>
 <button
 onClick={() => setCompanyMobileOpen(!companyMobileOpen)}
 className="w-full flex items-center justify-between px-4 py-2.5 text-gray-700 hover:text-cyan-600 transition-colors rounded-lg"
 >
 Company
 <span className={`transition-transform ${companyMobileOpen ? 'rotate-180' : ''}`}>
 <IconChevronDown />
 </span>
 </button>
 {companyMobileOpen && (
 <div className="pl-4 mt-1 space-y-1">
 <button
 onClick={() => { navigateAndClose('/'); }}
 className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-cyan-600 hover:bg-blue-50 transition-colors"
 >
 Our Mission
 </button>
 <button
 onClick={() => { navigateAndClose('/'); }}
 className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-cyan-600 hover:bg-blue-50 transition-colors"
 >
 Team
 </button>
 <button
 onClick={() => { navigateAndClose('/'); }}
 className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-cyan-600 hover:bg-blue-50 transition-colors"
 >
 Careers
 </button>
 </div>
 )}
 </div>

 <button
 onClick={() => { navigateAndClose('/shop'); }}
 className="w-full text-left px-4 py-2.5 rounded-lg text-gray-700 hover:text-cyan-600 transition-colors"
 >
 Shop
 </button>

 <div>
 <button
 onClick={() => setResourcesMobileOpen(!resourcesMobileOpen)}
 className="w-full flex items-center justify-between px-4 py-2.5 text-gray-700 hover:text-cyan-600 transition-colors rounded-lg"
 >
 Resources
 <span className={`transition-transform ${resourcesMobileOpen ? 'rotate-180' : ''}`}>
 <IconChevronDown />
 </span>
 </button>
 {resourcesMobileOpen && (
 <div className="pl-4 mt-1 space-y-1">
 <button
 onClick={() => { navigateAndClose('/'); }}
 className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-cyan-600 hover:bg-blue-50 transition-colors"
 >
 Blog
 </button>
 <button
 onClick={() => { navigateAndClose('/'); }}
 className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-cyan-600 hover:bg-blue-50 transition-colors"
 >
 Documentation
 </button>
 <button
 onClick={() => { navigateAndClose('/'); }}
 className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-cyan-600 hover:bg-blue-50 transition-colors"
 >
 Support
 </button>
 </div>
 )}
 </div>

 <button
 onClick={() => { navigateAndClose('/contact'); }}
 className="w-full text-left px-4 py-2.5 rounded-lg text-gray-700 hover:text-cyan-600 transition-colors"
 >
 Contact
 </button>

 <div className="pt-4 border-t border-gray-200 space-y-3">
 {!session && (
 <>
 <button
 onClick={() => { navigateAndClose('/login'); }}
 className="block w-full text-center px-4 py-2.5 bg-linear-to-r from-cyan-600 to-cyan-700 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all"
 >
 Sign in
 </button>
 <button
 onClick={() => { navigateAndClose('/register'); }}
 className="block w-full text-center px-4 py-2.5 border-2 border-cyan-600 text-cyan-600 font-semibold rounded-lg hover:bg-cyan-50 transition-all"
 >
 Create account
 </button>
 </>
 )}
 {session && (
 <div className="space-y-2">
 <button
 onClick={() => { navigateAndClose('/my-orders'); }}
 className="w-full text-left px-4 py-2.5 text-gray-700 hover:text-cyan-600 hover:bg-blue-50 rounded-lg transition-colors"
 >
 My Orders
 </button>
 {role === 'admin' && (
 <button
 onClick={() => { navigateAndClose('/admin/dashboard'); }}
 className="w-full text-left px-4 py-2.5 text-gray-700 hover:text-cyan-600 hover:bg-blue-50 rounded-lg transition-colors"
 >
 Admin Dashboard
 </button>
 )}
 <button
 onClick={() => { setMobileOpen(false); signOut(); }}
 className="w-full text-left px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
 >
 Sign out
 </button>
 </div>
 )}
 </div>
 </div>
 </div>
 )}
 </header>
 );
}