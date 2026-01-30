"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Partners = () => {
  const partners = [
    { name: "TerraForm", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/Skanska_logo.svg", color: "#2da8da" },
    { name: "EcoLogic", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", color: "#64cc98" },
    { name: "SkyNet", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", color: "#f29629" },
    { name: "HydroGen", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", color: "#e50914" },
    { name: "AgriFlow", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg", color: "#054ada" },
  ];

  return (
    <section className="bg-[#f0f7f4] py-24 px-[5%] relative overflow-hidden">
      {/* Decorative "Pollen" Elements - Subtle colored blurs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#64cc98]/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#2da8da]/10 blur-[100px] rounded-full" />

      <div className="max-w-[1200px] mx-auto">
        
        {/* --- COLORED HEADER --- */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-8 bg-[#64cc98]" />
              <span className="text-[#64cc98] font-black tracking-[4px] text-[10px] uppercase">Our Network</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1a2e25] leading-[0.9]">
              Powering <br />
              <span className="text-[#2da8da]">Global Connectivity</span>
            </h2>
          </div>
          <p className="text-sm text-[#4a6358] font-medium max-w-[320px] leading-relaxed italic">
            "Integration is the bridge between raw data and harvestable results."
          </p>
        </div>

        {/* --- COLORED LOGO CARDS --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {partners.map((partner, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative h-40 bg-white rounded-2xl p-8 flex items-center justify-center shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-white overflow-hidden"
            >
              {/* Background Glow Effect on Hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                style={{ backgroundColor: partner.color }}
              />
              
              {/* Logo - Full Color */}
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="max-h-10 w-full object-contain filter drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
              />

              {/* Bottom "Indicator" Line */}
              <div 
                className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                style={{ backgroundColor: partner.color }}
              />
            </motion.div>
          ))}

          {/* Special "Inquiry" Card */}
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="h-40 bg-[#1a2e25] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer shadow-xl"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-[#64cc98] mb-2">Connect</span>
            <span className="text-white text-xs font-bold leading-tight">Become a <br/>Strategic Ally</span>
            <div className="mt-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-lg group">
              →
            </div>
          </motion.div>
        </div>

        {/* --- STATS RIBBON --- */}
        <div className="mt-16 flex flex-wrap justify-center gap-12 border-t border-[#64cc98]/20 pt-12">
          <div className="text-center">
            <div className="text-2xl font-black text-[#1a2e25]">50+</div>
            <div className="text-[9px] uppercase tracking-widest font-bold text-[#64cc98]">Global Partners</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-[#1a2e25]">14</div>
            <div className="text-[9px] uppercase tracking-widest font-bold text-[#2da8da]">Research Hubs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-[#1a2e25]">24/7</div>
            <div className="text-[9px] uppercase tracking-widest font-bold text-[#f29629]">Network Support</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Partners;