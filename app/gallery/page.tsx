import React from "react";
import type { Metadata } from "next";
import SubHeroSection from "../components/SubHeroSection";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Highlights from our farms, facilities, and community programs.",
};

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=1400",
    title: "Field Cultivation",
    caption: "Seasonal crop rotation and soil stewardship.",
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1400",
    title: "Irrigation Systems",
    caption: "Smart water management for resilient farms.",
  },
  {
    src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1400",
    title: "Harvest Days",
    caption: "Community-led harvests and field training.",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1400",
    title: "Agri-Tech Labs",
    caption: "Innovation hubs for sustainable production.",
  },
  {
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=1400",
    title: "Value Addition",
    caption: "Processing and packaging for global markets.",
  },
  {
    src: "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?auto=format&fit=crop&q=80&w=1400",
    title: "Community Training",
    caption: "Farmer workshops across the region.",
  },
  {
    src: "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&q=80&w=1400",
    title: "Greenhouses",
    caption: "Climate-smart infrastructure for high-value crops.",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1400",
    title: "Storage & Logistics",
    caption: "Cold chain and regional distribution hubs.",
  },
];

export default function GalleryPage() {
  return (
    <main className="bg-white text-slate-900">
      <SubHeroSection
        title="Gallery"
        tag="Our Journey"
        description="A visual glimpse into our farms, facilities, and the people driving Nepal's agricultural transformation."
        image="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=2000"
        overlay="light"
      />

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0891b2]">
              Field Highlights
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Stories from the ground
            </h2>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-500">
              From field preparation to community training, our gallery captures the momentum behind every harvest.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((item) => (
              <figure
                key={item.title}
                className="group relative overflow-hidden rounded-3xl bg-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="aspect-[4/3] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.src})` }}
                />
                <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate-900/75 via-slate-900/10 to-transparent p-5 text-white">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
