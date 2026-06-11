import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { useContent } from "../../context/ContentContext";

export function OrderCtaSection() {
  const { siteData } = useContent();

  return (
    <section className="w-full px-4 md:px-6 pt-8 md:pt-16 pb-12 md:pb-32 flex flex-col items-center bg-black">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm md:text-base font-semibold tracking-[0.3em] uppercase text-[#E04D2D] mb-6"
        >
          ORDER FROM HOME
        </motion.h2>
        
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 whitespace-pre-line"
        >
          {siteData?.call?.callTitle || "Craving Something Delicious?"}
        </motion.h3>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl leading-relaxed mb-12 max-w-2xl whitespace-pre-line"
        >
          {siteData?.call?.callDescription || "Browse our full menu, add your favorites to the cart, and get hot food delivered right to your doorstep. Pay with Cash on Delivery or UPI."}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-row justify-center gap-2 sm:gap-6 w-full sm:w-auto px-2 sm:px-0"
        >
          <a 
            href="/menu" 
            className="flex flex-1 sm:flex-initial justify-center gap-1 sm:gap-2 items-center shadow-[0_0_20px_rgba(224,77,45,0.4)] text-[10px] sm:text-sm md:text-lg font-semibold uppercase tracking-wider isolation-auto border-[#E04D2D] before:absolute before:w-full before:transition-all before:duration-700 hover:before:w-full before:-left-full hover:before:left-0 before:rounded-full before:bg-white text-white hover:text-[#E04D2D] transition-colors duration-500 before:-z-10 before:aspect-square hover:before:scale-150 relative z-10 px-2 py-3 sm:px-6 sm:py-3 md:px-10 md:py-4 overflow-hidden border-2 rounded-full group bg-[#E04D2D]"
          >
            Order Online
            <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 justify-end group-hover:rotate-90 text-white group-hover:text-[#E04D2D] ease-linear duration-300 rounded-full border border-white group-hover:border-[#E04D2D] p-0.5 sm:p-1 rotate-45" viewBox="0 0 16 19" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z" className="fill-white group-hover:fill-[#E04D2D] transition-colors duration-500" />
            </svg>
          </a>
          <a 
            href={`tel:${siteData?.call?.callPhone || "+1234567890"}`}
            className="relative overflow-hidden flex flex-1 sm:flex-initial items-center justify-center gap-1 md:gap-3 border border-white/20 hover:border-white/50 text-white px-2 py-3 sm:px-6 sm:py-3 md:px-10 md:py-4 rounded-full text-[10px] sm:text-sm md:text-base font-semibold tracking-wider uppercase transition-all shadow-[inset_0_0_20px_rgba(255,255,255,0.192),inset_0_0_5px_rgba(255,255,255,0.274)] bg-white/5 backdrop-blur-md hover:bg-white/10 group whitespace-nowrap"
          >
            <Phone className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#E04D2D] group-hover:scale-110 transition-transform" />
            Call to Order
          </a>
        </motion.div>

      </div>
    </section>
  );
}
