'use client';
import { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

const pillars = [
  {
    title: 'Integrated Farming',
    description:
      'Building modern agricultural systems through land consolidation, smart ICT-based farming, and high-yield crop diversification across Nepal.',
    accent: '#0891b2',
    accentSoft: 'rgba(8,145,178,0.09)',
    glowGradient: 'radial-gradient(ellipse at 30% 0%, rgba(8,145,178,0.09) 0%, transparent 70%)',
    borderGradient:
      'linear-gradient(135deg, rgba(8,145,178,0.4), rgba(8,145,178,0.08) 60%, transparent)',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        className="w-6 h-6"
      >
        {/* Wheat / grain stalk icon */}
        <path d="M12 22V12" />
        <path d="M12 12C12 12 8 10 8 6a4 4 0 018 0c0 4-4 6-4 6z" />
        <path d="M12 16C12 16 9 14.5 9 12" />
        <path d="M12 16C12 16 15 14.5 15 12" />
        <path d="M12 19C12 19 9.5 17.5 9 15.5" />
        <path d="M12 19C12 19 14.5 17.5 15 15.5" />
      </svg>
    ),
  },
  {
    title: 'Value Addition',
    description:
      'Adding value to local produce through primary processing, international-standard packaging, and a strong "Made in Nepal" brand identity.',
    accent: '#059669',
    accentSoft: 'rgba(5,150,105,0.09)',
    glowGradient: 'radial-gradient(ellipse at 30% 0%, rgba(5,150,105,0.09) 0%, transparent 70%)',
    borderGradient:
      'linear-gradient(135deg, rgba(5,150,105,0.4), rgba(5,150,105,0.08) 60%, transparent)',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        className="w-6 h-6"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
  {
    title: 'Global Export',
    description:
      'Bridging the trade deficit by exporting high-value products like cardamom and organic coffee through B2B international networks.',
    accent: '#d97706',
    accentSoft: 'rgba(217,119,6,0.09)',
    glowGradient: 'radial-gradient(ellipse at 30% 0%, rgba(217,119,6,0.09) 0%, transparent 70%)',
    borderGradient:
      'linear-gradient(135deg, rgba(217,119,6,0.4), rgba(217,119,6,0.08) 60%, transparent)',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        className="w-6 h-6"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" />
      </svg>
    ),
  },
  {
    title: 'Farmer Empowerment',
    description:
      'Uplifting rural communities through training programs, fair trade partnerships, and direct market access for smallholder farmers.',
    accent: '#7c3aed',
    accentSoft: 'rgba(124,58,237,0.09)',
    glowGradient: 'radial-gradient(ellipse at 30% 0%, rgba(124,58,237,0.09) 0%, transparent 70%)',
    borderGradient:
      'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(124,58,237,0.08) 60%, transparent)',
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        className="w-6 h-6"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
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
  hidden: { opacity: 0, y: 48, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: 'easeOut' as const },
  },
};

/* ── Types ── */
interface PillarType {
  title: string;
  description: string;
  accent: string;
  accentSoft: string;
  glowGradient: string;
  borderGradient: string;
  icon: React.ReactNode;
}

