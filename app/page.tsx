import React from "react";
import HeroCarousel from "./components/home/Hero";
import OurMission from "./components/home/WhatWeDo";
import Products from "./components/home/Products";
import CorePillars from "./components/home/CorePillars";
import EcoBalance from "./components/home/EcoBalance";
import WhyChooseUs from "./components/home/WhyChooseUs";
import ImpactVision from "./components/home/ImpactVision";
import NewsMedia from "./components/home/NewsMedia";
import OneStopShop from "./components/home/OneStopShop";
import Partners from "./components/home/Partheres";
import connectToDatabase from "../lib/mongodb";
import Product from "../models/Product";
import StrategicRoadmap from "./components/home/StrategicRoadmap";

export const metadata = {
  title: "Home",
};

export default async function HomePage() {
  let safeProducts: {
    _id: string;
    name: string;
    shortDescription?: string;
    images?: string[];
    price?: number;
    brand?: string | null;
    category?: string | null;
  }[] = [];

  try {
    await connectToDatabase();
    const prods = await Product.find({ isActive: true }).sort({ createdAt: -1 }).limit(8).lean();
    safeProducts = (prods || []).map((p: any) => ({
      _id: String(p._id),
      name: p.name,
      shortDescription: p.shortDescription || p.description || '',
      images: Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []),
      price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
      brand: p.brand || null,
      category: p.category || null,
    }));
  } catch (err) {
    // DB not available — Products component will fall back to demo data
    safeProducts = [];
  }

  return (
    <main>
      <HeroCarousel />

      {/* keep the rest of the home content (if any) below the hero */}
      <OurMission />
      <Products products={safeProducts} />
      {/* <ImpactVision /> */}
      <CorePillars />
      {/* <EcoBalance /> */}
      <WhyChooseUs />
      <NewsMedia />
    </main>
  );
}
