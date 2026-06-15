import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GlassFilter } from "../../components/ui/GlassFilter";
import { useContent } from "../../context/ContentContext";

export function AboutSection() {
  const { siteData, loading } = useContent();

  if (loading || !siteData) return null;

  return (
    <section id="about" className="w-full px-4 md:px-6 pt-12 md:pt-24 pb-4 md:pb-8 flex flex-col items-center scroll-mt-24">
      
      <div className="w-full max-w-[1600px] mx-auto flex flex-col">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm md:text-base font-semibold tracking-[0.3em] uppercase text-gray-500 mb-8 md:mb-12 ml-4"
        >
          ABOUT THE RESTAURANT
        </motion.h2>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full">
          
          {/* Top Left: Orange Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-1 bg-[#E04D2D] rounded-[1.5rem] md:rounded-[2rem] p-4 sm:p-6 md:p-8 flex flex-col justify-between relative overflow-hidden text-white min-h-[150px] sm:min-h-[220px] md:min-h-[240px] lg:h-[400px] xl:h-[450px]"
          >
            <div className="flex justify-between items-start">
              <span className="px-2 sm:px-4 py-1 sm:py-1.5 border border-white/40 rounded-full text-[8px] sm:text-[10px] md:text-xs font-semibold tracking-wider uppercase truncate max-w-[80%]">
                {siteData.about.aboutBadge}
              </span>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center text-black shrink-0 hidden sm:flex">
                <ArrowUpRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
            </div>

            <div className="mt-2 sm:mt-10 md:mt-auto flex flex-col items-start w-full">
              <h3 className="font-serif text-[1.25rem] leading-[1.05] sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 sm:mb-6 uppercase break-words w-full whitespace-pre-line">
                {siteData.about.aboutTitle.replace(/\\n/g, '\n')}
              </h3>
              <a href={siteData.about.aboutButtonLink} className="btn-12 !text-[10px] sm:!text-sm !px-3 sm:!px-12 !py-2 sm:!py-3 shadow-lg mt-1 sm:mt-4 whitespace-nowrap self-start">
                <span>{siteData.about.aboutButtonText}</span>
              </a>
            </div>
          </motion.div>

          {/* Top Right: Image Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="col-span-1 relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden min-h-[150px] sm:min-h-[220px] md:min-h-[240px] lg:h-[400px] xl:h-[450px] bg-zinc-900 group"
          >
            <img 
              src={siteData.about.aboutImage?.startsWith('http') ? siteData.about.aboutImage : (siteData.about.aboutImage?.startsWith('/') && !siteData.about.aboutImage?.startsWith('/uploads') ? siteData.about.aboutImage : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${siteData.about.aboutImage}`)} 
              alt="Restaurant Cuisine" 
              className="w-full h-full object-cover"
            />
            {/* Liquid Glass Border Overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.192),inset_0_0_5px_rgba(255,255,255,0.274)] z-50 transition-all duration-500 group-hover:bg-white/5"></div>
          </motion.div>

          {/* Bottom Card (Spans both columns) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="col-span-2 bg-[#141414] rounded-[1.5rem] md:rounded-[2rem] p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-16 items-start lg:items-center text-white"
          >
            <div className="flex-1">
              <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl italic tracking-tight mb-6 lg:mb-0">
                Where Every Meal Is a Celebration
              </h3>
            </div>
            
            <div className="flex-1 flex flex-col items-start">
              <p className="text-gray-400 font-medium leading-relaxed mb-4 text-base md:text-lg">
                {siteData.about.aboutRightDesc1}
              </p>
              <p className="text-gray-400 font-medium leading-relaxed mb-8 text-base md:text-lg">
                {siteData.about.aboutRightDesc2}
              </p>
              <a href="/about" className="relative isolate inline-flex items-center justify-center bg-transparent text-white px-8 py-4 rounded-full text-sm font-semibold tracking-wider uppercase hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 left-0 z-0 h-full w-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)] transition-all" />
                <div className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-full" style={{ backdropFilter: 'url("#container-glass")' }} />
                <div className="pointer-events-none relative z-10 flex items-center gap-2">
                  Read Our Story <ArrowUpRight className="w-4 h-4" />
                </div>
                <GlassFilter />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
