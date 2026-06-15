import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "../../context/ContentContext";

interface DishProps {
  image: string;
  title: string;
  desc: string;
  tall?: boolean;
}

function DishCard({ image, title, desc, tall }: DishProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-2xl md:rounded-[2rem] group cursor-pointer w-full shadow-lg md:shadow-2xl ${tall ? 'h-[200px] sm:h-[240px] lg:h-[420px]' : 'h-[160px] sm:h-[180px] lg:h-[300px]'}`}
    >
      <img 
        src={image?.startsWith('http') ? image : (image?.startsWith('/') && !image?.startsWith('/uploads') ? image : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${image || ''}?v=2`)}
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      
      {/* Liquid Glass Border Overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.192),inset_0_0_5px_rgba(255,255,255,0.274)] z-50 transition-all duration-500 group-hover:bg-white/5"></div>

      {/* Top Right Pill */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-white text-[#E04D2D] text-[10px] sm:text-xs md:text-sm font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-1 md:gap-2 shadow-xl z-10 transition-transform duration-300 group-hover:scale-105">
        {title} 
        <span className="text-black bg-gray-100 rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center ml-0.5 md:ml-1">
          <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
        </span>
      </div>

      {/* Bottom Hover Description */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-32 pb-8 px-8 md:pb-10 md:px-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
        <p className="text-white text-base md:text-lg font-medium leading-relaxed shadow-sm">{desc}</p>
      </div>
    </motion.div>
  );
}

export function PopularDishes() {
  const { siteData, chefData, loading } = useContent();

  if (loading || chefData.length === 0) return null;

  return (
    <section className="w-full px-3 md:px-6 pt-8 md:pt-24 pb-6 md:pb-12 flex flex-col items-center bg-background">
      <div className="w-full max-w-[1600px] mx-auto flex flex-col">
        
        <div className="mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm md:text-base font-semibold tracking-[0.3em] uppercase text-gray-500 mb-4 ml-2 md:ml-4"
          >
            {siteData?.popular?.subtitle || "CHEF'S SPECIAL"}
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground uppercase ml-2 md:ml-4"
          >
            {siteData?.popular?.title || "POPULAR DISHES"}
          </motion.h3>
        </div>

        {/* Mobile Layout (2x2 grid) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full md:hidden">
          {chefData.slice(0, 4).map((item: any, i: number) => (
            <div key={i} className="col-span-1">
              <DishCard image={item.image} title={item.title} desc={item.hoverText} />
            </div>
          ))}
        </div>

        {/* Desktop Layout (Masonry) */}
        <div className="hidden md:grid grid-cols-2 gap-6 w-full">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            {chefData[0] && <DishCard image={chefData[0].image} title={chefData[0].title} desc={chefData[0].hoverText} tall />}
            {chefData[1] && <DishCard image={chefData[1].image} title={chefData[1].title} desc={chefData[1].hoverText} />}
          </div>
          
          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {chefData[2] && <DishCard image={chefData[2].image} title={chefData[2].title} desc={chefData[2].hoverText} />}
            {chefData[3] && <DishCard image={chefData[3].image} title={chefData[3].title} desc={chefData[3].hoverText} tall />}
          </div>
        </div>

      </div>
    </section>
  );
}
