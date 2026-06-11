"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence
} from "framer-motion";
import { Footer } from "../components/layout/Footer";

export const HeroParallax = ({
  images,
  headerText
}: {
  images: { id: number, row: number, title: string, image: string }[];
  headerText: any;
}) => {
  const firstRow = images.filter(img => img.row === 1);
  const secondRow = images.filter(img => img.row === 2);
  const thirdRow = images.filter(img => img.row === 3);

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const springConfig = { stiffness: 150, damping: 35, bounce: 0 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 300]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -300]), springConfig);
  
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-300, 50]), springConfig);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const allImages = [...firstRow, ...secondRow, ...thirdRow];

  // Helper to open lightbox
  const openLightbox = (imgId: number) => {
    const idx = allImages.findIndex(i => i.id === imgId);
    if (idx !== -1) setLightboxIndex(idx);
  };

  // Lightbox handlers
  const nextImage = () => setLightboxIndex(prev => prev !== null ? (prev + 1) % allImages.length : null);
  const prevImage = () => setLightboxIndex(prev => prev !== null ? (prev - 1 + allImages.length) % allImages.length : null);
  const closeLightbox = () => setLightboxIndex(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, allImages.length]);

  return (
    <>
      <div
        ref={ref}
        className="pb-10 pt-24 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] bg-[#2D1B10]"
      >
        <Header headerText={headerText} />
        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
            opacity,
          }}
          className="flex flex-col gap-10 md:gap-20"
        >
          {firstRow.length > 0 && <GalleryRow images={firstRow} onImageClick={openLightbox} translate={translateX} reverse />}
          {secondRow.length > 0 && <GalleryRow images={secondRow} onImageClick={openLightbox} translate={translateXReverse} />}
          {thirdRow.length > 0 && <GalleryRow images={thirdRow} onImageClick={openLightbox} translate={translateX} reverse />}
        </motion.div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
          >
            {/* Close Button */}
            <button onClick={closeLightbox} className="absolute top-6 right-6 text-white/50 hover:text-white p-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            
            {/* Main Image */}
            <motion.img 
              key={lightboxIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              src={resolveImageUrl(allImages[lightboxIndex].image)} 
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              alt="Gallery Preview"
            />

            {/* Left Button */}
            <button onClick={prevImage} className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-[#201A18] border border-[#B88E2F]/30 text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white transition-colors shadow-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            
            {/* Right Button */}
            <button onClick={nextImage} className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-[#201A18] border border-[#B88E2F]/30 text-[#B88E2F] hover:bg-[#B88E2F] hover:text-white transition-colors shadow-xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            
            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 font-mono text-sm tracking-widest">
              {lightboxIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const resolveImageUrl = (url: string) => {
  return url.startsWith('http') ? url : (url.startsWith('/') && !url.startsWith('/uploads') ? url : `http://localhost:3000${url}`);
};

const GalleryRow = ({ images, onImageClick, translate, reverse = false }: { images: any[], onImageClick: (id: number) => void, translate: any, reverse?: boolean }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/row w-full max-w-full">
      <div 
        ref={scrollRef}
        className={`flex ${reverse ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-6 md:space-x-12 px-6 md:px-12 overflow-x-auto custom-scrollbar pb-4 snap-x snap-mandatory`}
      >
        {images.map((img) => (
          <div key={img.id} className="snap-center shrink-0 cursor-pointer" onClick={() => onImageClick(img.id)}>
            <ProductCard img={img} translate={translate} />
          </div>
        ))}
      </div>
      
      {/* Manual Scroll Controls */}
      <div className="flex justify-end gap-3 mt-4 px-6 md:px-12 opacity-100 lg:opacity-0 lg:group-hover/row:opacity-100 transition-opacity duration-300">
        <button onClick={scrollLeft} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-[#E04D2D] hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button onClick={scrollRight} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-[#E04D2D] hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
};

export const Header = ({ headerText }: { headerText: any }) => {
  return (
    <div className="max-w-7xl relative mx-auto pt-24 pb-12 md:pt-32 md:pb-16 px-6 md:px-12 w-full left-0 top-0">
      <h4 className="text-[#E04D2D] font-bold tracking-[0.2em] uppercase mb-4 text-sm md:text-base">
        {headerText?.subtitle || "VISUAL JOURNEY"}
      </h4>
      <h1 className="text-4xl md:text-7xl font-serif font-black text-[#EBE6DD] mb-6 leading-tight">
        {headerText?.title || "Photo Gallery"}
      </h1>
      <p className="max-w-2xl text-base md:text-xl text-[#EBE6DD]/80 leading-relaxed font-medium">
        {headerText?.description || "A glimpse into our vibrant ambiance, celebrations, and festive moments."}
      </p>
    </div>
  );
};

export const ProductCard = ({
  img,
  translate,
}: {
  img: { id: number, row: number, title: string, image: string };
  translate: any;
}) => {
  const imageUrl = resolveImageUrl(img.image);
  
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -10,
        scale: 1.02,
      }}
      key={img.id}
      className="group/product h-[12rem] w-[18rem] md:h-72 md:w-[24rem] lg:h-[26rem] lg:w-[36rem] relative flex-shrink-0 border border-white/20 shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] backdrop-blur-sm rounded-2xl overflow-hidden"
    >
      <div className="block group-hover/product:shadow-2xl w-full h-full">
        <img
          src={imageUrl}
          className="object-cover object-center absolute h-full w-full inset-0"
          alt={img.title || "Gallery Image"}
        />
      </div>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black/60 pointer-events-none transition-opacity duration-300"></div>
      <h2 className="absolute bottom-4 left-6 opacity-0 group-hover/product:opacity-100 text-white font-bold text-xl md:text-2xl transition-opacity duration-300">
        {img.title}
      </h2>
    </motion.div>
  );
};


export function GalleryPage() {
  const [images, setImages] = useState([]);
  const [headerText, setHeaderText] = useState<any>({});

  useEffect(() => {
    // Fetch site content for header text
    fetch("http://localhost:3000/api/content/site")
      .then(res => res.json())
      .then(data => {
        if (data && data.galleryH) {
          setHeaderText(data.galleryH);
        }
      });
      
    // Fetch gallery images
    fetch("http://localhost:3000/api/content/gallery-image")
      .then(res => res.json())
      .then(data => {
        setImages(data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#2D1B10] w-full flex flex-col font-sans">
      
      {/* Back Button */}
      <div className="md:fixed absolute top-[40px] md:top-12 left-6 md:left-12 z-40">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md text-sm font-bold shadow-lg group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          Back
        </button>
      </div>

      <div className="flex-1 w-full">
        {images.length > 0 ? (
          <HeroParallax images={images} headerText={headerText} />
        ) : (
          <div className="min-h-screen flex items-center justify-center pt-20">
            <div className="text-center">
              <Header headerText={headerText} />
              <p className="text-white/40 mt-8">No images added to gallery yet.</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
