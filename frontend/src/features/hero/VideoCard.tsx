import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface VideoCardProps {
  videoUrl?: string;
}

export function VideoCard({ videoUrl = "/hero-video.mp4" }: VideoCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);

  return (
    <motion.div 
      ref={containerRef}
      style={{ scale }}
      className="relative w-full bg-black rounded-[2rem] overflow-hidden shadow-2xl origin-center group"
    >
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="w-full h-[55vh] md:h-[80vh] block object-cover"
      >
        <source src={videoUrl?.startsWith('http') ? videoUrl : (videoUrl?.startsWith('/') && !videoUrl?.startsWith('/uploads') ? videoUrl : `http://localhost:3000${videoUrl || ''}`)} type="video/mp4" />
      </video>
      {/* Liquid Glass Border Overlay */}
      <div className="absolute inset-0 pointer-events-none rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.192),inset_0_0_5px_rgba(255,255,255,0.274)] z-50 transition-all duration-500 group-hover:bg-white/5"></div>
    </motion.div>
  );
}
