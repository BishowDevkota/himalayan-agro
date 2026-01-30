"use client";

import React from 'react';
import { motion } from 'framer-motion';

const EcoBalance = () => {
  const stats = [
    { number: "40%", label: "Water Saving", sub: "Precision Hydration", delay: 0 },
    { number: "2X", label: "Soil Vitality", sub: "Micro-Nutrient Logic", delay: 0.5 },
    { number: "CO2", label: "Net Zero", sub: "Carbon-Neutral Ops", delay: 1 },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-32 px-[5%]">
      
      {/* --- BACKGROUND LAYER --- */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000')" }}
      />
      {/* Matching the original HTML's dark gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-black/95 via-black/70 to-emerald-900/40" />

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-20 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT SIDE: The Glass Card (Directly from your HTML style) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-16 rounded-sm max-w-[750px]"
        >
          <span className="block font-bold tracking-[3px] text-sm uppercase mb-4 text-[#64cc98]">
            03 — OUR LEGACY
          </span>
          
          <h2 className="text-5xl md:text-8xl font-black uppercase leading-[0.9] mb-8 tracking-tighter text-white">
            Engineering <br />
            <span className="bg-gradient-to-r from-[#64cc98] to-[#a8e6cf] bg-clip-text text-transparent italic">
              Eco-Balance
            </span>
          </h2>

          <p className="text-lg leading-relaxed text-white/80 font-light mb-12 max-w-md">
            Sustainability isn't a feature; it's our foundation. We bridge the gap between industrial yield and planetary health through closed-loop systems.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-4 group">
                <div className="relative w-20 h-20 rounded-full flex items-center justify-center bg-[#64cc98]/10 border border-[#64cc98]/20">
                  {/* Animated Pulse Rings */}
                  <div className="absolute inset-0 rounded-full border border-[#64cc98] animate-ping opacity-20" style={{ animationDelay: `${stat.delay}s` }} />
                  <span className="text-xl font-black text-[#64cc98] group-hover:scale-110 transition-transform">
                    {stat.number}
                  </span>
                </div>
                <div className="text-white">
                  <strong className="block uppercase text-[10px] tracking-widest">{stat.label}</strong>
                  <span className="text-[10px] opacity-50">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-[#64cc98] text-black font-black uppercase text-xs tracking-widest hover:bg-white transition-colors"
          >
            View Impact Report
          </motion.button>
        </motion.div>

        {/* RIGHT SIDE: The Technical HUD (The "Something" on the right) */}
        <div className="hidden lg:flex relative justify-center items-center h-full">
          {/* Rotating Data Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-[500px] h-[500px] border border-dashed border-white/20 rounded-full"
          />
          
          {/* Floating Image Window */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="relative z-30 w-80 h-[450px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl rotate-3"
          >
            <img 
              src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1000" 
              className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-1000"
              alt="Agri Tech"
            />
            {/* Overlay UI on Image */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#64cc98] rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-white uppercase tracking-tighter">System: Active</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Data Chip */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-0 z-40 bg-black/80 backdrop-blur-md p-4 border-l-4 border-[#64cc98] shadow-xl"
          >
            <span className="text-[10px] text-[#64cc98] block uppercase font-bold">Node Telemetry</span>
            <div className="text-2xl font-black text-white">98.4%</div>
            <span className="text-[9px] text-white/40 italic text-nowrap">Resources optimized</span>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default EcoBalance;