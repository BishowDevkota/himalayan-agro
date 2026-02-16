'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const advantages = [
  'Integrated farm-to-market supply chain',
  'Quality-certified production (GMP, HACCP aligned)',
  'Farmer-centered development model',
  'Sustainable and eco-friendly approach',
  'Strong export strategy',
];

const stats = [
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    value: '10,000+',
    label: 'Farmers to be Empowered',
    color: '#059669',
  },
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    value: '5,000+',
    label: 'Hectares Commercial Cultivation',
    color: '#0891b2',
  },
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.264.26-2.467.732-3.559" />
      </svg>
    ),
    value: 'Multiple',
    label: 'International Export Markets',
    color: '#d97706',
  },
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    value: 'Nationwide',
    label: 'Modern Processing Units',
    color: '#0891b2',
  },
];

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

const statVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section ref={sectionRef} className="relative bg-[#f8fafb] py-20 sm:py-28 lg:py-32 overflow-hidden">
      {/* Subtle decorative blobs */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-50 opacity-35 -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-green-50 opacity-30 translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* ===== WHY PARTNER WITH US ===== */}
          <motion.div variants={headingVariants} className="text-center mb-5">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#059669]/8 text-[#059669] text-xs sm:text-sm font-semibold tracking-widest uppercase border border-[#059669]/15">
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
              Why Choose Us
            </span>
          </motion.div>

          <motion.h2
            variants={headingVariants}
            className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Why Partner{' '}
            <span className="text-[#059669]">With Us?</span>
          </motion.h2>

          {/* Decorative divider */}
          <motion.div
            variants={headingVariants}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-12 bg-[#059669]/30" />
            <div className="w-2 h-2 rounded-full bg-[#059669]" />
            <div className="h-px w-12 bg-[#059669]/30" />
          </motion.div>

          <motion.p
            variants={headingVariants}
            className="text-center text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mb-14"
          >
            We bring a unique combination of expertise, infrastructure, and commitment to
            sustainable agriculture that sets us apart.
          </motion.p>

          {/* Advantage Cards */}
          <div className="max-w-2xl mx-auto mb-24 sm:mb-28">
            <div className="space-y-4">
              {advantages.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    x: 6,
                    transition: { duration: 0.2, ease: 'easeOut' as const },
                  }}
                  className="group flex items-center gap-4 p-4 sm:p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#059669]/30 transition-all duration-300"
                >
                  {/* Checkmark */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#059669]/8 flex items-center justify-center text-[#059669] group-hover:bg-[#059669] group-hover:text-white transition-all duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>

                  <span className="text-gray-700 text-sm sm:text-base font-medium leading-snug">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ===== IMPACT IN NUMBERS ===== */}
          <motion.div variants={headingVariants} className="text-center mb-5">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0891b2]/8 text-[#0891b2] text-xs sm:text-sm font-semibold tracking-widest uppercase border border-[#0891b2]/15">
              <span className="w-2 h-2 rounded-full bg-[#0891b2] animate-pulse" />
              Our Impact
            </span>
          </motion.div>

          <motion.h2
            variants={headingVariants}
            className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Our Impact{' '}
            <span className="text-[#0891b2]">Vision</span>
          </motion.h2>

          {/* Decorative divider */}
          <motion.div
            variants={headingVariants}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-12 bg-[#0891b2]/30" />
            <div className="w-2 h-2 rounded-full bg-[#0891b2]" />
            <div className="h-px w-12 bg-[#0891b2]/30" />
          </motion.div>

          <motion.p
            variants={headingVariants}
            className="text-center text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mb-14"
          >
            Building the future of Nepalese agriculture — one milestone at a time.
          </motion.p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={statVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: 'easeOut' as const },
                }}
                className="group relative bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden text-center"
              >
                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ backgroundColor: stat.color }}
                />

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                  style={{
                    backgroundColor: `${stat.color}12`,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </motion.div>

                {/* Value */}
                <h3
                  className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 tracking-tight"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {stat.value}
                </h3>

                {/* Label */}
                <p className="text-sm text-gray-500 leading-snug">
                  {stat.label}
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ backgroundColor: stat.color }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
