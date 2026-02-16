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
          {/* Section Label */}
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

          {/* Advantage Items */}
          <div className="max-w-2xl mx-auto">
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
        </motion.div>
      </div>
    </section>
  );
}
