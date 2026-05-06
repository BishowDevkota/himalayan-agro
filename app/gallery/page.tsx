import React from "react";
import type { Metadata } from "next";
import fs from "fs/promises";
import path from "path";
import SubHeroSection from "../components/SubHeroSection";
import GalleryCarousel from "../components/GalleryCarousel";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Highlights from our farms, facilities, and community programs.",
};

async function getGalleryImages() {
  try {
    const galleryDir = path.join(process.cwd(), "public", "gallery");
    const files = await fs.readdir(galleryDir);
    
    // Filter for image files
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext);
    });

    // Map files to gallery items
    return imageFiles.map((file) => ({
      src: `/gallery/${file}`,
      title: file.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      caption: "Gallery image from our operations",
    }));
  } catch (error) {
    console.error("Error reading gallery images:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const galleryImages = await getGalleryImages();

  // Fallback images if none found in public/gallery
  const fallbackImages = [
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
  ];

  const displayImages = galleryImages.length > 0 ? galleryImages : fallbackImages;

  return (
    <main className="bg-white text-slate-900">
      <SubHeroSection
        title="Gallery"
        tag="Our Journey"
        description="A visual glimpse into our farms, facilities, and the people driving Nepal's agricultural transformation."
        image="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=2000"
        overlay="light"
      />

      {/* Carousel Section */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0891b2]">
              Featured Collection
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Gallery Highlights
            </h2>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600">
              Experience our journey through carefully curated moments from our farms, facilities, and community programs.
            </p>
          </div>

          <GalleryCarousel images={displayImages} autoplay={true} interval={6000} />
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-14 sm:py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0891b2]">
              Our Gallery
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Stories from the ground
            </h2>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600">
              From field preparation to community training, our gallery captures the momentum behind every harvest.
            </p>
          </div>

          {displayImages.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayImages.slice(0, 6).map((item, idx) => (
                <figure
                  key={idx}
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
          )}

          {displayImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600">No gallery images found</p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0891b2]/10 to-emerald-500/10 p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Explore Our Work
            </h2>
            <p className="text-slate-700 leading-relaxed mb-6">
              Our gallery showcases the diverse operations and community impact across Nepal's agricultural landscape. From innovative farming techniques to sustainable practices, each image tells a story of our commitment to agricultural transformation and rural development.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#0891b2]">{displayImages.length}</p>
                <p className="text-sm text-slate-700 mt-2">Images in Collection</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600">50+</p>
                <p className="text-sm text-slate-700 mt-2">Locations Covered</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-600">100%</p>
                <p className="text-sm text-slate-700 mt-2">Community Impact</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
