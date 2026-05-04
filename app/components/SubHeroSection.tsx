'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type SubHeroSectionProps = {
  title?: string;
  description?: string;
  image?: string;
  tag?: string;
  stats?: { value: string; label: string }[];
  btnText?: string;
  btnHref?: string;
  overlay?: 'light' | 'dark';
};

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000';

/* ── animation variants (mirrors Hero.tsx) ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.25 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

export default function SubHeroSection({
  title = 'Page Title',
  description,
  image = DEFAULT_IMAGE,
  tag,
  stats,
  btnText,
  btnHref,
  overlay = 'light',
}: SubHeroSectionProps) {
  const pathname = usePathname();
  const hasStats = Boolean(stats && stats.length > 0);
  const mobileStats = stats ?? [];

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '));

  const isDark = overlay === 'dark';

  return (
    <section
      className="relative z-0 w-full overflow-hidden"
      style={{
        height: hasStats ? 'calc((100dvh - var(--top-bar-height, 0px)) * 0.6)' : 'auto',
        minHeight: hasStats ? 'calc((100dvh - var(--top-bar-height, 0px)) * 0.6)' : 'auto',
        backgroundColor: isDark ? '#0a1628' : '#f5f0e8',
      }}
    >
      {/* ── Background image ── */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${image}')` }}
        />
        {/* Overlay – matches Hero earthy wash or dark mode */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'linear-gradient(to bottom right, rgba(10,22,40,.92), rgba(10,22,40,.75), rgba(12,45,72,.6))'
              : 'linear-gradient(to bottom, rgba(245,240,232,.88), rgba(245,240,232,.78))',
          }}
        />
      </motion.div>

      {/* ── Decorative elements ── */}
      {/* Floating ring – desktop only */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 1.2, ease: 'easeOut' }}
        className="hidden lg:block absolute -right-24 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          border: `1.5px dashed ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(196,185,154,0.35)'}`,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
        className="hidden lg:block absolute -right-36 top-1/2 -translate-y-1/2 w-125 h-125 rounded-full pointer-events-none"
        style={{
          border: `1px dashed ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(196,185,154,0.2)'}`,
        }}
      />

      {/* Accent glow */}
      <div
        className="absolute top-0 right-[12%] w-72 h-72 rounded-full pointer-events-none blur-[120px]"
        style={{
          background: isDark
            ? 'rgba(41,168,221,0.08)'
            : 'rgba(196,185,154,0.25)',
        }}
      />

      {/* ── Content ── */}
      <div
        className={`relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${hasStats ? 'h-full' : 'min-h-[22rem] sm:min-h-[24rem]'} flex items-start pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-0`}
      >
        <div className="max-w-xl lg:max-w-lg py-0 sm:py-0">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Breadcrumb */}
            <motion.nav variants={fadeUpVariants} className="mb-3 sm:mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[2px]">
                <li>
                  <Link
                    href="/"
                    className="transition-colors duration-200"
                    style={{
                      color: isDark ? 'rgba(255,255,255,0.4)' : '#8b7e6a',
                    }}
                  >
                    Home
                  </Link>
                </li>
                {segments.map((seg, i) => (
                  <React.Fragment key={i}>
                    <li style={{ color: isDark ? 'rgba(255,255,255,0.2)' : '#c4b99a' }}>/</li>
                    <li
                      style={{
                        color:
                          i === segments.length - 1
                            ? isDark
                              ? '#29A8DD'
                              : '#059669'
                            : isDark
                              ? 'rgba(255,255,255,0.4)'
                              : '#8b7e6a',
                      }}
                    >
                      {seg}
                    </li>
                  </React.Fragment>
                ))}
              </ol>
            </motion.nav>

            {/* Tag pill */}
            {tag && (
              <motion.div variants={fadeUpVariants}>
                <span
                  className="inline-block px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-medium tracking-wide mb-3 sm:mb-4"
                  style={{
                    border: isDark
                      ? '1px solid rgba(41,168,221,0.3)'
                      : '1px solid #c4b99a',
                    color: isDark ? '#29A8DD' : '#5a4e3c',
                    background: isDark ? 'rgba(41,168,221,0.05)' : 'transparent',
                  }}
                >
                  {tag}
                </span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              variants={fadeUpVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.08] tracking-tight mb-3 sm:mb-4"
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                color: isDark ? '#ffffff' : '#2a2018',
              }}
            >
              {title}
            </motion.h1>

            {/* Description */}
            {description && (
              <motion.p
                variants={fadeUpVariants}
                className="text-sm sm:text-[15px] lg:text-base leading-relaxed mb-5 sm:mb-6 max-w-md"
                style={{ color: isDark ? 'rgba(255,255,255,0.55)' : '#6b5e4d' }}
              >
                {description}
              </motion.p>
            )}

            {/* CTA button */}
            {btnText && btnHref && (
              <motion.div variants={fadeUpVariants}>
                <motion.a
                  href={btnHref}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block px-6 py-3 text-sm font-semibold text-white rounded-full shadow-lg transition-colors duration-300"
                  style={{ backgroundColor: isDark ? '#29A8DD' : '#059669' }}
                >
                  {btnText}
                </motion.a>
              </motion.div>
            )}

            {/* Mobile stats row */}
            {hasStats && (
              <motion.div
                variants={fadeUpVariants}
                className="flex gap-4 sm:gap-6 mt-6 sm:mt-8 lg:hidden"
              >
                {mobileStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className={idx > 0 ? 'pl-6' : ''}
                    style={{
                      borderLeft:
                        idx > 0
                          ? `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#d9d0c0'}`
                          : undefined,
                    }}
                  >
                    <p
                      className="text-2xl font-bold"
                      style={{ color: isDark ? '#fff' : '#2a2018' }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="text-xs font-medium"
                      style={{ color: isDark ? 'rgba(255,255,255,0.45)' : '#8b7e6a' }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Bottom fade to white ── */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-white to-transparent pointer-events-none z-30" />
    </section>
  );
}