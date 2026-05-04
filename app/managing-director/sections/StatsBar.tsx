"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { stats } from "../../../lib/data/sharma";

function useCount(target: number) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const duration = 900;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return value;
}

export default function StatsBar() {
  return (
    <div id="experience" className="bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group rounded-2xl border border-gray-100 bg-white px-4 py-5 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#1C2B14]/15 hover:shadow-[0_16px_40px_rgba(28,43,20,0.08)]"
            >
              <CountItem label={s.label} value={s.value} suffix={s.suffix} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CountItem({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  const count = useCount(value);
  return (
    <div>
      <div className="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#1C2B14] md:text-3xl">{count}{suffix || ""}</div>
      <div className="mt-1 text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">{label}</div>
    </div>
  );
}
