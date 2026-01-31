'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const slides = [
  {
    tag: "PRECISION ENGINEERING",
    title: "DIGITAL",
    highlight: "AGRI-TECH",
    btnText: "Our Mission",
    href: "/about",
    btnClass: "bg-[#2da8da]",
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000"
  },
  {
    tag: "AUTONOMOUS TOOLS",
    title: "SMART",
    highlight: "GROWTH",
    btnText: "Shop",
    href: "/shop",
    btnClass: "bg-[#f29629]",
    img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=2000"
  },
  {
    tag: "SOCIAL RESPONSIBILITY",
    title: "GLOBAL",
    highlight: "IMPACT",
    btnText: "Learn More",
    href: "/about",
    btnClass: "bg-[#64cc98]",
    img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=2000"
  }
];
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="relative h-screen w-full overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out flex items-center justify-center ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Zoom Animation */}
          <div
            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[9000ms] linear ${
              index === current ? 'scale-100' : 'scale-115'
            }`}
            style={{ backgroundImage: `url(${slide.img})` }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/85 z-[2]" />

          {/* Content */}
          <div className="relative z-[3] text-center text-white px-5">
            <p className="text-sm tracking-[5px] font-light mb-4 opacity-80 animate-fadeIn">
              {slide.tag}
            </p>
            <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-black leading-[0.85] uppercase mb-6 tracking-tighter">
              {slide.title}<br />
              <span style={{ color: index === 0 ? '#2da8da' : index === 1 ? '#f29629' : '#64cc98' }}>
                {slide.highlight}
              </span>
            </h1>
            <button
              onClick={() => router.push(slide.href)}
              aria-label={slide.btnText}
              className={`${slide.btnClass} text-white px-9 py-4 font-bold uppercase tracking-wider text-xs hover:-translate-y-1 transition-transform duration-300 shadow-xl`}
            >
              {slide.btnText}
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-[3px] transition-all duration-400 ${
              current === i ? 'w-10 bg-[#2da8da]' : 'w-10 bg-white/20'
            }`}
          />
        ))}
      </div>
    </header>
  );
}