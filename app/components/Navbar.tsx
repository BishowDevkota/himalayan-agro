"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../store/useCart";

// Icon Components (kept identical to your original)
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
  const companyRef = useRef<HTMLDivElement | null>(null);
  const resourcesRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const cart = useCart((s) => s.items);
  const cartCount = cart.reduce((s, i) => s + (i.quantity || 0), 0);
  const router = useRouter();
  const headerRef = useRef<HTMLElement | null>(null);
  const [menuTop, setMenuTop] = useState<number>(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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

  return (
    <header ref={headerRef} className="sticky top-0 w-full z-40 backdrop-blur-md bg-white border-b border-blue-100/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navbar Container: Reduced padding to 0 and set explicit height to let image fill space */}
        <div className="flex items-center justify-between gap-4 h-16 sm:h-20">
          
          {/* Logo - Uses h-full to occupy the entire navbar height */}
          <Link href="/" className="flex items-center h-full group py-1" aria-label="Himalayan — home">
            {/* Mobile Logo */}
            <img
              src="/wide-logo.jpeg"
              alt="Himalayan"
              className="h-full w-auto object-contain lg:hidden transform transition-transform group-hover:scale-105"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.png'; }}
            />

            {/* Desktop Logo */}
            <img
              src="/logo.jpeg"
              alt="Himalayan"
              className="hidden lg:inline-block h-full w-auto object-contain transform transition-transform group-hover:scale-105"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.png'; }}
            />
            <span className="sr-only">Himalayan</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 rounded-lg text-gray-700 hover:text-cyan-600 transition-colors">Home</Link>
            <Link href="/about" className="px-4 py-2 rounded-lg text-gray-700 hover:text-cyan-600 transition-colors">About</Link>
            
            <div className="relative group" ref={companyRef}>
              <button className="px-4 py-2 rounded-lg text-gray-700 hover:text-cyan-600 flex items-center gap-1">
                Company <IconChevronDown />
              </button>
            </div>

            <Link href="/shop" className="px-4 py-2 rounded-lg text-gray-700 hover:text-cyan-600">Shop</Link>
            <Link href="/contact" className="px-4 py-2 rounded-lg text-gray-700 hover:text-cyan-600">Contact</Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={() => router.push('/search')} className="p-2.5 rounded-lg text-gray-700 hover:text-cyan-600" aria-label="Search">
              <IconSearch size={20} />
            </button>

            <button onClick={() => router.push('/cart')} className="relative p-2.5 rounded-lg text-gray-700 hover:text-cyan-600" aria-label="Shopping cart">
              <IconCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {session ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-3 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {(session as any).user?.image ? (
                      <img src={(session as any).user.image} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <span>{(session as any).user?.name?.[0]?.toUpperCase() ?? 'U'}</span>
                    )}
                  </div>
                </button>
              </div>
            ) : (
              <button onClick={() => router.push('/login')} className="hidden sm:block px-4 py-2 rounded-lg font-semibold text-white bg-cyan-600 hover:bg-cyan-700 shadow-lg">Sign in</button>
            )}

            <button className="lg:hidden p-2 rounded-lg text-gray-700" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <IconClose size={24} /> : <IconMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed left-0 right-0 z-30 overflow-auto bg-white shadow-lg" style={{ top: menuTop, height: `calc(100vh - ${menuTop}px)` }}>
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <button onClick={() => navigateAndClose('/')} className="w-full text-left px-4 py-2.5 rounded-lg text-gray-700">Home</button>
            <button onClick={() => navigateAndClose('/shop')} className="w-full text-left px-4 py-2.5 rounded-lg text-gray-700">Shop</button>
          </div>
        </div>
      )}
    </header>
  );
}