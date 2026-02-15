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
      {/* 1. SubHero Section (Existing) */}
      <SubHeroSection
        title={"About Himalaya Nepal "}
        description={
          "Transitioning from subsistence farming to a competitive, export-oriented industrial system through land consolidation and technology."
        }
        image={"https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=2000"}
      />

      <div className="max-w-7xl mx-auto px-6 mb-32">
        
        {/* 2. Macro-Economic Context Component */}
        <AnimatedSection className="mt-24 py-16 border-b border-slate-100">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sky-600 font-bold tracking-widest text-xs uppercase mb-4 block">The National Context</span>
              <h2 className="text-4xl font-black leading-tight mb-6">Correcting the 256.98 Arab Trade Deficit</h2>
              <p className="text-lg text-slate-600 mb-6">
                Agriculture contributes 24.09% to Nepal's GDP. We address the critical labor shortages and land fragmentation that currently hinder our national productivity.
              </p>
              <div className="flex gap-12">
                <div>
                  <div className="text-3xl font-black">57.3%</div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Pop. Dependent</div>
                </div>
                <div>
                  <div className="text-3xl font-black">2035</div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Strategic Horizon</div>
                </div>
              </div>
            </div>
            <div className="p-8 border border-slate-100 rounded-[40px] bg-slate-50/30">
              <h4 className="font-bold mb-4">Strategic Mandate</h4>
              <p className="text-sm text-slate-500 leading-relaxed italic">
                "Our foundation is built upon the constitutional mandate for land reform and the Agriculture Development Strategy (2015-2035), envisioning a self-sufficient and competitive sector."
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* 3. The Ten Strategic Objectives (Grid Component) */}
        <div className="mt-32">
          <h2 className="text-3xl font-black mb-12 text-center">Our Ten Strategic Objectives</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              "Modernization", "Commercialization", "Land Consolidation", "Quality Testing", 
              "Farmer Welfare", "Supply Chain", "Export Promotion", "R&D Innovation", 
              "Digital Logistics", "Agri-Tourism"
            ].map((obj, i) => (
              <div key={i} className="p-6 border border-slate-100 rounded-2xl text-center hover:bg-slate-50 transition-colors">
                <span className="block text-sky-600 font-black mb-2">0{i + 1}</span>
                <span className="text-xs font-bold uppercase tracking-tight">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Land Consolidation Component */}
        <AnimatedSection className="mt-32 p-12 lg:p-20 bg-slate-900 rounded-[60px] text-white">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
               <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800" alt="Land Reform" className="rounded-[40px] opacity-80" />
               <div className="absolute inset-0 bg-linear-to-t from-slate-900 to-transparent" />
            </div>
            <div>
              <h2 className="text-3xl font-black mb-6">Land Consolidation & Industrial Zones</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                We convert fragmented subsistence plots into large-scale commercial production zones. This allows for mechanization and high-value crop rotations that were previously impossible.
              </p>
              <div className="space-y-4">
                {["Cooperative Farming Models", "Industrial Zone Establishment", "Collective Resource Management"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-sky-500" />
                    <span className="font-medium text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* 5. Product Verticals (Visual Component) */}
        <div className="mt-32">
          <h2 className="text-3xl font-black mb-12">Export-Grade Value Chains</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Large Cardamom", img: "https://images.unsplash.com/photo-1599232458812-5858c974888d?auto=format&fit=crop&q=80&w=400", desc: "Value-added processing for Middle Eastern and European markets." },
              { title: "Organic Coffee", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400", desc: "Grade-certified orthodox beans from high-altitude clusters." },
              { title: "CTC & Orthodox Tea", img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=400", desc: "Global branding under the 'Made in Nepal' quality mark." }
            ].map((product, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="overflow-hidden rounded-4xl mb-6 aspect-square">
                  <img src={product.img} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <h4 className="text-xl font-bold mb-2">{product.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{product.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Farmer Welfare Fund Component */}
        <div className="mt-32 py-20 px-8 rounded-[60px] border border-emerald-100 bg-emerald-50/20 text-center">
          <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest block mb-4">Objective 6</span>
          <h2 className="text-4xl font-black mb-6 text-emerald-900">Farmer Rights & Social Security</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-12">
            We operate a dedicated fund for insurance, relief, and capacity building, ensuring that agriculture becomes a respectable and secure profession.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["Relief Programs", "Crop Insurance", "Technical Mentoring", "Fair Pricing Audits"].map((tag, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 font-bold text-emerald-700">
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* 7. Digital Infrastructure Component */}
        <AnimatedSection className="mt-32 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl font-black mb-6">Digital Logistics & Traceability</h2>
            <p className="text-slate-600 mb-8">
              Every shipment is tracked via our digital logistics system, ensuring quality compliance and transparency from the farm gate to the international buyer.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-sky-500 text-2xl">📱</div>
                <div>
                  <h5 className="font-bold">Real-time Market Prices</h5>
                  <p className="text-sm text-slate-400">Mobile apps connecting farmers to current global price indices.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-sky-500 text-2xl">📊</div>
                <div>
                  <h5 className="font-bold">Inventory Management</h5>
                  <p className="text-sm text-slate-400">Digital systems for our 753 local-level sales centers.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-1 border border-slate-100 rounded-[40px]">
            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" alt="Tech Dashboard" className="rounded-[36px]" />
          </div>
        </AnimatedSection>

        {/* 8. Logistics & Supply Chain (Checks Component) */}
        <div className="mt-32">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 p-10 bg-slate-50 rounded-[40px]">
              <h3 className="text-2xl font-black mb-4">The Network</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">Building the physical backbone of Nepali trade.</p>
              <ul className="space-y-3">
                {["Regional Cold Storage", "Transport Hubs", "Global Shipping Partners", "Quality Control Labs"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold">
                    <span className="text-sky-500">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-2 relative rounded-[40px] overflow-hidden">
               <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200" alt="Logistics" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* 9. Ownership & Governance (Chart Component) */}
        <div className="mt-32 p-12 lg:p-24 border border-slate-100 rounded-[60px] text-center">
          <h2 className="text-3xl font-black mb-4">Transparent Governance</h2>
          <p className="text-slate-500 mb-12 max-w-xl mx-auto">Public shareholding ensures the company maintains good relations with the community and ensures accountability.</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-16">
            <div className="w-48 h-48 rounded-full border-12 border-slate-900 flex items-center justify-center relative">
              <span className="text-2xl font-black">80%</span>
              <span className="absolute -bottom-8 text-xs font-bold text-slate-400 uppercase">Founders</span>
            </div>
            <div className="w-48 h-48 rounded-full border-12 border-sky-400 flex items-center justify-center relative">
              <span className="text-2xl font-black">20%</span>
              <span className="absolute -bottom-8 text-xs font-bold text-slate-400 uppercase">Public</span>
            </div>
          </div>
        </div>

        {/* 10. Leadership & Planning Team */}
        <div className="mt-32">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black">Strategic Leadership</h2>
              <p className="text-slate-500 mt-2">Driven by sectoral experts and innovation leads.</p>
            </div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Authored by: Dolma Shrestha</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Dolma Shrestha", role: "Strategic Planner", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
              { name: "Field Experts", role: "Cluster Management", icon: "🚜" },
              { name: "R&D Team", role: "Innovation Centre", icon: "🔬" },
              { name: "Quality Analysts", role: "Compliance & Standards", icon: "✅" }
            ].map((p, i) => (
              <div key={i} className="text-center">
                <div className="w-full aspect-square rounded-full bg-slate-50 mb-4 overflow-hidden flex items-center justify-center relative border border-slate-50">
                  {p.img ? <img src={p.img} alt={p.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" /> : <span className="text-4xl opacity-20">{p.icon}</span>}
                </div>
                <h4 className="font-bold text-sm">{p.name}</h4>
                <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">{p.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 11. WhatWeDo Component Integration */}
        <AnimatedDiv className="mt-32">
          <WhatWeDo />
        </AnimatedDiv>

        {/* 12. Final Call to Action */}
        <AnimatedSection className="mt-32 text-center py-24 bg-slate-900 rounded-[60px] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/20 blur-[100px] rounded-full -mr-32 -mt-32" />
          <h2 className="text-5xl font-black mb-8 relative z-10">Paving the Way for Economic Transformation.</h2>
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed">
            Join our mission to modernize, commercialize, and industrialize Nepal's agriculture for a sustainable future.
          </p>
          <Link href="/contact" className="px-12 py-5 bg-white text-slate-900 rounded-full font-bold hover:bg-sky-500 hover:text-white transition-all relative z-10">
            Get in Touch
          </Link>
        </AnimatedSection>
      </div>
    </main>
  );
}