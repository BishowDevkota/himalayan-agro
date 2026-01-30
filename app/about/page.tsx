import Link from "next/link";
import SubHeroSection from "../components/SubHeroSection";
import { Section as AnimatedSection, Div as AnimatedDiv, Dl as AnimatedDl } from "../components/AnimatedClient";
import WhatWeDo from "../components/home/WhatWeDo";

export const metadata = {
  title: "About — Himalayan",
  description:
    "We build climate-resilient agri-tech and sustainable supply chains — connecting mountain growers to global markets.",
};

export default function AboutPage() {
  return (
    <main className="bg-white text-gray-900">
      <SubHeroSection
        title={"About Himalayan"}
        description={
          "We combine deep agronomy, responsible tech, and local partnerships to grow resilient, high‑quality produce — with people and planet in mind."
        }
        image={"https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=2000"}
      />

      <div className="max-w-7xl mx-auto px-6 mt-12 lg:mt-20 mb-24">
        <AnimatedSection
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-4xl font-extrabold mb-4">Our mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              We empower smallholder farmers in high‑altitude regions with technology, training and market access so their harvests
              become sustainable livelihoods — not just crops. We design systems that raise yield, restore soils and reduce waste.
            </p>

            <ul className="grid sm:grid-cols-2 gap-4 text-gray-700 mb-8">
              <li className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-[#64cc98]/10 border border-[#64cc98]/20 flex items-center justify-center text-[#64cc98] font-black">1</div>
                <div>
                  <strong className="block">Farmer‑first</strong>
                  <span className="text-sm text-gray-500">Locally led programs and fair pricing.</span>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-[#29A8DD]/10 border border-[#29A8DD]/20 flex items-center justify-center text-[#29A8DD] font-black">2</div>
                <div>
                  <strong className="block">Regenerative</strong>
                  <span className="text-sm text-gray-500">Soil health and water‑smart practices at scale.</span>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 font-black">3</div>
                <div>
                  <strong className="block">Transparent</strong>
                  <span className="text-sm text-gray-500">Traceability from field to doorstep.</span>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-600 font-black">4</div>
                <div>
                  <strong className="block">Climate conscious</strong>
                  <span className="text-sm text-gray-500">Low‑carbon operations and renewable energy.</span>
                </div>
              </li>
            </ul>

            <div className="flex gap-4">
              <Link href="/contact" className="inline-flex items-center gap-3 px-6 py-3 bg-sky-600 text-white rounded-md font-semibold hover:bg-sky-700">Contact our team</Link>
              <a href="/products" className="inline-flex items-center px-6 py-3 border rounded-md text-gray-700 hover:bg-gray-50">See products</a>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100">
            <img
              src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=1600"
              alt="Farmers in the field"
              className="w-full h-96 object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </AnimatedSection>

        {/* What we do (reused component) */}
        <AnimatedDiv
          className="mt-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.7, delay: 0.05 }}
        >
          <WhatWeDo />
        </AnimatedDiv>

        {/* Impact numbers + history + sourcing (expanded) */}
        <AnimatedSection
          aria-labelledby="impact-heading"
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.65 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="block font-bold tracking-[3px] text-sm mb-2 text-[#2da8da] uppercase">Impact</span>
              <h2 id="impact-heading" className="text-4xl font-black">What we've delivered so far</h2>
              <p className="text-gray-600 mt-3 max-w-xl">Measured outcomes from our field programs, technology pilots and trade partnerships.</p>
            </div>
            <div className="text-sm text-gray-500">Updated January 2026</div>
          </div>

          <AnimatedDl className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.6 }}>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
              <dt className="text-xs uppercase text-gray-400 tracking-wide">Farmers supported</dt>
              <dd className="text-3xl font-black text-[#64cc98]">4,200+</dd>
              <p className="text-sm text-gray-500 mt-2">Smallholders enrolled in training & contracts</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
              <dt className="text-xs uppercase text-gray-400 tracking-wide">Hectares restored</dt>
              <dd className="text-3xl font-black text-sky-600">7,800+</dd>
              <p className="text-sm text-gray-500 mt-2">Regenerative practices scaled across regions</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
              <dt className="text-xs uppercase text-gray-400 tracking-wide">CO₂ avoided</dt>
              <dd className="text-3xl font-black text-amber-600">12k t</dd>
              <p className="text-sm text-gray-500 mt-2">Estimated annual emissions avoided</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm">
              <dt className="text-xs uppercase text-gray-400 tracking-wide">Direct market access</dt>
              <dd className="text-3xl font-black text-violet-600">120+</dd>
              <p className="text-sm text-gray-500 mt-2">Restaurants & retailers connected</p>
            </div>
          </AnimatedDl>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h3 className="text-2xl font-extrabold mb-4">Our story — a concise timeline</h3>
              <ol className="relative border-l border-gray-100 ml-4 pl-6 space-y-8 text-gray-700">
                <li>
                  <div className="absolute -left-3 w-6 h-6 rounded-full bg-[#64cc98] border-2 border-white shadow-sm" />
                  <p className="text-sm uppercase text-gray-400 font-semibold">2017 — Seed</p>
                  <p className="mt-2">Started as a farmer co‑op in the foothills; first pilots for post‑harvest handling and direct trade.</p>
                </li>
                <li>
                  <div className="absolute -left-3 w-6 h-6 rounded-full bg-[#29A8DD] border-2 border-white shadow-sm" />
                  <p className="text-sm uppercase text-gray-400 font-semibold">2019 — Scale</p>
                  <p className="mt-2">Expanded training programs and introduced soil health monitoring across 300+ farms.</p>
                </li>
                <li>
                  <div className="absolute -left-3 w-6 h-6 rounded-full bg-amber-300 border-2 border-white shadow-sm" />
                  <p className="text-sm uppercase text-gray-400 font-semibold">2022 — Technology</p>
                  <p className="mt-2">Launched remote-sensing and supply chain traceability; first carbon‑smart pilot.</p>
                </li>
                <li>
                  <div className="absolute -left-3 w-6 h-6 rounded-full bg-violet-300 border-2 border-white shadow-sm" />
                  <p className="text-sm uppercase text-gray-400 font-semibold">2024 — Market integration</p>
                  <p className="mt-2">Secured long‑term partnerships with regional distributors and specialty chefs.</p>
                </li>
              </ol>

              <div className="mt-6 text-sm text-gray-600">
                <strong>Methodology:</strong> numbers above are aggregated from farmer reports, remote sensing and verified partner invoices. <Link href="/contact" className="text-sky-600 font-semibold ml-1">Contact us</Link> for detailed datasets or partnership inquiries.
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h4 className="font-bold mb-3">Sourcing & traceability</h4>
              <p className="text-sm text-gray-600 mb-4">Every shipment is traced back to cooperative lots via batch IDs and QR codes. We publish aggregated origin maps for buyers and run independent spot checks.</p>
              <Link href="/products" className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 border rounded-md text-sm">Explore sourcing</Link>

              <div className="mt-8">
                <h5 className="text-xs uppercase text-gray-400 tracking-widest mb-3">Certifications & partners</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 bg-gray-50 border rounded-md p-3 text-sm">
                    <div className="w-9 h-9 bg-white border rounded-md flex items-center justify-center text-xs font-bold">G</div>
                    <div>
                      <div className="font-semibold">GlobalG.A.P.</div>
                      <div className="text-xs text-gray-500">Selected lots</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 border rounded-md p-3 text-sm">
                    <div className="w-9 h-9 bg-white border rounded-md flex items-center justify-center text-xs font-bold">S</div>
                    <div>
                      <div className="font-semibold">Sustainability Lab</div>
                      <div className="text-xs text-gray-500">Independent audits</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 border rounded-md p-3 text-sm">
                    <div className="w-9 h-9 bg-white border rounded-md flex items-center justify-center text-xs font-bold">B</div>
                    <div>
                      <div className="font-semibold">B2B Partners</div>
                      <div className="text-xs text-gray-500">Regional distributors</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 border rounded-md p-3 text-sm">
                    <div className="w-9 h-9 bg-white border rounded-md flex items-center justify-center text-xs font-bold">C</div>
                    <div>
                      <div className="font-semibold">Climate Registry</div>
                      <div className="text-xs text-gray-500">Verification pipeline</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meet the farmers */}
          <AnimatedDiv className="mt-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.6 }}>
            <h3 className="text-2xl font-extrabold mb-6">Meet a few farmers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Dolma', village: 'Mera', quote: 'New drying sheds cut our spoilage in half — income is steady now.', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800' },
                { name: 'Kiran', village: 'Langtang', quote: 'Soil tests helped me choose better crop rotations.', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800' },
                { name: 'Sita', village: 'Ghorapani', quote: 'We now sell directly to two cafés — much better prices.', img: 'https://images.unsplash.com/photo-1545996124-f2b0a0a8a9f6?auto=format&fit=crop&q=80&w=800' },
              ].map((f) => (
                <figure key={f.name} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <img src={f.img} alt={f.name} className="w-20 h-20 rounded-full object-cover mb-4" />
                  <blockquote className="text-gray-700 italic">“{f.quote}”</blockquote>
                  <figcaption className="mt-3 text-sm text-gray-500">{f.name} — <span className="font-medium">{f.village}</span></figcaption>
                </figure>
              ))}
            </div>
          </AnimatedDiv>

          {/* FAQ (accessible) */}
          <AnimatedDiv className="mt-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.6 }}>
            <h3 className="text-2xl font-extrabold mb-6">Frequently asked questions</h3>

            <div className="space-y-4">
              <details className="bg-white border border-gray-100 rounded-2xl p-5" aria-expanded="false">
                <summary className="cursor-pointer font-semibold">How do you assure fair pricing?</summary>
                <div className="mt-3 text-sm text-gray-600">We negotiate multi-year offtake agreements, publish reference prices and run participatory audits with cooperative committees.</div>
              </details>

              <details className="bg-white border border-gray-100 rounded-2xl p-5" aria-expanded="false">
                <summary className="cursor-pointer font-semibold">Can I get traceability data for an order?</summary>
                <div className="mt-3 text-sm text-gray-600">Yes — buyers receive batch-level origin metadata and aggregated sustainability metrics on request. Use the contact form to request reports.</div>
              </details>

              <details className="bg-white border border-gray-100 rounded-2xl p-5" aria-expanded="false">
                <summary className="cursor-pointer font-semibold">Do you offer farmer training?</summary>
                <div className="mt-3 text-sm text-gray-600">We run season-long agronomy cohorts covering soil health, post-harvest handling and business skills. Field coaches provide hands-on mentoring.</div>
              </details>
            </div>
          </AnimatedDiv>
        </AnimatedSection>

        {/* Team */}
        <AnimatedSection className="mt-24" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.65 }}>
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="block font-bold tracking-[3px] text-sm mb-2 text-[#2da8da] uppercase">People</span>
              <h2 className="text-4xl font-black">Leadership & field teams</h2>
              <p className="text-gray-600 mt-3 max-w-xl">Small, cross‑disciplinary teams operating regionally — blending agronomy, logistics and data science.</p>
            </div>
            <div />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Anita Thapa', role: 'Co‑founder & Head of Field', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800' },
              { name: 'Rajan Gurung', role: 'Head of Supply Chain', img: 'https://images.unsplash.com/photo-1545996124-f2b0a0a8a9f6?auto=format&fit=crop&q=80&w=800' },
              { name: 'Maya Shrestha', role: 'Lead Agronomist', img: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&q=80&w=800' },
              { name: 'Evan Cole', role: 'Product & Partnerships', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800' },
            ].map((p) => (
              <div key={p.name} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 text-center">
                <img src={p.img} alt={p.name} className="mx-auto w-28 h-28 rounded-full object-cover mb-4" />
                <div className="text-lg font-bold">{p.name}</div>
                <div className="text-sm text-gray-500">{p.role}</div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Closing CTA */}
        <AnimatedSection className="mt-24 bg-gradient-to-r from-[#f8fffb] to-white border border-gray-100 rounded-3xl p-12 flex flex-col md:flex-row items-center justify-between gap-6" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.65 }}>
          <div>
            <h3 className="text-2xl font-black mb-2">Want to partner with us?</h3>
            <p className="text-gray-600">We work with retailers, chefs and NGOs to scale impact — let's explore a pilot.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/contact" className="px-6 py-3 bg-[#64cc98] font-black rounded-md text-black hover:brightness-95">Get in touch</Link>
            <a href="/scripts/seed.js" className="px-6 py-3 border rounded-md text-gray-700 hover:bg-gray-50">Learn more</a>
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
}
