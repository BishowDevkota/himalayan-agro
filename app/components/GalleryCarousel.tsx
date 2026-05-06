"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryImage {
  src: string;
  title: string;
  caption: string;
}

interface GalleryCarouselProps {
  images: GalleryImage[];
  autoplay?: boolean;
  interval?: number;
}

export default function GalleryCarousel({
  images,
  autoplay = true,
  interval = 5000,
}: GalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(autoplay);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoplay || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoplay, images.length, interval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoplay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoplay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoplay(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full bg-slate-100 rounded-2xl p-12 text-center">
        <p className="text-slate-600">No images available</p>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="w-full space-y-4">
      {/* Main Carousel */}
      <div className="relative w-full bg-slate-900 rounded-2xl overflow-hidden group">
        <div className="relative w-full pt-[66.67%]">
          <Image
            src={currentImage.src}
            alt={currentImage.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={currentIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

          {/* Title and Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
            <h3 className="text-2xl sm:text-3xl font-bold">{currentImage.title}</h3>
            <p className="text-sm sm:text-base text-slate-200 mt-2 max-w-2xl">
              {currentImage.caption}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={goToPrevious}
              className="p-2 sm:p-3 rounded-full bg-white/80 hover:bg-white text-slate-900 transition-all transform hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={goToNext}
              className="p-2 sm:p-3 rounded-full bg-white/80 hover:bg-white text-slate-900 transition-all transform hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Image Counter */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-slate-900/60 text-white text-xs sm:text-sm font-semibold backdrop-blur">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:gap-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all transform ${
              index === currentIndex
                ? 'ring-2 ring-[#0891b2] scale-105 shadow-lg'
                : 'ring-1 ring-slate-200 hover:ring-[#0891b2] hover:scale-105'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <Image
              src={image.src}
              alt={image.title}
              fill
              className="object-cover"
              sizes="80px"
            />
            {index === currentIndex && (
              <div className="absolute inset-0 bg-[#0891b2]/20" />
            )}
          </button>
        ))}
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-[#0891b2]'
                : 'w-2 bg-slate-300 hover:bg-[#0891b2]/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Autoplay Toggle */}
      {images.length > 1 && (
        <div className="text-center">
          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className="text-xs sm:text-sm text-slate-600 hover:text-[#0891b2] transition-colors"
          >
            {isAutoplay ? '⏸ Pause' : '▶ Play'} autoplay
          </button>
        </div>
      )}
    </div>
  );
}
