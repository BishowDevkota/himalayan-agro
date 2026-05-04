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
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
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
      <div className="text-2xl md:text-3xl font-bold text-gray-900">{count}{suffix || ""}</div>
      <div className="mt-1 text-sm text-gray-600">{label}</div>
    </div>
  );
}
