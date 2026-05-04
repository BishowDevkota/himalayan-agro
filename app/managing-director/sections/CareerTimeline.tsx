"use client";

import { motion } from "framer-motion";
import { careerTimeline } from "../../../lib/data/sharma";

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
                <div className="bg-white border border-gray-100 rounded-md p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{item.role}</div>
                      <div className="text-xs text-gray-500">{item.org}</div>
                    </div>
                    <div className="text-xs text-gray-400">{item.period}</div>
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
