'use client';
import { useRef } from 'react';

const productList = [
  { title: "Aero-Scan AI", desc: "Advanced drone imaging for precision nitrogen mapping across large scale industrial farms.", img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800" },
  { title: "Terra-Compute", desc: "Predictive analytics dashboard for seasonal yields and soil health monitoring through cloud-based AI.", img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800" },
  { title: "Hydra-Node", desc: "Satellite-linked sensors for underground moisture levels and real-time irrigation automation.", img: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=800" },
  { title: "Ox-Bot 2.0", desc: "Autonomous electric platform designed for heavy field tasks and zero-emission operations.", img: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=800" },
  { title: "Venti-System", desc: "Automated climate control for greenhouse clusters using intelligent airflow and humidity logic.", img: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800" },
  { title: "Bio-Logic", desc: "Nutrient delivery systems with micron-precision to maximize plant growth and minimize waste.", img: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&q=80&w=800" },
  { title: "Grain-Master", desc: "Sensor-enabled silos for moisture-controlled storage and post-harvest loss prevention.", img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800" },
  { title: "Solar-Grid", desc: "Custom energy tracking arrays for farm infrastructure and sustainable power management.", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800" },
];

export default function Products() {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: number) => {
    const el = carouselRef.current;
    if (!el) return;

    const card = el.querySelector('.product-card') as HTMLElement | null;
    const cardBase = card?.offsetWidth ?? Math.round(el.clientWidth * 0.9);
    const scrollAmount = Math.round((cardBase + 24) * 2);

    el.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-20 px-[5%] bg-[#f4f7f6] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-end mb-10 pb-6 border-b border-gray-200">
          <div>
            <span className="block font-bold tracking-[3px] text-[10px] mb-2 text-[#f29629] uppercase">
              Engineering Suite
            </span>
            <h2 className="text-3xl font-black uppercase text-[#0a0a0a]">
              Our Products
            </h2>
          </div>
          
          <div className="flex gap-2">
            <button onClick={() => scroll(-1)} className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">&#8592;</button>
            <button onClick={() => scroll(1)} className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">&#8594;</button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {productList.map((product, index) => (
            <div 
              key={index}
              className="product-card flex-none w-[75vw] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] snap-start bg-white border border-gray-100 group transition-all duration-400 hover:border-[#f29629] hover:shadow-lg"
            >
              <div 
                className="h-[220px] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"
                style={{ backgroundImage: `url(${product.img})` }}
              />
              <div className="p-6 flex flex-col justify-between h-[180px]">
                <div>
                  <h3 className="text-base font-black uppercase mb-2 text-[#0a0a0a] truncate">
                    {product.title}
                  </h3>
                  {/* The magic utility: line-clamp-2 */}
                  <p className="text-gray-500 text-xs leading-relaxed overflow-hidden display-webkit-box webkit-line-clamp-2 webkit-box-orient-vertical line-clamp-2">
                    {product.desc}
                  </p>
                </div>
                <a 
                  href="#" 
                  className="w-full py-3 border border-gray-100 text-center uppercase font-bold text-[10px] tracking-widest text-black transition-all group-hover:bg-[#f29629] group-hover:text-white group-hover:border-[#f29629]"
                >
                  Specs
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}