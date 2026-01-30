'use client';
import { useRef } from 'react';

type ProductCard = {
  _id: string;
  name: string;
  shortDescription?: string;
  images?: string[];
  price?: number;
  brand?: string | null;
  category?: string | null;
};

const demoList: ProductCard[] = [
  { _id: 'demo-1', name: 'Aero-Scan AI', shortDescription: 'Advanced drone imaging for precision nitrogen mapping across large scale industrial farms.', images: ['https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800'] },
  { _id: 'demo-2', name: 'Terra-Compute', shortDescription: 'Predictive analytics dashboard for seasonal yields and soil health monitoring through cloud-based AI.', images: ['https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&q=80&w=800'] },
  { _id: 'demo-3', name: 'Hydra-Node', shortDescription: 'Satellite-linked sensors for underground moisture levels and real-time irrigation automation.', images: ['https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=800'] },
];

export default function Products({ products }: { products?: ProductCard[] }) {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const list = (products && products.length) ? products : demoList;

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
            <span className="block font-bold tracking-[3px] text-[10px] mb-2 text-[#f29629] uppercase">Our catalog</span>
            <h2 className="text-3xl font-black uppercase text-[#0a0a0a]">Featured products</h2>
            <p className="mt-2 text-sm text-slate-600">Handpicked from our catalog — updated in real time.</p>
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
          {list.map((product, index) => (
            <div key={product._id} className="product-card flex-none w-[75vw] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] snap-start bg-white border border-gray-100 group transition-all duration-400 hover:border-[#f29629] hover:shadow-lg">
              <div className="h-[220px] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" style={{ backgroundImage: `url(${(product.images && product.images[0]) || '/placeholder.png'})` }} />
              <div className="p-6 flex flex-col justify-between h-[180px]">
                <div>
                  <h3 className="text-base font-black uppercase mb-2 text-[#0a0a0a] truncate">{product.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed overflow-hidden display-webkit-box webkit-line-clamp-2 webkit-box-orient-vertical line-clamp-2">{product.shortDescription}</p>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <div className="text-sm font-extrabold text-slate-900">{typeof product.price === 'number' ? `₹${product.price.toFixed(2)}` : ''}</div>
                  <a href={`/product/${product._id}`} className="ml-auto w-28 py-2 border border-gray-100 text-center uppercase font-bold text-[10px] tracking-widest text-black transition-all group-hover:bg-[#f29629] group-hover:text-white group-hover:border-[#f29629]">View</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}