import React from "react";
import HeroCarousel from "./components/home/Hero";
import WhatWeDo from "./components/home/WhatWeDo";
import Products from "./components/home/Products";
import EcoBalance from "./components/home/EcoBalance";
import OneStopShop from "./components/home/OneStopShop";
import Partners from "./components/home/Partheres";

export const metadata = {
  title: "Home",
};

export default function HomePage() {
  return (
    <main>
      <HeroCarousel />

      {/* keep the rest of the home content (if any) below the hero */}
      <WhatWeDo />
<Products />
<EcoBalance />
<OneStopShop/>
<Partners />
    </main>
  );
}
