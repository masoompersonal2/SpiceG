import { motion } from "framer-motion";
import { VideoCard } from "./VideoCard";
import { useContent } from "../../context/ContentContext";

export function HeroSection() {
  const { siteData, loading } = useContent();

  if (loading || !siteData) {
    return <div className="min-h-screen bg-[#F6EEED] animate-pulse"></div>;
  }

  return (
    <section className="relative w-full px-3 md:px-6 pt-4 md:pt-8 pb-8 md:pb-24 flex flex-col items-center">
      
      {/* Main Typography */}
      <div className="text-center w-full max-w-6xl mx-auto flex flex-col items-center relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[3.5rem] sm:text-6xl md:text-[8.5rem] leading-none tracking-tight text-[#3b2314] uppercase"
        >
          {siteData.hero.heroTitle}
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-4 md:mt-6 px-4"
        >
          <span className="font-serif text-2xl md:text-5xl italic text-[#3b2314] tracking-tight leading-tight block">
            {siteData.hero.heroSubtitle.split(',').map((part: string, i: number) => (
              <span key={i}>
                {part}{i === 0 ? ',' : ''} <br className="hidden md:block" />
              </span>
            ))}
          </span>
          <span className="text-[#3b2314]/80 font-medium text-sm md:text-base leading-relaxed mt-6 block max-w-2xl mx-auto">
             {siteData.hero.heroDescription}
          </span>
        </motion.div>
      </div>

      {/* Floating Pointer Decoration (Simulated) */}
      <motion.div 
        initial={{ opacity: 0, x: -30, y: 30 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
        className="absolute right-[12%] top-[15%] hidden xl:block pointer-events-none z-20"
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4L20 10L14 14L10 20L4 4Z" fill="black" stroke="white" strokeWidth="1.5" />
        </svg>
      </motion.div>

      {/* Metadata Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="w-full max-w-7xl mx-auto mt-8 md:mt-10 mb-6 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-8 text-sm px-4 md:px-0"
      >
        {/* Location */}
        <div className="flex flex-col items-start text-left order-1 md:order-1">
          <div className="inline-flex flex-col items-start">
            <span className="text-[#3b2314]/70 font-medium mb-1">Location</span>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-wider uppercase text-base text-[#3b2314]">{siteData.hero.heroLocation}</span>
            </div>
            <a 
              href={siteData.hero.heroLocationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3b2314]/60 hover:text-[#3b2314] hover:underline transition-colors block mt-1 text-[10px] md:text-xs pr-2 max-w-[150px] md:max-w-[200px]"
            >
              {siteData.hero.heroAddress}
            </a>
          </div>
        </div>

        {/* Happy Diners */}
        <div className="flex flex-col items-start md:items-center text-left md:text-center order-3 md:order-2">
          <span className="text-[#3b2314]/70 font-medium mb-1">Happy Diners</span>
          <span className="font-bold tracking-wider uppercase text-base text-[#3b2314]">{siteData.hero.heroStatsHappyDiners}</span>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col items-end md:items-center text-right md:text-center order-4 md:order-3">
          <span className="text-[#3b2314]/70 font-medium mb-1">Menu Items</span>
          <span className="font-bold tracking-wider uppercase text-base text-[#3b2314]">{siteData.hero.heroStatsMenuItems}</span>
        </div>

        {/* Google Rating */}
        <div className="flex flex-col items-end md:items-end text-right order-2 md:order-4">
          <span className="text-[#3b2314]/70 font-medium mb-1">Google Rating</span>
          <span className="font-bold tracking-wider uppercase text-base text-[#3b2314]">4.5★</span>
        </div>
      </motion.div>

      {/* Media / Video Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="w-full max-w-[1600px] mx-auto relative z-10"
      >
        <VideoCard videoUrl={siteData.hero.heroVideo} />
      </motion.div>

    </section>
  );
}
