import { Navbar } from "../components/layout/Navbar";
import { HeroSection } from "../features/hero/HeroSection";
import { AboutSection } from "../features/about/AboutSection";
import { PopularDishes } from "../features/popular/PopularDishes";
import { MenuPreview } from "../features/menu/MenuPreview";
import { ReservationSection } from "../features/reservation/ReservationSection";
import { OrderCtaSection } from "../features/ordering/OrderCtaSection";
import { EventsCtaSection } from "../features/events/EventsCtaSection";
import { WhyDineSection } from "../features/about/WhyDineSection";
import { TestimonialsSection } from "../features/testimonials/TestimonialsSection";
import { Footer } from "../components/layout/Footer";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <>
      <main className="relative z-10 min-h-screen flex flex-col w-full overflow-hidden bg-background md:mb-[100vh] shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-b-[2rem] md:rounded-b-[3rem]">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <PopularDishes />
        <MenuPreview />
        <ReservationSection />
        <OrderCtaSection />
        <EventsCtaSection />
        <WhyDineSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
