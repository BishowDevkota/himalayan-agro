"use client";

import { motion } from "framer-motion";
import { careerTimeline } from "../../../lib/data/sharma";

const accentStyles: Record<string, string> = {
  green: "border-l-green-500 hover:border-l-green-400 hover:bg-green-50/60",
  amber: "border-l-amber-400 hover:border-l-amber-300 hover:bg-amber-50/60",
  blue: "border-l-sky-400 hover:border-l-sky-300 hover:bg-sky-50/60",
  gray: "border-l-gray-300 hover:border-l-gray-200 hover:bg-gray-50",
};

export default function CareerTimeline() {
  return (
    <section id="career" className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold mb-6">Career Timeline</h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-400" />
          <div className="pl-10">
            {careerTimeline.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }} className="mb-6">
                <div className={`group border-l-4 ${accentStyles[item.accent] || accentStyles.gray} bg-white rounded-2xl p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gray-200 hover:shadow-[0_16px_40px_rgba(28,43,20,0.08)]`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-semibold text-gray-900 transition-colors duration-300 group-hover:text-[#1C2B14]">{item.role}</div>
                      <div className="text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-700">{item.org}</div>
                    </div>
                    <div className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-600">{item.period}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
