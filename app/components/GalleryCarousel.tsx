"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export interface GalleryImage {
  src: string;
}

interface GalleryCarouselProps {
  images: GalleryImage[];
  interval?: number;
}

export default function GalleryCarousel({ images, interval = 5000 }: GalleryCarouselProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);

  const galleryPhotos = images.map(img => img.src);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 2) % galleryPhotos.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => {
      const newIndex = prev - 2;
      return newIndex < 0 ? Math.max(0, galleryPhotos.length - 2) : newIndex;
    });
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const getVisibleIndices = () => {
    const indices = [];
    for (let i = 0; i < 2 && currentIndex + i < galleryPhotos.length; i++) {
      indices.push(currentIndex + i);
    }
    return indices;
  };

  if (galleryPhotos.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-12 text-center text-slate-600">
        No gallery images found.
      </div>
    );
  }

  return (
    <section ref={ref} className="py-0">
      <div className="relative max-w-6xl mx-auto">
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 md:p-4 bg-white/90 hover:bg-white rounded-full shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 group"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-slate-700 group-hover:text-[#0891b2] transition-colors" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-3 md:p-4 bg-white/90 hover:bg-white rounded-full shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 group"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-slate-700 group-hover:text-[#0891b2] transition-colors" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 px-8 sm:px-12 md:px-16">
          {getVisibleIndices().map((photoIndex, position) => (
            <motion.div
              key={photoIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: position * 0.1,
                duration: 0.5,
                type: "spring",
                stiffness: 100,
              }}
              className="relative group cursor-pointer"
              onClick={() => openLightbox(photoIndex)}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={`${photoIndex}-${currentIndex}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.4 },
                      scale: { duration: 0.4 },
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);
                      if (swipe < -swipeConfidenceThreshold) {
                        nextSlide();
                      } else if (swipe > swipeConfidenceThreshold) {
                        prevSlide();
                      }
                    }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={galleryPhotos[photoIndex]}
                      alt={`Gallery photo ${photoIndex + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={photoIndex === currentIndex}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute bottom-4 left-4 right-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-lg">Photo {photoIndex + 1}</span>
                    <span className="text-white/80 text-sm">Click to expand</span>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-3xl ring-4 ring-[#0891b2]/0 group-hover:ring-[#0891b2]/50 transition-all duration-500"></div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {galleryPhotos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const newIndex = Math.floor(index / 2) * 2;
                setDirection(newIndex > currentIndex ? 1 : -1);
                setCurrentIndex(newIndex);
              }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex || (index === currentIndex + 1)
                  ? 'w-8 h-3 bg-gradient-to-r from-[#0891b2] to-[#0b78be]'
                  : 'w-3 h-3 bg-slate-300 hover:bg-[#0891b2]/60'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-[201]"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryPhotos[selectedImage]}
                alt={`Gallery photo ${selectedImage + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium"
            >
              Photo {selectedImage + 1} of {galleryPhotos.length}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
