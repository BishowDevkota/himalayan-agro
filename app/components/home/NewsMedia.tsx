'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const articles = [
  {
    date: 'Jan 2026',
    category: 'Export',
    title: 'Himalaya Agro Expands Organic Spice Exports to European Markets',
    excerpt:
      'Our latest shipment of GMP-certified turmeric and ginger products has been well received across key European distribution channels.',
    image:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    color: '#d97706',
  },
  {
    date: 'Dec 2025',
    category: 'Sustainability',
    title: 'Integrated Farming Initiative Reaches 3,000 Farmers Across Nepal',
    excerpt:
      'Our farmer-empowerment programme now covers 12 districts, providing training, seeds, and market access to rural communities.',
    image:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
    color: '#059669',
  },
  {
    date: 'Nov 2025',
    category: 'Innovation',
    title: 'New State-of-the-Art Processing Facility Inaugurated in Chitwan',
    excerpt:
      'The facility brings modern value-addition capabilities, including cold-press extraction, dehydration, and quality testing labs.',
    image:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    color: '#0891b2',
  },
];

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
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
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export default function NewsMedia() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-20 sm:py-28 lg:py-32 overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-50 opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-amber-50 opacity-25 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

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
              Latest Updates
            </span>
          </motion.div>

          <motion.h2
            variants={headingVariants}
            className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            News &{' '}
            <span className="text-[#0891b2]">Media</span>
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
            Stay up to date with our latest milestones, initiatives, and industry recognition.
          </motion.p>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {articles.map((article, index) => (
              <motion.article
                key={index}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: 'easeOut' as const },
                }}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />

                  {/* Category badge */}
                  <span
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase text-white"
                    style={{ backgroundColor: article.color }}
                  >
                    {article.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  {/* Date */}
                  <span className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-2">
                    {article.date}
                  </span>

                  <h3
                    className="text-lg font-bold text-gray-900 leading-snug mb-3 group-hover:text-[#0891b2] transition-colors duration-300"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {article.title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed flex-1">
                    {article.excerpt}
                  </p>

                  {/* Read more link */}
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold" style={{ color: article.color }}>
                    <span className="group-hover:tracking-wide transition-all duration-300">
                      Read more
                    </span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>

                {/* Bottom accent bar */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ backgroundColor: article.color }}
                />
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
