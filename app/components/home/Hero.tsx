'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    tag: "Precision Crop Management",
    title: "Precision Farming and Soil",
    titleLine2: "Health Monitoring",
    subtitle: "Seamlessly integrate IoT sensor data to make smarter decisions",
    btnText: "Explore Solutions",
    href: "/shop",
    accentColor: "#d97706",
    img: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=2000",
    stats: [
      { value: "24K", label: "Connected Sensors", sublabel: "57 Active Nodes" },
      { value: "215", label: "Irrigated Zones", sublabel: "18 Modern Zones" },
    ],
    floatingCards: [
      { label: "Vegetation Index (NDVI)", value: "Trend: +4.2% Growth" },
      { label: "Agronomist Insight", value: "Nitrogen levels dropping" },
    ],
    hectares: { value: "156K", label: "Total Hectares", sublabel: "Monitored" },
  },
  {
    tag: "Smart Agriculture Solutions",
    title: "Autonomous Systems for",
    titleLine2: "Modern Agriculture",
    subtitle: "Harness AI-driven tools to optimize yield and reduce waste",
    btnText: "Shop Products",
    href: "/shop",
    accentColor: "#059669",
    img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=2000",
    stats: [
      { value: "12K", label: "Active Farms", sublabel: "32 Regions" },
      { value: "98%", label: "Yield Accuracy", sublabel: "AI Predicted" },
    ],
    floatingCards: [
      { label: "Crop Health Score", value: "Trend: +6.8% Increase" },
      { label: "Weather Alert", value: "Rain expected in 48hrs" },
    ],
    hectares: { value: "89K", label: "Smart Acres", sublabel: "Automated" },
  },
  {
    tag: "Sustainable Farming Initiative",
    title: "Global Impact Through",
    titleLine2: "Responsible Agriculture",
    subtitle: "Building a sustainable future with data-driven farming practices",
    btnText: "Learn More",
    href: "/about",
    accentColor: "#0891b2",
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000",
    stats: [
      { value: "340+", label: "Partner Farms", sublabel: "12 Countries" },
      { value: "45%", label: "Water Saved", sublabel: "vs Traditional" },
    ],
    floatingCards: [
      { label: "Carbon Footprint", value: "Reduced by 32% YoY" },
      { label: "Soil Analysis", value: "pH levels optimal" },
    ],
    hectares: { value: "210K", label: "Sustainable Acres", sublabel: "Certified" },
  },
];

function ChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 16l4-8 4 4 4-6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" />
    </svg>
  );
}

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const slideVariants = {
  enter: { opacity: 0 },
  center: {
    opacity: 1,
    transition: { duration: 0.9, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: "easeIn" as const },
  },
};

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative w-full bg-[#f5f0e8] overflow-hidden h-[calc(100dvh-64px)] min-h-[500px]">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.img})` }}
          />
          <div className="absolute inset-0 bg-[#f5f0e8]/85" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-14 items-center w-full py-4 sm:py-10 lg:py-0">

          {/* === LEFT: Text === */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${current}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="max-w-lg order-2 lg:order-1"
            >
              <motion.div variants={fadeUpVariants}>
                <span className="inline-block px-4 py-1.5 rounded-full border border-[#c4b99a] text-[#5a4e3c] text-xs sm:text-sm font-medium tracking-wide mb-5">
                  {slide.tag}
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUpVariants}
                className="text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#2a2018] leading-[1.12] tracking-tight mb-2 sm:mb-4"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {slide.title}
                <br />
                {slide.titleLine2}
              </motion.h1>

              <motion.p
                variants={fadeUpVariants}
                className="text-[#6b5e4d] text-xs sm:text-base lg:text-lg leading-relaxed mb-4 sm:mb-7 max-w-md"
              >
                {slide.subtitle}
              </motion.p>

              <motion.div variants={fadeUpVariants}>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(slide.href)}
                  className="px-7 py-3.5 text-sm font-semibold text-white rounded-full shadow-lg transition-colors duration-300"
                  style={{ backgroundColor: slide.accentColor }}
                >
                  {slide.btnText}
                </motion.button>
              </motion.div>

              {/* Mobile-only stats row */}
              <motion.div
                variants={fadeUpVariants}
                className="flex gap-4 sm:gap-6 mt-4 sm:mt-8 lg:hidden"
              >
                {slide.stats.map((stat, idx) => (
                  <div key={idx} className={idx > 0 ? "border-l border-[#d9d0c0] pl-4 sm:pl-6" : ""}>
                    <p className="text-xl sm:text-2xl font-bold text-[#2a2018]">{stat.value}</p>
                    <p className="text-[10px] sm:text-xs text-[#8b7e6a] font-medium">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* === RIGHT: Visual === */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`visual-${current}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" as const, delay: 0.15 }}
              className="relative flex items-center justify-center order-1 lg:order-2"
            >
              {/* Central image */}
              <div className="relative w-full max-w-[180px] sm:max-w-xs md:max-w-sm lg:max-w-md mx-auto aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={slide.img}
                  alt="Agriculture"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>

              {/* --- Floating Cards (desktop only) --- */}

              {/* Top-left: NDVI card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="hidden lg:flex absolute top-16 -left-10 bg-white rounded-xl shadow-lg px-3.5 py-2.5 items-center gap-2.5 z-20 border border-gray-100"
              >
                <div className="w-9 h-9 rounded-lg bg-[#fef3c7] flex items-center justify-center flex-shrink-0">
                  <ChartIcon />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#2a2018] leading-tight">{slide.floatingCards[0].label}</p>
                  <p className="text-[11px] text-[#8b7e6a]">{slide.floatingCards[0].value}</p>
                </div>
              </motion.div>

              {/* Top-right: Stats card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="hidden lg:block absolute top-6 -right-8 bg-white rounded-xl shadow-lg px-4 py-3 z-20 border border-gray-100"
              >
                <div className="flex gap-5">
                  {slide.stats.map((stat, idx) => (
                    <div key={idx} className={idx > 0 ? "border-l border-gray-100 pl-5" : ""}>
                      <p className="text-[10px] font-semibold text-[#8b7e6a] tracking-wider uppercase">{stat.label}</p>
                      <motion.p
                        key={`s-${current}-${idx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + idx * 0.12, duration: 0.45 }}
                        className="text-xl font-bold text-[#2a2018] mt-0.5"
                      >
                        {stat.value}
                      </motion.p>
                      <p className="text-[10px] text-gray-400">{stat.sublabel}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Bottom-left: Hectares */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="hidden lg:block absolute bottom-20 -left-8 bg-[#2a2018] rounded-xl shadow-lg px-4 py-3 z-20"
              >
                <motion.p
                  key={`h-${current}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.4 }}
                  className="text-2xl font-bold text-white"
                >
                  {slide.hectares.value}
                </motion.p>
                <p className="text-[11px] text-gray-300">{slide.hectares.label}</p>
                <p className="text-[10px] text-gray-500">{slide.hectares.sublabel}</p>
              </motion.div>

              {/* Bottom-right: Insight */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.95 }}
                className="hidden lg:flex absolute bottom-8 -right-6 bg-white rounded-xl shadow-lg px-3.5 py-2.5 items-center gap-2.5 z-20 border border-gray-100"
              >
                <div className="w-9 h-9 rounded-full bg-[#d1fae5] flex items-center justify-center flex-shrink-0">
                  <GlobeIcon />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#2a2018] leading-tight">{slide.floatingCards[1].label}</p>
                  <p className="text-[11px] text-[#8b7e6a]">{slide.floatingCards[1].value}</p>
                </div>
              </motion.div>

              {/* Decorative line (desktop) */}
              <svg className="absolute bottom-28 right-10 w-20 h-20 text-[#c4b99a] opacity-30 hidden lg:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 90 Q 50 10, 90 50" strokeLinecap="round" />
                <path d="M85 45 L90 50 L84 54" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => setCurrent(i)}
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.9 }}
            className={`rounded-full transition-all duration-500 ${
              current === i ? "w-7 h-2 bg-[#059669]" : "w-2 h-2 bg-[#c4b99a] hover:bg-[#a89d8a]"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}