'use client';
import { useEffect, useRef, useState } from 'react';

const services = [
  {
    title: "Smart IoT",
    desc: "Real-time soil analysis and automated irrigation systems controlled by high-precision AI sensors.",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    delay: "0s",
  },
  {
    title: "Bio-Innovation",
    desc: "Development of climate-resilient, nutrient-dense seed varieties tailored for extreme environments.",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    delay: "0.2s",
  },
  {
    title: "Renewable Energy",
    desc: "Powering industrial farming operations with integrated solar and wind energy ecosystems.",
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
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
          Services
        </span>
        <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-black uppercase mb-16 text-[#0a0a0a]">
          What We Do
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