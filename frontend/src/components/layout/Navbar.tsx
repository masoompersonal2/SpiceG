import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../../context/ContentContext";

export function Navbar() {
  const { siteData } = useContent();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => { 
      document.body.style.overflow = ''; 
      document.documentElement.style.overflow = ''; 
    };
  }, [isMobileMenuOpen]);

  const [scrolled, setScrolled] = useState(false);
  const [isHiddenByFooter, setIsHiddenByFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Hide header when near the bottom (viewing footer)
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 150;
      setIsHiddenByFooter(isBottom);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Menu", href: "/menu" },
    { name: "Gallery", href: "/gallery" },
    { name: "Events", href: "/events" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <>
      {/* Fake header to prevent layout shift from fixed navbar */}
      <div className="h-[72px] md:h-[80px] w-full shrink-0" />

      {/* Main Navbar */}
      <nav 
        className={`fixed z-[9999] transition-all duration-500 ease-in-out flex items-center justify-between ${
          scrolled 
            ? 'top-3 left-1/2 -translate-x-1/2 w-[92%] md:w-[80%] max-w-[1100px] bg-black/90 backdrop-blur-xl py-2 md:py-3 px-5 md:px-10 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/10' 
            : 'top-0 left-0 w-full bg-transparent py-4 md:py-5 px-6 md:px-12'
        } ${isHiddenByFooter ? 'lg:-translate-y-[200%]' : 'translate-y-0'}`}
      >
        {/* Logo */}
        <div className="flex-1 cursor-pointer">
          <a 
            href="#" 
            className="inline-block" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onDoubleClick={(e) => { e.preventDefault(); window.location.href = "/admin/login"; }}
          >
            <img src={siteData?.hero?.logoImage || "/logo.jpg"} alt="Crave Logo" className="h-8 md:h-10 w-auto object-contain rounded-xl" />
          </a>
        </div>

        {/* Center Links (Desktop) */}
        <div className={`hidden lg:flex flex-1 justify-center space-x-8 text-sm font-medium ${scrolled ? 'text-white' : 'text-gray-400'}`}>
          <a href="/" className="hover:text-[#E04D2D] transition-colors">Home</a>
          <a href="/about" className="hover:text-[#E04D2D] transition-colors">About</a>
          <a href="/menu" className="hover:text-[#E04D2D] transition-colors">Menu</a>
          <a href="/gallery" className="hover:text-[#E04D2D] transition-colors">Gallery</a>
          <a href="/events" className="hover:text-[#E04D2D] transition-colors">Events</a>
          <a href="/contact" className="hover:text-[#E04D2D] transition-colors">Contact</a>
        </div>

        {/* Right Action */}
        <div className="flex-1 flex justify-end items-center">
          {/* Order Online Button (Desktop & Mobile) */}
          <a href="/auth" className={`flex items-center space-x-1 md:space-x-2 text-xs md:text-sm font-semibold hover:opacity-70 transition-opacity mr-3 md:mr-0 ${scrolled ? 'text-white' : 'text-gray-800'}`}>
            <span className="bg-[#E04D2D] text-white px-3 py-1.5 md:px-0 md:py-0 md:bg-transparent md:text-inherit rounded-full">Order Online</span>
            <svg className="hidden md:block" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden flex items-center space-x-2 text-sm font-semibold hover:opacity-70 transition-opacity bg-black text-white px-4 py-2 rounded-full"
          >
            <span>Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] bg-[#3b2314] text-white flex flex-col h-[100dvh] overscroll-contain"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 pb-4">
              <a href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
                <img src={siteData?.hero?.logoImage || "/logo.jpg"} alt="Crave Logo" className="h-8 md:h-10 w-auto object-contain rounded-xl" />
                <div className="flex flex-col">
                  <span className="font-serif text-lg md:text-xl font-bold tracking-widest text-[#E8E6E1] group-hover:text-[#B2E624] transition-colors">{siteData?.hero?.heroTitle || "CRAVE"}</span>
                  <span className="text-[8px] md:text-[10px] text-[#C4A464] tracking-[0.2em] uppercase">{siteData?.hero?.heroLocation || "GOKAK"}</span>
                </div>
              </a>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                Close <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {/* Links List */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col">
              {navLinks.map((link, index) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-6 sm:py-8 border-b border-white/10 group"
                >
                  <span className="font-sans text-2xl sm:text-4xl font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] group-hover:text-[#E04D2D] transition-colors truncate pr-4">
                    {link.name}
                  </span>
                  <span className="font-sans text-sm sm:text-base font-bold text-[#00E5B5] shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
