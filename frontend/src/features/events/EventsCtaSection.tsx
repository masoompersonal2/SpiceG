import { motion } from "framer-motion";
import { useContent } from "../../context/ContentContext";

export function EventsCtaSection() {
  const { siteData } = useContent();

  return (
    <section className="w-full px-4 md:px-6 pb-8 md:pb-32 pt-4 md:pt-8 flex flex-col items-center bg-black">
      <div className="w-full max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-[#E04D2D] rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-10 shadow-2xl relative overflow-hidden group"
        >
          {/* Subtle background glow effect to make it premium */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/20 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            <h2 className="text-sm md:text-base font-semibold tracking-[0.3em] uppercase text-white/90 mb-6">
              {siteData?.event?.eventSubtitle || "EVENTS & CELEBRATIONS"}
            </h2>
            <h3 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 whitespace-pre-line">
              {siteData?.event?.eventTitle || "Something Special Awaits"}
            </h3>
            <p className="text-white/90 text-lg leading-relaxed max-w-2xl whitespace-pre-line">
              {siteData?.event?.eventDescription || "From live music nights to grand food festivals and private celebrations — discover what's happening at Spice Garden."}
            </p>
          </div>

          <div className="z-10 w-full lg:w-auto flex justify-center">
            <a href="/events" className="btn-12 shadow-xl text-sm md:text-base w-full sm:w-auto">
              <span>View Events</span>
            </a>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
