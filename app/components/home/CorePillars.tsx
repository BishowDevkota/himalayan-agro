'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const pillars = [
  {
    title: 'Integrated Agriculture',
    description: 'Commercial and market-driven farming systems.',
    color: '#0891b2',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Processing & Value Addition',
    description: 'Modern processing, packaging & branding.',
    color: '#d97706',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Export & Global Market Access',
    description: 'Connecting Nepalese products to international markets.',
    color: '#0891b2',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Research & Innovation',
    description: 'Smart farming & technology-driven agriculture.',
    color: '#d97706',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Farmer Welfare',
    description: 'Training, insurance & financial coordination.',
    color: '#0891b2',
    image: 'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?auto=format&fit=crop&q=80&w=800',
  },
  {
    title: 'Supply Chain Infrastructure',
    description: 'Cold storage, logistics & digital tracking.',
    color: '#d97706',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
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

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: 'easeOut' as const },
  },
};

export default function CorePillars() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section ref={sectionRef} className="relative bg-white py-20 sm:py-28 lg:py-32 overflow-hidden">
      {/* Subtle decorative blobs */}
      <div className="absolute top-0 right-0 w-100 h-100 rounded-full bg-cyan-50 opacity-35 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-87.5 h-87.5 rounded-full bg-orange-50 opacity-30 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Label */}
          <motion.div variants={headingVariants} className="text-center mb-5">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0891b2]/8 text-[#0891b2] text-xs sm:text-sm font-semibold tracking-widest uppercase border border-[#0891b2]/15">
              <span className="w-2 h-2 rounded-full bg-[#0891b2] animate-pulse" />
              Our Core Pillars
            </span>
          </motion.div>

          {/* Section Heading */}
          <motion.h2
            variants={headingVariants}
            className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Our Strategic{' '}
            <span className="text-[#0891b2]">Focus Areas</span>
          </motion.h2>

          {/* Decorative divider */}
          <motion.div
            variants={headingVariants}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-12 bg-[#0891b2]/30" />
            <div className="w-2 h-2 rounded-full bg-[#d97706]" />
            <div className="h-px w-12 bg-[#d97706]/30" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={headingVariants}
            className="text-center text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mb-14 sm:mb-18"
          >
            The strategic pillars that drive our mission to transform Nepal&apos;s agricultural landscape.
          </motion.p>

          {/* Pillar Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: 'easeOut' as const },
                }}
                className="group relative rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden min-h-70 flex flex-col"
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url(${pillar.image})` }}
                />
                {/* Dark overlay — lighter to highlight the image */}
                <div className="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/30 transition-colors duration-500" />

                {/* Top accent bar on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20"
                  style={{ backgroundColor: pillar.color }}
                />

                {/* Content */}
                <div className="relative z-10 p-8 sm:p-9 flex flex-col flex-1 justify-end">
                  {/* Title */}
                  <h3
                    className="text-xl font-bold text-white mb-2.5 tracking-tight group-hover:translate-x-1 transition-transform duration-300 drop-shadow-md"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/80 leading-relaxed drop-shadow-sm">
                    {pillar.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.75 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20"
                  style={{ backgroundColor: pillar.color }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
