"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function MessageFromManagingDirector() {
  const mdName = "Dolindra Paudel Sharma";
  const mdDesignation = "Managing Director";
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="overflow-hidden bg-transparent px-4 py-3 md:px-6 md:py-4">
      <div className="mx-auto max-w-6xl" ref={sectionRef}>
        <div className="flex flex-col lg:flex-row">

          {/* Left Panel — 40% width, image unchanged */}
          <div
            style={{
              transition: "transform 2.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 2.4s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: visible ? "translateX(0)" : "translateX(-10vw)",
              opacity: visible ? 1 : 0,
            }}
            className="relative lg:w-2/5 border border-slate-200 rounded-t-xl lg:rounded-l-xl lg:rounded-tr-none overflow-hidden bg-slate-100 flex flex-col"
          >
            <div className="flex-1 min-h-[260px] lg:min-h-0 overflow-hidden">
              {!imageError ? (
                <img
                  src="/managing-director.jpg"
                  alt={mdName}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-200 text-slate-400 w-full">
                  Portrait Placeholder
                </div>
              )}
            </div>

            {/* Name label */}
            <div className="w-full bg-[#2da8da] py-2.5 text-center text-white shrink-0">
              <h3 className="font-sans text-lg font-bold tracking-tight transition-colors duration-300 hover:text-[#6ba47d]">
                {mdName}
              </h3>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest opacity-80">
                {mdDesignation}
              </p>
            </div>
          </div>

          {/* Right Panel — 60% width */}
          <article
            style={{
              transition: "transform 2.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, opacity 2.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
              transform: visible ? "translateX(0)" : "translateX(10vw)",
              opacity: visible ? 1 : 0,
            }}
            className="flex flex-col justify-center lg:w-3/5 bg-white px-6 py-5 md:px-8 md:py-6 border border-slate-200 border-t-0 lg:border-t lg:border-l-0 rounded-b-xl lg:rounded-r-xl lg:rounded-bl-none"
          >
            {/* Header — restored to original sizes */}
            <div className="mb-3 text-center">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#2da8da]/8 text-[#2da8da] text-xs sm:text-sm font-semibold tracking-widest uppercase border border-[#2da8da]/15">
                <span className="w-2 h-2 rounded-full bg-[#2da8da] animate-pulse" />
                Our Message
              </span>

              <h2
                className="mt-4 text-center text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                <span className="block text-gray-900">Message</span>
                <span className="block text-[#2da8da]">From The Managing Director</span>
              </h2>

              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-[#2da8da]/30" />
                <div className="w-2 h-2 rounded-full bg-[#2da8da]" />
                <div className="h-px w-12 bg-[#2da8da]/30" />
              </div>
            </div>

            {/* Body */}
            <div className="text-start font-sans text-[14.5px] md:text-[15.5px] font-medium leading-[1.75] text-slate-700 space-y-2.5">
              <p>
                As the Managing Director of Himalaya Nepal Agriculture Company Limited, I am honored to
                welcome you to our platform. Our vision is rooted in transforming Nepal's agricultural
                landscape into a modern, sustainable, and commercially viable sector that empowers farmers
                and strengthens the national economy.
              </p>
              <p>
                We are committed to bridging the gap between traditional farming practices and innovative
                agricultural solutions by promoting technology, value addition, and efficient market access.
                Through strong collaboration with farmers, cooperatives, and stakeholders, we aim to ensure
                quality production, fair pricing, and long-term growth for all involved.
              </p>
              <p>
                Our focus remains on enhancing productivity, encouraging youth participation in agriculture,
                and building a reliable supply chain that meets both domestic and international standards.
                We believe that agriculture is not just a profession, but a foundation for national
                prosperity and food security.
              </p>
              <p>
                I sincerely thank you for your interest and support. Together, let us work towards building
                a resilient, competitive, and prosperous agricultural future for Nepal.
              </p>
            </div>

            {/* Signature + Button */}
            <div className="mt-4">
              <div className="h-px w-28 bg-slate-200" />
              <p className="mt-2 font-sans text-xs italic text-slate-400 hover:text-[#6ba47d] transition-colors duration-300">
                {mdName}
              </p>
              <div className="mt-3">
                <Link
                  href="/about"
                  className="inline-block rounded-xl bg-[#6ba47d] px-5 py-2.5 font-sans text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-[#4a8460] hover:scale-105"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}