/* ── Tilt Card ── */
function TiltCard({ pillar }: { pillar: PillarType }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hovered, setHovered] = useState(false);
  const [shineX, setShineX] = useState(-60);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    setTilt({
      rx: ((y - cy) / cy) * -9,
      ry: ((x - cx) / cx) * 9,
    });
    setShineX((x / r.width) * 120 - 30);
  }, []);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ rx: 0, ry: 0 });
    setShineX(-60);
  }, []);

  return (
    <motion.div
      variants={cardVariants}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: hovered
          ? `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-10px) scale(1.025)`
          : 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
        transition: hovered
          ? 'transform 0.08s linear'
          : 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
        willChange: 'transform',
        boxShadow: hovered
          ? `0 24px 56px rgba(0,0,0,0.14), 0 8px 24px ${pillar.accentSoft.replace('0.09', '0.18')}`
          : '0 6px 18px rgba(0,0,0,0.06)',
      }}
      className="relative rounded-[22px] overflow-hidden cursor-pointer select-none"
    >
      {/* Glass base */}
      <div
        className="absolute inset-0 rounded-[22px]"
        style={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.88)',
          boxShadow: hovered
            ? `0 24px 56px rgba(0,0,0,0.13), 0 8px 24px ${pillar.accentSoft.replace('0.09', '0.18')}, inset 0 1px 0 rgba(255,255,255,0.95)`
            : '0 4px 24px rgba(46,125,50,0.10), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)',
          transition: 'box-shadow 0.45s ease',
        }}
      />

      {/* Radial glow on hover */}
      <div
        className="absolute inset-0 rounded-[22px] pointer-events-none"
        style={{
          background: pillar.glowGradient,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Gradient border on hover */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: -1,
          borderRadius: 23,
          background: pillar.borderGradient,
          zIndex: 0,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Shimmer sweep */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          left: `${shineX}%`,
          width: '40%',
          background:
            'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)',
          transform: 'skewX(-15deg)',
          transition: hovered ? 'left 0.08s linear' : 'left 0.6s ease',
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Card content */}
      <div className="relative z-10 p-7">
        {/* Icon ring */}
        <div
          className="mb-5 flex items-center justify-center rounded-2xl"
          style={{
            width: 54,
            height: 54,
            background: pillar.accentSoft,
            color: pillar.accent,
            transform: hovered ? 'scale(1.13) rotate(-4deg)' : 'scale(1) rotate(0deg)',
            boxShadow: hovered
              ? `0 6px 20px ${pillar.accentSoft.replace('0.09', '0.25')}`
              : 'none',
            transition:
              'transform 0.38s cubic-bezier(0.22,1,0.36,1), box-shadow 0.38s ease',
          }}
        >
          {pillar.icon}
        </div>

        {/* Title */}
        <h3
          className="text-[15.5px] font-bold text-gray-900 mb-2 tracking-tight leading-snug"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {pillar.title}
        </h3>

        {/* Animated accent line */}
        <div
          className="mb-3 rounded-full"
          style={{
            height: 2.5,
            width: hovered ? 48 : 28,
            background: pillar.accent,
            transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
          }}
        />

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed">
          {pillar.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Main Export ── */
export default function OurMission() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  return (
    <section
      ref={sectionRef}
      className="relative bg-white py-20 sm:py-28 lg:py-32 overflow-hidden"
    >
      {/* Original background decorative circles — unchanged */}
      <div className="absolute top-0 right-0 w-125 h-125 rounded-full bg-green-50 opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-100 h-100 rounded-full bg-green-50 opacity-40 translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Label — unchanged */}
          <motion.div variants={headingVariants} className="text-center mb-5">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0891b2]/8 text-[#0891b2] text-xs sm:text-sm font-semibold tracking-widest uppercase border border-[#0891b2]/15">
              <span className="w-2 h-2 rounded-full bg-[#0891b2] animate-pulse" />
              Our Mission
            </span>
          </motion.div>

          {/* Section Heading — unchanged */}
          <motion.h2
            variants={headingVariants}
            className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Transforming Nepal&apos;s{' '}
            <span className="relative inline-block">
              <span className="text-[#059669]">Agriculture</span>
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
              >
                <path
                  d="M2 6C50 2 150 2 198 6"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h2>

          {/* Decorative divider — unchanged */}
          <motion.div
            variants={headingVariants}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="h-px w-12 bg-[#059669]/30" />
            <div className="w-2 h-2 rounded-full bg-[#059669]" />
            <div className="h-px w-12 bg-[#059669]/30" />
          </motion.div>

          {/* Mission Statement — unchanged */}
          <motion.p
            variants={headingVariants}
            className="text-center text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            Himalaya Nepal Agriculture Company Limited is committed to modernizing
            Nepal&apos;s agricultural sector through integrated farming, value addition,
            global export, and farmer empowerment.
          </motion.p>

          {/* ── Mobile Cards (below sm) ── */}
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {pillars.map((pillar, index) => (
              <TiltCard key={index} pillar={pillar} />
            ))}
          </div>

          {/* ── Desktop / Tablet Cards (sm+) ── */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-4">
            {pillars.map((pillar, index) => (
              <TiltCard key={index} pillar={pillar} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
