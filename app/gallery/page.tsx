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

    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext);
    });

    // Sort to put firstimage.jpeg first
    imageFiles.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      if (aLower.includes("firstimage")) return -1;
      if (bLower.includes("firstimage")) return 1;
      return 0;
    });

    return imageFiles.map((file) => ({ src: `/gallery/${file}` }));
  } catch (error) {
    console.error("Error reading gallery images:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const galleryImages = await getGalleryImages();

  // Fallback images if none found in public/gallery
  const fallbackImages = [
    { src: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=1400" },
    { src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1400" },
    { src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1400" },
    { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1400" },
  ];

  const displayImages = galleryImages.length > 0 ? galleryImages : fallbackImages;

  return (
    <main className="bg-white text-slate-900">
      <SubHeroSection
        title="Gallery"
        tag="Our Journey"
        description="A clean visual gallery from our farms, facilities, and field operations."
        image="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=2000"
        overlay="light"
      />

      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#0891b2]">
              Photo Carousel
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Swipe, scroll, and explore
            </h2>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600">
              Two photos are displayed side by side on larger screens. Click any photo to expand in a fullscreen lightbox. Swipe or use arrow buttons to navigate through our gallery.
            </p>
          </div>

          <GalleryCarousel images={displayImages} interval={5000} />
        </div>
      </section>
    </main>
  );
}
