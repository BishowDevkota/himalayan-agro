'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

type ProductCard = {
  _id: string;
  name: string;
  shortDescription?: string;
  images?: string[];
  price?: number;
  brand?: string | null;
  category?: string | null;
};

const demoList: ProductCard[] = [
  { _id: 'demo-1', name: 'Aero-Scan AI', shortDescription: 'Advanced drone imaging for precision nitrogen mapping across large scale industrial farms.', images: ['https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800'] },
  { _id: 'demo-2', name: 'Terra-Compute', shortDescription: 'Predictive analytics dashboard for seasonal yields and soil health monitoring through cloud-based AI.', images: ['https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800'] },
  { _id: 'demo-3', name: 'Hydra-Node', shortDescription: 'Satellite-linked sensors for underground moisture levels and real-time irrigation automation.', images: ['https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=800'] },
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
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export default function Products({ products }: { products?: ProductCard[] }) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const list = (products && products.length) ? products : demoList;

  const scroll = (direction: number) => {
    const el = carouselRef.current;
    if (!el) return;

    const card = el.querySelector('.product-card') as HTMLElement | null;
    const cardBase = card?.offsetWidth ?? Math.round(el.clientWidth * 0.9);
    const scrollAmount = Math.round((cardBase + 24) * 2);

    el.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section ref={sectionRef} className="relative bg-[#f8fafb] py-20 sm:py-28 lg:py-32 overflow-hidden">
      {/* Subtle decorative background elements — consistent with WhatWeDo */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-50 opacity-40 -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-blue-50 opacity-40 translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Label — pill badge matching WhatWeDo */}
          <motion.div variants={headingVariants} className="text-center mb-5">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0891b2]/8 text-[#0891b2] text-xs sm:text-sm font-semibold tracking-widest uppercase border border-[#0891b2]/15">
              <span className="w-2 h-2 rounded-full bg-[#0891b2] animate-pulse" />
              Our Catalog
            </span>
          </motion.div>

          {/* Section Heading — Georgia serif like WhatWeDo & Hero */}
          <motion.h2
            variants={headingVariants}
            className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Featured{' '}
            <span className="text-[#0891b2]">Products</span>
          </motion.h2>

          {/* Decorative divider — matching WhatWeDo */}
          <motion.div
            variants={headingVariants}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-12 bg-[#0891b2]/30" />
            <div className="w-2 h-2 rounded-full bg-[#0891b2]" />
            <div className="h-px w-12 bg-[#0891b2]/30" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={headingVariants}
            className="text-center text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto mb-12 sm:mb-16"
          >
            Handpicked from our catalog — updated in real time.
          </motion.p>

          {/* Carousel Navigation */}
          <motion.div variants={headingVariants} className="flex justify-end gap-2.5 mb-6">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 bg-white hover:bg-[#0891b2] hover:text-white hover:border-[#0891b2] transition-all duration-300 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 bg-white hover:bg-[#0891b2] hover:text-white hover:border-[#0891b2] transition-all duration-300 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </motion.div>

          {/* Product Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {list.map((product) => (
              <motion.div
                key={product._id}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: 'easeOut' as const },
                }}
                className="product-card flex-none w-[78vw] sm:w-[60vw] md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] snap-start group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
              >
                {/* Top accent bar — appears on hover like WhatWeDo cards */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0891b2] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10" />

                {/* Image */}
                <div className="relative h-[210px] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${(product.images && product.images[0]) || '/placeholder.png'})` }}
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col justify-between h-[190px]">
                  <div>
                    <h3
                      className="text-base font-bold text-gray-900 mb-2 truncate tracking-tight group-hover:text-[#0891b2] transition-colors duration-300"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                    <div className="text-[15px] font-bold text-gray-800">
                      {typeof product.price === 'number' ? `₹${product.price.toFixed(2)}` : ''}
                    </div>
                    <motion.a
                      href={`/product/${product._id}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0891b2] text-white text-[11px] font-semibold tracking-wider uppercase transition-colors duration-300 hover:bg-[#0e7490] shadow-sm hover:shadow-md"
                    >
                      View
                      <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </motion.a>
                  </div>
                </div>

                {/* Bottom accent line — matching WhatWeDo cards */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0891b2] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}