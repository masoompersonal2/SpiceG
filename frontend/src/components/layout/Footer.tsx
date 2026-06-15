// Removed lucide-react imports due to missing exports/vite errors
import { useContent } from "../../context/ContentContext";

const LinkArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-[#E04D2D] transition-colors shrink-0">
    <polyline points="15 10 20 15 15 20"/>
    <path d="M4 4v7a4 4 0 0 0 4 4h12"/>
  </svg>
);

export function Footer() {
  const { siteData } = useContent();

  const resolveMediaUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/') && !url.startsWith('/uploads')) return url;
    return `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${url}`;
  };
  return (
    <footer className="relative md:fixed bottom-0 left-0 w-full min-h-screen md:h-screen z-10 md:-z-10 bg-[#0a0a0a] flex flex-col justify-end overflow-hidden">
      
      {/* Video or Image Background (Full Screen) */}
      {siteData?.footer?.footerBackgroundType === 'image' ? (
        <img 
          src={siteData.footer.footerBackgroundMedia?.startsWith('http') ? siteData.footer.footerBackgroundMedia : (siteData.footer.footerBackgroundMedia?.startsWith('/') && !siteData.footer.footerBackgroundMedia?.startsWith('/uploads') ? siteData.footer.footerBackgroundMedia : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${siteData.footer.footerBackgroundMedia}`)} 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      ) : (
        <video 
          src={resolveMediaUrl(siteData?.footer?.footerBackgroundMedia) || '/video.mp4'}
          autoPlay loop muted playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      )}

      {/* Centered Cutout Badge Shape */}
      <div className="absolute inset-0 flex items-start md:items-center justify-center pointer-events-none pt-16 md:pt-0 md:mb-[16rem]">
        <svg viewBox="0 0 1000 400" className="w-[95vw] max-w-[1200px] h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <defs>
            <mask id="spiceMask">
              <rect width="1000" height="400" fill="white" />
              <text 
                x="500" 
                y="220" 
                textAnchor="middle" 
                dominantBaseline="central" 
                className="font-serif font-black tracking-tighter" 
                style={{ fontSize: '300px' }}
                fill="black"
              >
                SPICE
              </text>
            </mask>
          </defs>
          <path 
            d="M 20,80 Q 500,-20 980,80 L 920,400 L 80,400 Z" 
            fill={siteData?.footer?.footerTextColor || "white"}
            mask="url(#spiceMask)" 
          />
        </svg>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 pb-6 pt-[20rem] sm:pt-[24rem] md:pt-[40rem] flex flex-col bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent mt-auto">
        
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 border-b border-white/10 pb-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6 max-w-sm">
            <img src="/logo.jpg" alt="Spice Garden" className="h-10 md:h-12 w-auto object-contain rounded-xl mix-blend-screen self-start" />
            <p className="text-gray-300 font-medium text-sm leading-relaxed">
              {siteData?.footer?.footerDescription || "Gokak's premier family dining restaurant. Authentic Indian & Chinese cuisine."}
            </p>
            <div className="flex flex-col gap-3 text-white/80 text-sm mt-2">
              <span className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E04D2D]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> 
                {siteData?.footer?.footerPhone || "097418 00400"}
              </span>
              <a href={siteData?.footer?.footerAddressLink || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E04D2D] shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> 
                <span className="line-clamp-2">{siteData?.footer?.footerAddress || "Jadhav Farm, Gokak, Karnataka"}</span>
              </a>
            </div>
          </div>
          
          {/* Right Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 md:gap-x-20 gap-y-10 w-full lg:w-auto">
            {/* Links 1 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white/40 text-xs font-bold tracking-widest uppercase mb-2">Links</h4>
              <a href="/" className="group text-sm font-medium text-white/70 hover:text-[#E04D2D] transition-colors flex items-center gap-2">
                <LinkArrow /> Home
              </a>
              <a href="/menu" onClick={(e) => { e.preventDefault(); window.location.href = "/menu"; }} className="group text-sm font-medium text-white/70 hover:text-[#E04D2D] transition-colors flex items-center gap-2">
                <LinkArrow /> Menu
              </a>
              <a href="#about" className="group text-sm font-medium text-white/70 hover:text-[#E04D2D] transition-colors flex items-center gap-2">
                <LinkArrow /> About
              </a>
            </div>
            
            {/* Links 2 */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white/40 text-xs font-bold tracking-widest uppercase mb-2 opacity-0">Links</h4>
              <a href="/gallery" className="group text-sm font-medium text-white/70 hover:text-[#E04D2D] transition-colors flex items-center gap-2">
                <LinkArrow /> Gallery
              </a>
              <a href="/auth" className="group text-sm font-medium text-white/70 hover:text-[#E04D2D] transition-colors flex items-center gap-2">
                <LinkArrow /> Order Online
              </a>
              <a href="/contact" className="group text-sm font-medium text-white/70 hover:text-[#E04D2D] transition-colors flex items-center gap-2">
                <LinkArrow /> Contact
              </a>
            </div>
            
            {/* Legal */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white/40 text-xs font-bold tracking-widest uppercase mb-2">Legal</h4>
              <a href="/terms" className="group text-sm font-medium text-white/70 hover:text-[#E04D2D] transition-colors flex items-center gap-2">
                <LinkArrow /> Terms and Conditions
              </a>
              <a href="/privacy" className="group text-sm font-medium text-white/70 hover:text-[#E04D2D] transition-colors flex items-center gap-2">
                <LinkArrow /> Privacy Policy
              </a>
              <a href="/disclaimer" className="group text-sm font-medium text-white/70 hover:text-[#E04D2D] transition-colors flex items-center gap-2">
                <LinkArrow /> Disclaimer
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-white/50 pt-4 gap-4">
          <span>© 2026 Spice Garden. All rights reserved.</span>
          <div className="flex gap-6 text-[#E04D2D] font-medium">
            {(siteData?.footer?.footerSocials || [])
              .filter((s: any) => s.isEnabled)
              .map((social: any) => (
                <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className="group hover:text-white transition-colors flex items-center gap-2" aria-label={social.platform}>
                  {social.platform === "instagram" && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>}
                  {social.platform === "facebook" && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>}
                  {social.platform === "youtube" && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>}
                  {social.platform === "twitter" && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>}
                </a>
              ))}
          </div>
          <span>{siteData?.footer?.footerEmail || "info@spicegarden.info"}</span>
        </div>

      </div>
    </footer>
  );
}
