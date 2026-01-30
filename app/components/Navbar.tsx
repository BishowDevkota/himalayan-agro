"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../../store/useCart";

// --- Icons (Cleaned up and styled) ---
const IconUser = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconCart = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const Chevron = ({ open }: { open: boolean }) => (
  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
  </svg>
);

export default function Navbar() {
  const { data: session } = useSession();
  const role = (session as any)?.user?.role;
  const pathname = usePathname();
  const router = useRouter();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const cart = useCart((s) => s.items);
  const cartCount = cart.reduce((s, i) => s + (i.quantity || 0), 0);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Shop", href: "/shop" },
    { name: "Contact", href: "/contact" },
  ];

  const Dropdown = ({ label, items, id }: { label: string, items: any[], id: string }) => (
    <div 
      className="relative group"
      onMouseEnter={() => setActiveDropdown(id)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <button className={`flex items-center gap-1.5 px-1 py-2 text-sm font-medium transition-colors hover:text-sky-600 ${activeDropdown === id ? 'text-sky-600' : 'text-gray-600'}`}>
        {label}
        <Chevron open={activeDropdown === id} />
      </button>
      
      <div className={`absolute top-full left-0 w-48 pt-2 transition-all duration-200 ${activeDropdown === id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-2 ring-1 ring-black/5">
          {items.map((item) => (
            <Link key={item.label} href={item.href} className="block px-3 py-2 text-sm text-gray-600 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:bg-sky-700 transition-colors">H</div>
              <span className="text-xl font-bold tracking-tight text-gray-900">Himalayan</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.slice(0, 2).map(link => (
                <Link key={link.name} href={link.href} className={`text-sm font-medium transition-colors hover:text-sky-600 ${pathname === link.href ? 'text-sky-600' : 'text-gray-600'}`}>
                  {link.name}
                </Link>
              ))}
              
              <Dropdown 
                id="company" 
                label="Company" 
                items={[{label: 'Our Story', href: '/story'}, {label: 'Careers', href: '/careers'}]} 
              />
              
              <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-sky-600">Shop</Link>
              
              <Dropdown 
                id="rnd" 
                label="R&D" 
                items={[{label: 'Innovation', href: '/innovation'}, {label: 'Lab Labs', href: '/labs'}]} 
              />
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => router.push('/search')}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            <Link href="/cart" className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <IconCart />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

            {session ? (
              <div className="relative group">
                <button 
                  onMouseEnter={() => setUserMenuOpen(true)}
                  className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full border border-gray-200 hover:border-sky-200 hover:bg-sky-50 transition-all"
                >
                  <div className="w-7 h-7 bg-sky-100 rounded-full overflow-hidden">
                    {(session as any).user?.image ? (
                      <img src={(session as any).user.image} alt="user" className="w-full h-full object-cover" />
                    ) : <div className="w-full h-full flex items-center justify-center text-sky-700 font-bold text-xs">U</div>}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">Account</span>
                </button>
                {/* User Menu Dropdown code omitted for brevity but follows Dropdown style above */}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="hidden sm:inline-flex items-center px-5 py-2 text-sm font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-all active:scale-95 shadow-sm"
              >
                Log in
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-16 inset-x-0 bg-white border-b border-gray-100 shadow-2xl p-4 space-y-4 animate-in fade-in slide-in-from-top-4">
          <nav className="flex flex-col gap-1">
            {navLinks.map(link => (
              <Link key={link.name} href={link.href} className="px-4 py-3 text-base font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-700 rounded-xl transition-colors">
                {link.name}
              </Link>
            ))}
          </nav>
          {!session && (
             <div className="pt-4 border-t border-gray-100">
               <Link href="/login" className="block w-full py-3 text-center font-bold text-white bg-sky-600 rounded-xl">Log In</Link>
             </div>
          )}
        </div>
      )}
    </header>
  );
}