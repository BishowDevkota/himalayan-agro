import Link from "next/link";
import SubHeroSection from "../components/SubHeroSection";
import { Section as AnimatedSection } from "../components/AnimatedClient";

export const metadata = {
  title: "Investor Relations — Himalaya Nepal Agriculture",
  description:
    "Explore investment opportunities, financial performance, and shareholder information for Himalaya Nepal Agriculture.",
};

const highlights = [
  { metric: "24.09%", label: "GDP Contribution", description: "Agriculture's share of Nepal's national GDP" },
  { metric: "156K", label: "Hectares Monitored", description: "Precision-managed farmland under our network" },
  { metric: "340+", label: "Partner Farms", description: "Across 12 countries and growing" },
  { metric: "45%", label: "Water Savings", description: "Compared to traditional farming methods" },
];

const financials = [
  { year: "FY 2025", revenue: "NPR 1.2B", growth: "+34%", ebitda: "NPR 180M" },
  { year: "FY 2024", revenue: "NPR 890M", growth: "+28%", ebitda: "NPR 125M" },
  { year: "FY 2023", revenue: "NPR 695M", growth: "+22%", ebitda: "NPR 92M" },
];

const whyInvest = [
  {
    title: "Massive Market Opportunity",
    description:
      "Nepal's agricultural sector supports 57.3% of the population but remains largely untapped for industrial-scale operations.",
    icon: "📈",
  },
  {
    title: "Government-Backed Strategy",
    description:
      "Aligned with the Agriculture Development Strategy (2015–2035) and constitutional mandates for land reform.",
    icon: "🏛️",
  },
  {
    title: "Technology-First Approach",
    description:
      "IoT sensors, AI-driven yield optimization, and digital logistics create defensible competitive advantages.",
    icon: "🤖",
  },
  {
    title: "Export-Ready Infrastructure",
    description:
      "Cold-chain logistics, quality testing labs, and global shipping partnerships enable premium export pricing.",
    icon: "🌍",
  },
];

export default function InvestorPage() {
  return (
    <main className="bg-white text-slate-900 selection:bg-sky-100">
      <SubHeroSection
        title="Investor Relations"
        description="Transparent growth. Strategic vision. Join us in transforming Nepal's agricultural future."
        image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000"
      />

      <div className="max-w-7xl mx-auto px-6 mb-32">
        {/* Key Metrics */}
        <AnimatedSection className="mt-24">
          <span className="text-sky-600 font-bold tracking-widest text-xs uppercase mb-4 block">
            At a Glance
          </span>
          <h2 className="text-4xl font-black leading-tight mb-12">
            Investment Highlights
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, i) => (
              <div
                key={i}
                className="p-8 border border-slate-100 rounded-3xl hover:shadow-lg transition-shadow duration-300"
              >
                <p className="text-4xl font-black text-[#0891b2] mb-2">
                  {item.metric}
                </p>
                <p className="text-sm font-bold uppercase tracking-tight text-slate-800 mb-1">
                  {item.label}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Why Invest */}
        <AnimatedSection className="mt-32">
          <h2 className="text-3xl font-black mb-12 text-center">
            Why Invest With Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {whyInvest.map((item, i) => (
              <div
                key={i}
                className="flex gap-5 p-8 bg-slate-50/50 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-colors duration-300"
              >
                <span className="text-3xl shrink-0">{item.icon}</span>
                <div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Financial Performance */}
        <AnimatedSection className="mt-32">
          <span className="text-sky-600 font-bold tracking-widest text-xs uppercase mb-4 block">
            Financial Performance
          </span>
          <h2 className="text-3xl font-black mb-10">Revenue & Growth</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4">YoY Growth</th>
                  <th className="px-6 py-4">EBITDA</th>
                </tr>
              </thead>
              <tbody>
                {financials.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-slate-100 hover:bg-sky-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-sm">{row.year}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {row.revenue}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                      {row.growth}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {row.ebitda}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedSection>

        {/* Ownership Structure */}
        <AnimatedSection className="mt-32 p-12 lg:p-20 border border-slate-100 rounded-[60px] text-center">
          <h2 className="text-3xl font-black mb-4">Ownership Structure</h2>
          <p className="text-slate-500 mb-12 max-w-xl mx-auto">
            A transparent governance model that balances founder vision with
            public accountability.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-16">
            <div className="w-48 h-48 rounded-full border-12 border-slate-900 flex items-center justify-center relative">
              <span className="text-2xl font-black">80%</span>
              <span className="absolute -bottom-8 text-xs font-bold text-slate-400 uppercase">
                Founders
              </span>
            </div>
            <div className="w-48 h-48 rounded-full border-12 border-sky-400 flex items-center justify-center relative">
              <span className="text-2xl font-black">20%</span>
              <span className="absolute -bottom-8 text-xs font-bold text-slate-400 uppercase">
                Public
              </span>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="mt-32 text-center py-24 bg-slate-900 rounded-[60px] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/20 blur-[100px] rounded-full -mr-32 -mt-32" />
          <h2 className="text-4xl sm:text-5xl font-black mb-8 relative z-10">
            Ready to Grow With Us?
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed">
            Connect with our investor relations team to learn more about
            partnership opportunities and upcoming funding rounds.
          </p>
          <Link
            href="/contact"
            className="px-12 py-5 bg-white text-slate-900 rounded-full font-bold hover:bg-sky-500 hover:text-white transition-all relative z-10"
          >
            Contact Investor Relations
          </Link>
        </AnimatedSection>
      </div>
    </main>
  );
}
