import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useContent } from "../../context/ContentContext";

export function WhyDineSection() {
  const { siteData } = useContent();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem", "3rem"]);

  return (
    <section ref={containerRef} className="hidden md:block w-full bg-white relative z-10">
      <motion.div 
        style={{ 
          scale, 
          borderBottomLeftRadius: borderRadius, 
          borderBottomRightRadius: borderRadius 
        }}
        className="w-full px-4 md:px-6 pt-0 pb-24 md:pb-32 flex flex-col items-center bg-black origin-top shadow-2xl"
      >
        <div className="w-full max-w-[1400px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0a0a0a] rounded-[3rem] p-8 md:p-12 lg:p-20 border border-gray-800/60 shadow-2xl relative overflow-hidden flex flex-col items-center text-center group"
          >
            {/* Liquid Glass Border Overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-[3rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.192),inset_0_0_5px_rgba(255,255,255,0.274)] z-50 transition-all duration-500 group-hover:bg-white/5"></div>
          {/* Decorative subtle accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#E04D2D] to-transparent"></div>

          <h2 className="text-sm md:text-base font-semibold tracking-[0.3em] uppercase text-[#E04D2D] mb-6">
            {siteData?.promise?.promiseSubtitle || "OUR PROMISE"}
          </h2>
          
          <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-10 whitespace-pre-line">
            {siteData?.promise?.promiseTitle || "Why Dine at Spice Garden?"}
          </h3>

          <p className="text-gray-300 text-lg md:text-xl lg:text-2xl leading-relaxed max-w-5xl font-light whitespace-pre-line">
            {siteData?.promise?.promiseDescription || "Looking for the best family restaurant in Gokak? Spice Garden has been the go-to destination for lovers of authentic Indian and Chinese cuisine. Our chefs use only the freshest ingredients and traditional spice blends to create dishes that burst with flavour — from creamy butter chicken and smoky tandoori kebabs to sizzling Hakka noodles and crispy Manchurian. Whether it's a cozy family dinner, a birthday celebration, or a casual outing with friends, our warm ambiance and attentive service make every visit special. We take pride in using authentic masalas and time-honoured recipes passed down through generations, ensuring every dish delivers rich aroma and unmatched taste. With convenient online ordering, easy table booking, and fast home delivery across Gokak, enjoying a restaurant-quality meal has never been easier. Visit Spice Garden today and discover why thousands of happy diners keep coming back for more."}
          </p>

        </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
