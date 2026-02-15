import Link from "next/link";
import SubHeroSection from "../components/SubHeroSection";
import { Section as AnimatedSection, Div as AnimatedDiv } from "../components/AnimatedClient";
import WhatWeDo from "../components/home/WhatWeDo";

export const metadata = {
  title: "About — Himalaya Nepal Agriculture",
  description: "A comprehensive overview of our 20-year strategic plan for agricultural transformation.",
};

export default function AboutPage() {
  return (
    <main className="bg-white text-slate-900 selection:bg-sky-100">
      <SubHeroSection
        title="About Himalaya Nepal"
        description="Transitioning from subsistence farming to a competitive, export-oriented industrial system through land consolidation and technology."
        image="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=2000"
        tag="Our 20-Year Strategic Plan"
        stats={[
          { value: "57.3%", label: "Pop. Dependent" },
          { value: "2035", label: "Strategic Horizon" },
        ]}
        btnText="Explore Our Mission"
        btnHref="/contact"
      />

      <div className="max-w-7xl mx-auto px-6 mb-32">
        
        {/* 2. Macro-Economic Context Component */}
        <AnimatedSection
          className="mt-28 py-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#29A8DD]/20 text-[#29A8DD] text-[11px] font-bold tracking-[3px] uppercase mb-6 bg-[#29A8DD]/5">
                The National Context
              </span>
              <h2 className="text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight mb-6">
                Correcting the{" "}
                <span className="bg-linear-to-r from-[#29A8DD] to-[#64cc98] bg-clip-text text-transparent">
                  256.98 Arab
                </span>{" "}
                Trade Deficit
              </h2>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg">
                Agriculture contributes 24.09% to Nepal&apos;s GDP. We address the critical labor shortages and land fragmentation that currently hinder our national productivity.
              </p>
              <div className="flex gap-0">
                {[
                  { value: "57.3%", label: "Pop. Dependent", sub: "Agriculture Sector" },
                  { value: "2035", label: "Strategic Horizon", sub: "ADS Aligned" },
                  { value: "753", label: "Sales Centers", sub: "Local Network" },
                ].map((stat, i) => (
                  <div key={i} className={`${i > 0 ? "border-l border-slate-200 pl-8 ml-8" : ""}`}>
                    <div className="text-3xl font-black tracking-tight">{stat.value}</div>
                    <div className="text-[11px] text-[#29A8DD] font-bold uppercase tracking-wider mt-1">{stat.label}</div>
                    <div className="text-[10px] text-slate-400 uppercase">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative p-10 rounded-4xl bg-linear-to-br from-[#0a1628] to-[#0c2d48] text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#29A8DD]/10 blur-[80px] rounded-full -mr-20 -mt-20" />
              <div className="absolute inset-px rounded-[31px] border border-white/6 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 bg-[#29A8DD] rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-[#29A8DD] uppercase tracking-[3px]">Strategic Mandate</span>
                </div>
                <p className="text-white/70 text-[15px] leading-relaxed font-light">
                  &ldquo;Our foundation is built upon the constitutional mandate for land reform and the Agriculture Development Strategy (2015-2035), envisioning a self-sufficient and competitive sector.&rdquo;
                </p>
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#29A8DD]/20 flex items-center justify-center">
                    <span className="text-[#29A8DD] text-xs font-black">N</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white/90">Nepal Government</div>
                    <div className="text-[10px] text-white/40">Agricultural Policy Framework</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Divider */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

        {/* 3. The Ten Strategic Objectives (Grid Component) */}
        <AnimatedDiv
          className="mt-28"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#29A8DD]/20 text-[#29A8DD] text-[11px] font-bold tracking-[3px] uppercase mb-5 bg-[#29A8DD]/5">
              Our Blueprint
            </span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Ten Strategic Objectives</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { name: "Modernization", icon: "⚙️" },
              { name: "Commercialization", icon: "📈" },
              { name: "Land Consolidation", icon: "🗺️" },
              { name: "Quality Testing", icon: "🔬" },
              { name: "Farmer Welfare", icon: "🤝" },
              { name: "Supply Chain", icon: "🔗" },
              { name: "Export Promotion", icon: "🌍" },
              { name: "R&D Innovation", icon: "💡" },
              { name: "Digital Logistics", icon: "📱" },
              { name: "Agri-Tourism", icon: "🏔️" },
            ].map((obj, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl border border-slate-100 text-center transition-all duration-300 hover:border-[#29A8DD]/30 hover:bg-[#29A8DD]/[0.03] hover:shadow-lg hover:shadow-[#29A8DD]/5 hover:-translate-y-1"
              >
                <span className="text-2xl block mb-3 group-hover:scale-110 transition-transform duration-300">{obj.icon}</span>
                <span className="block text-[#29A8DD] font-black text-xs mb-1.5 tabular-nums">0{i + 1}</span>
                <span className="text-[11px] font-bold uppercase tracking-tight text-slate-700">{obj.name}</span>
              </div>
            ))}
          </div>
        </AnimatedDiv>

        {/* 4. Land Consolidation Component */}
        <AnimatedSection
          className="mt-28 p-2 rounded-[48px] bg-[#0a1628] overflow-hidden"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="p-10 lg:p-16 rounded-[40px] border border-white/6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative rounded-4xl overflow-hidden aspect-4/3">
                <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800" alt="Land Reform" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-[#0a1628] via-[#0a1628]/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#29A8DD] rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-[2px]">Active Program</span>
                  </div>
                </div>
              </div>
              <div className="text-white">
                <span className="inline-block px-4 py-1.5 rounded-full border border-[#29A8DD]/30 text-[#29A8DD] text-[11px] font-bold tracking-[3px] uppercase mb-6 bg-[#29A8DD]/10">
                  Core Initiative
                </span>
                <h2 className="text-3xl lg:text-4xl font-black mb-6 tracking-tight leading-tight">Land Consolidation & Industrial Zones</h2>
                <p className="text-white/50 mb-10 leading-relaxed text-[15px]">
                  We convert fragmented subsistence plots into large-scale commercial production zones. This allows for mechanization and high-value crop rotations that were previously impossible.
                </p>
                <div className="space-y-4">
                  {["Cooperative Farming Models", "Industrial Zone Establishment", "Collective Resource Management"].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-8 h-8 rounded-full bg-[#29A8DD]/10 border border-[#29A8DD]/20 flex items-center justify-center shrink-0 group-hover:bg-[#29A8DD]/20 transition-colors">
                        <span className="text-[#29A8DD] text-xs">✓</span>
                      </div>
                      <span className="font-medium text-white/80 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* 5. Product Verticals (Visual Component) */}
        <AnimatedDiv
          className="mt-28"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#29A8DD]/20 text-[#29A8DD] text-[11px] font-bold tracking-[3px] uppercase mb-5 bg-[#29A8DD]/5">
                Product Verticals
              </span>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Export-Grade Value Chains</h2>
            </div>
            <Link href="/shop" className="text-sm font-bold text-[#29A8DD] hover:text-[#0891b2] transition-colors flex items-center gap-1.5 shrink-0">
              View All Products
              <span className="text-lg">→</span>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Large Cardamom", img: "https://images.unsplash.com/photo-1599232458812-5858c974888d?auto=format&fit=crop&q=80&w=400", desc: "Value-added processing for Middle Eastern and European markets." },
              { title: "Organic Coffee", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400", desc: "Grade-certified orthodox beans from high-altitude clusters." },
              { title: "CTC & Orthodox Tea", img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=400", desc: "Global branding under the 'Made in Nepal' quality mark." }
            ].map((product, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-[28px] mb-6 aspect-square bg-slate-100">
                  <img src={product.img} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-5 left-5 right-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold">
                      Explore <span>→</span>
                    </span>
                  </div>
                </div>
                <h4 className="text-lg font-bold mb-1.5 group-hover:text-[#29A8DD] transition-colors duration-300">{product.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{product.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedDiv>

        {/* 6. Farmer Welfare Fund Component */}
        <AnimatedSection
          className="mt-28 relative py-20 px-8 lg:px-16 rounded-[48px] overflow-hidden text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-linear-to-br from-emerald-50 via-white to-emerald-50/50" />
          <div className="absolute inset-px rounded-[47px] border border-emerald-200/40 pointer-events-none" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-200/20 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full border border-emerald-300/40 text-emerald-600 text-[11px] font-bold tracking-[3px] uppercase mb-5 bg-emerald-50">
              Objective 6
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 text-emerald-900 tracking-tight">Farmer Rights & Social Security</h2>
            <p className="text-slate-500 max-w-2xl mx-auto mb-14 text-[15px] leading-relaxed">
              We operate a dedicated fund for insurance, relief, and capacity building, ensuring that agriculture becomes a respectable and secure profession.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Relief Programs", icon: "🛡️" },
                { name: "Crop Insurance", icon: "🌾" },
                { name: "Technical Mentoring", icon: "🎓" },
                { name: "Fair Pricing Audits", icon: "⚖️" },
              ].map((tag, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100/60 hover:shadow-md hover:border-emerald-200/60 hover:-translate-y-0.5 transition-all duration-300">
                  <span className="text-2xl block mb-3">{tag.icon}</span>
                  <span className="font-bold text-sm text-emerald-800">{tag.name}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* 7. Digital Infrastructure Component */}
        <AnimatedSection
          className="mt-28 grid lg:grid-cols-2 gap-20 items-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#29A8DD]/20 text-[#29A8DD] text-[11px] font-bold tracking-[3px] uppercase mb-6 bg-[#29A8DD]/5">
              Digital Infrastructure
            </span>
            <h2 className="text-3xl lg:text-4xl font-black mb-6 tracking-tight">Digital Logistics & Traceability</h2>
            <p className="text-slate-500 mb-10 leading-relaxed text-[15px]">
              Every shipment is tracked via our digital logistics system, ensuring quality compliance and transparency from the farm gate to the international buyer.
            </p>
            <div className="space-y-6">
              {[
                { icon: "📱", title: "Real-time Market Prices", desc: "Mobile apps connecting farmers to current global price indices." },
                { icon: "📊", title: "Inventory Management", desc: "Digital systems for our 753 local-level sales centers." },
                { icon: "🔍", title: "End-to-End Traceability", desc: "Full provenance tracking from seed to shelf for quality assurance." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-[#29A8DD]/10 border border-[#29A8DD]/10 flex items-center justify-center shrink-0 group-hover:bg-[#29A8DD]/15 transition-colors">
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="p-2 rounded-4xl bg-linear-to-br from-slate-100 to-slate-50 border border-slate-200/60">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" alt="Tech Dashboard" className="rounded-3xl w-full" />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-slate-100 p-5 z-10">
              <div className="text-[10px] font-bold text-[#29A8DD] uppercase tracking-[2px] mb-1">Network Coverage</div>
              <div className="text-2xl font-black">753</div>
              <div className="text-[10px] text-slate-400">Local Sales Centers</div>
            </div>
          </div>
        </AnimatedSection>

        {/* 8. Logistics & Supply Chain */}
        <AnimatedDiv
          className="mt-28"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 p-10 bg-linear-to-br from-slate-50 to-white rounded-4xl border border-slate-100 flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full border border-[#29A8DD]/20 text-[#29A8DD] text-[10px] font-bold tracking-[2px] uppercase mb-5 bg-[#29A8DD]/5">
                  Infrastructure
                </span>
                <h3 className="text-2xl font-black mb-3 tracking-tight">The Network</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">Building the physical backbone of Nepali trade.</p>
              </div>
              <ul className="space-y-4">
                {["Regional Cold Storage", "Transport Hubs", "Global Shipping Partners", "Quality Control Labs"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <span className="w-6 h-6 rounded-full bg-[#29A8DD]/10 flex items-center justify-center shrink-0">
                      <span className="text-[#29A8DD] text-[10px] font-black">✓</span>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-2 relative rounded-4xl overflow-hidden min-h-80">
              <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200" alt="Logistics" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-[#0a1628]/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-[#29A8DD] rounded-full animate-pulse" />
                  <span className="text-[11px] font-bold text-white/80 uppercase tracking-[2px]">Global Supply Chain Network</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedDiv>

        {/* 9. Ownership & Governance */}
        <AnimatedSection
          className="mt-28 relative p-12 lg:p-20 rounded-[48px] overflow-hidden text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-white to-sky-50/30" />
          <div className="absolute inset-px rounded-[47px] border border-slate-200/50 pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#29A8DD]/20 text-[#29A8DD] text-[11px] font-bold tracking-[3px] uppercase mb-5 bg-[#29A8DD]/5">
              Governance
            </span>
            <h2 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">Transparent Governance</h2>
            <p className="text-slate-400 mb-16 max-w-xl mx-auto text-[15px] leading-relaxed">Public shareholding ensures accountability and maintains strong community relations.</p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-16 md:gap-24">
              <div className="relative group">
                <div className="w-52 h-52 rounded-full border-10 border-[#0a1628] flex items-center justify-center group-hover:border-[#29A8DD] transition-colors duration-500">
                  <div className="text-center">
                    <span className="text-4xl font-black block">80%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mt-1 block">Founders</span>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="w-52 h-52 rounded-full border-10 border-[#29A8DD] flex items-center justify-center group-hover:border-[#64cc98] transition-colors duration-500">
                  <div className="text-center">
                    <span className="text-4xl font-black block">20%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mt-1 block">Public</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-14 flex items-center justify-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#0a1628]" /> Founder Equity</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#29A8DD]" /> Public Shareholding</span>
            </div>
          </div>
        </AnimatedSection>

        {/* 10. Leadership & Planning Team */}
        <AnimatedDiv
          className="mt-28"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14 gap-4">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#29A8DD]/20 text-[#29A8DD] text-[11px] font-bold tracking-[3px] uppercase mb-5 bg-[#29A8DD]/5">
                Our Team
              </span>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Strategic Leadership</h2>
              <p className="text-slate-400 mt-3 text-[15px]">Driven by sectoral experts and innovation leads.</p>
            </div>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-[2px] shrink-0">Authored by: Dolma Shrestha</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Dolma Shrestha", role: "Strategic Planner", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
              { name: "Field Experts", role: "Cluster Management", icon: "🚜" },
              { name: "R&D Team", role: "Innovation Centre", icon: "🔬" },
              { name: "Quality Analysts", role: "Compliance & Standards", icon: "✅" }
            ].map((p, i) => (
              <div key={i} className="group text-center">
                <div className="relative w-full aspect-square rounded-[28px] bg-gradient-to-br from-slate-50 to-slate-100 mb-5 overflow-hidden border border-slate-100 group-hover:border-[#29A8DD]/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#29A8DD]/5">
                  {p.img ? (
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500">{p.icon}</span>
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-sm group-hover:text-[#29A8DD] transition-colors duration-300">{p.name}</h4>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mt-1">{p.role}</p>
              </div>
            ))}
          </div>
        </AnimatedDiv>

        {/* 11. WhatWeDo Component Integration */}
        <AnimatedDiv className="mt-28">
          <WhatWeDo />
        </AnimatedDiv>

        {/* 12. Final Call to Action */}
        <AnimatedSection
          className="mt-28 relative text-center py-28 rounded-[48px] overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Background */}
          <div className="absolute inset-0 bg-[#0a1628]" />
          <div className="absolute inset-px rounded-[47px] border border-white/6 pointer-events-none" />
          
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#29A8DD]/15 blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#64cc98]/10 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none" />

          {/* Dashed ring decorations */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 border border-dashed border-white/4 rounded-full pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 border border-dashed border-white/3 rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto px-6">
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#29A8DD]/30 text-[#29A8DD] text-[11px] font-bold tracking-[3px] uppercase mb-8 bg-[#29A8DD]/10">
              Join Our Mission
            </span>
            <h2 className="text-4xl lg:text-6xl font-black mb-8 text-white tracking-tight leading-[1.05]">
              Paving the Way for{" "}
              <span className="bg-linear-to-r from-[#29A8DD] to-[#64cc98] bg-clip-text text-transparent">
                Economic Transformation
              </span>
            </h2>
            <p className="text-white/50 text-lg mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Join our mission to modernize, commercialize, and industrialize Nepal&apos;s agriculture for a sustainable future.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 bg-linear-to-r from-[#29A8DD] to-[#64cc98] text-white rounded-full font-bold text-sm hover:shadow-lg hover:shadow-[#29A8DD]/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get in Touch
              <span className="text-lg">→</span>
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
}