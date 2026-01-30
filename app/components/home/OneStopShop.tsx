"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, HardDrive, BarChart3, Sprout, ArrowUpRight } from 'lucide-react';

const OneStopShop = () => {
  const categories = [
    {
      title: "Fleet",
      desc: "Robotic harvesters & Ox-Bots.",
      icon: <HardDrive className="w-5 h-5" />,
      color: "#2da8da",
      tag: "Hardware"
    },
    {
      title: "Bio-Supply",
      desc: "Resilient seeds & nutrients.",
      icon: <Sprout className="w-5 h-5" />,
      color: "#64cc98",
      tag: "Supplies"
    },
    {
      title: "Intelligence",
      desc: "AI soil & weather analytics.",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "#f29629",
      tag: "Insight"
    }
  ];

  return (
    <section className="bg-white py-12 px-[5%]">
      <div className="max-w-[1200px] mx-auto">
        
        {/* --- MINIMAL HEADER --- */}
        <div className="flex items-baseline justify-between mb-8 border-b border-black/5 pb-6">
          <div className="flex items-baseline gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-black">
              Marketplace
            </h2>
            <span className="text-[10px] font-bold tracking-[2px] text-gray-400 uppercase">
              Integrated Ecosystem
            </span>
          </div>
          <button className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black">
            Full Catalog <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* --- PURE WHITE TILES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-black/5">
          {categories.map((cat, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ backgroundColor: "#fafafa" }}
              className="group p-8 border-r border-b border-black/5 transition-colors cursor-pointer"
            >
              <div className="mb-6 flex justify-between items-start">
                <div 
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-black/5 bg-white text-black group-hover:bg-black group-hover:text-white transition-all duration-300"
                >
                  {cat.icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-tighter text-gray-300 group-hover:text-black transition-colors">
                  {cat.tag}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black uppercase tracking-tighter mb-2 text-black">
                  {cat.title}
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-snug mb-6 max-w-[200px]">
                  {cat.desc}
                </p>
              </div>

              <div 
                className="h-1 w-0 group-hover:w-full transition-all duration-500" 
                style={{ backgroundColor: cat.color }}
              />
            </motion.div>
          ))}
        </div>

        {/* --- SLIM ACTION BAR --- */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 bg-[#64cc98] rounded-full animate-pulse" />
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Global Logistics: Online</span>
            </div>
          </div>
          
          <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#2da8da] transition-all">
            <ShoppingCart className="w-3 h-3" />
            <span>Open Dashboard</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default OneStopShop;