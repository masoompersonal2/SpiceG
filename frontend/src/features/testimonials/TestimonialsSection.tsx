import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from "framer-motion";
import { useContent } from "../../context/ContentContext";

const SQRT_5000 = Math.sqrt(5000);


interface TestimonialCardProps {
  position: number;
  testimonial: any;
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={`absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out ${
        isCenter 
          ? "z-10 bg-[#E04D2D] text-white border-[#E04D2D]" 
          : "z-0 bg-white text-black border-gray-200 hover:border-[#E04D2D]/50"
      }`}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(224,77,45,0.3)" : "0px 0px 0px 0px transparent"
      }}
    >
      <span
        className={`absolute block origin-top-right rotate-45 ${isCenter ? 'bg-[#c44226]' : 'bg-gray-200'}`}
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <img
        src={testimonial.image?.startsWith('http') ? testimonial.image : (testimonial.image?.startsWith('/') && !testimonial.image?.startsWith('/uploads') ? testimonial.image : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${testimonial.image}`)}
        alt={`${testimonial.name}`}
        className="mb-4 h-14 w-14 rounded-full bg-gray-100 object-cover object-top border-2 border-white shadow-md"
      />
      <h3 className={`text-base sm:text-xl font-medium ${isCenter ? "text-white" : "text-black"}`}>
        "{testimonial.text}"
      </h3>
      <p className={`absolute bottom-8 left-8 right-8 mt-2 text-sm italic ${isCenter ? "text-white/80" : "text-gray-500"}`}>
        - {testimonial.name}
      </p>
    </div>
  );
};

export const TestimonialsSection: React.FC = () => {
  const { testimonialData, loading } = useContent();
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);

  useEffect(() => {
    if (testimonialData && testimonialData.length > 0) {
      setTestimonialsList(testimonialData.map((t: any) => ({ ...t, tempId: Math.random() })));
    }
  }, [testimonialData]);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setTestimonialsList(prev => {
        const newList = [...prev];
        const item = newList.shift();
        if (!item) return prev;
        newList.push({ ...item, tempId: Math.random() });
        return newList;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (loading || testimonialsList.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 md:py-24 flex flex-col items-center">
      <div className="w-full max-w-[1600px] mx-auto flex flex-col items-center">
        
        <div className="text-center mb-16 px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm md:text-base font-semibold tracking-[0.3em] uppercase text-[#E04D2D] mb-4"
          >
            TESTIMONIALS
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black"
          >
            What Our Customers Say
          </motion.h3>
        </div>

        <div
          className="relative w-full overflow-hidden"
          style={{ height: 600 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {testimonialsList.map((testimonial, index) => {
            const position = index - Math.floor(testimonialsList.length / 2);
            return (
              <TestimonialCard
                key={testimonial.tempId}
                testimonial={testimonial}
                handleMove={handleMove}
                position={position}
                cardSize={cardSize}
              />
            );
          })}
          
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-4">
            <button
              onClick={() => handleMove(-1)}
              className="flex h-14 w-14 items-center justify-center text-2xl transition-all duration-300 rounded-full bg-white border-2 border-gray-200 hover:bg-[#E04D2D] hover:text-white hover:border-[#E04D2D] text-black shadow-lg"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleMove(1)}
              className="flex h-14 w-14 items-center justify-center text-2xl transition-all duration-300 rounded-full bg-white border-2 border-gray-200 hover:bg-[#E04D2D] hover:text-white hover:border-[#E04D2D] text-black shadow-lg"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
