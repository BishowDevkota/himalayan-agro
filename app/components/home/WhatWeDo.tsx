'use client';
import { useEffect, useRef, useState } from 'react';

const services = [
  {
    title: "Integrated Farming",
    desc: "Developing modern agricultural systems through land consolidation, smart ICT-based farming, and high-yield crop diversification",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    delay: "0s",
  },
  {
    title: "Processing & Branding",
    desc: "Adding value to local produce through primary processing, international-standard packaging, and 'Made in Nepal' brand identity",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    delay: "0.2s",
  },
  {
    title: "Global Supply Chain",
    desc: "Bridging the trade deficit by exporting high-value products like cardamom and organic coffee through B2B international networks",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
    delay: "0.4s",
  }
];

export default function Services() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-[5%] bg-white text-center">
      <div className="max-w-7xl mx-auto">
        <span className="block font-bold tracking-[3px] text-sm mb-4 text-[#2da8da] uppercase">
          Our Objectives
        </span>
        <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black uppercase mb-16 text-[#0a0a0a]">
          Strategic Pillars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              style={{ transitionDelay: service.delay }}
              className={`bg-[#f9f9f9] p-10 md:p-14 text-left border-b-4 border-transparent hover:border-[#2da8da] hover:bg-white hover:shadow-2xl transition-all duration-500 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="text-[#2da8da] mb-6">
                {service.icon}
              </div>
              <h3 className="text-2xl font-black uppercase mb-4 text-[#0a0a0a]">
                {service.title}
              </h3>
              <p className="text-[#555] leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}