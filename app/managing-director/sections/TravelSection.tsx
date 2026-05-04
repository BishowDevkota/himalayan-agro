"use client";

import { motion } from "framer-motion";
import { travels } from "../../../lib/data/sharma";

export default function TravelSection() {
  return (
    <section id="travels" className="py-10 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">International Exposure</h3>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap gap-2">
          {travels.map((c, i) => (
            <motion.div
              key={c}
              whileInView={{ y: 0, opacity: 1 }}
              initial={{ y: 8, opacity: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group px-3 py-1.5 bg-green-50 text-green-800 rounded-full text-sm flex items-center gap-2 transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-green-100 hover:text-green-900 hover:shadow-[0_10px_24px_rgba(28,43,20,0.08)]"
            >
              <span className="text-sm transition-transform duration-300 group-hover:scale-110">{getFlag(c)}</span>
              <span>{c}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function getFlag(country: string) {
  const map: Record<string,string> = {
    India: '🇮🇳', 'UAE (Dubai)': '🇦🇪', 'South Korea': '🇰🇷', Japan: '🇯🇵', Russia: '🇷🇺', Pakistan: '🇵🇰', Malaysia: '🇲🇾', 'United Kingdom': '🇬🇧', Australia: '🇦🇺', Bangladesh: '🇧🇩', Singapore: '🇸🇬'
  };
  return map[country] || '🌍';
}
