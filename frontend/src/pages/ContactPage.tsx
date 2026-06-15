import { ArrowLeft, Phone, Mail, Send } from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
import { useState, useEffect } from "react";

export function ContactPage() {
  const [siteData, setSiteData] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/site`)
      .then(res => res.json())
      .then(data => {
        setSiteData(data);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const resolveImageUrl = (url: string | undefined) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${url}?v=2`;
  };

  const isVideo = (url: string) => url.match(/\.(mp4|webm|ogg)/i);

  const footer = siteData?.footer || {};
  const insta = siteData?.contact?.instagram || [];

  return (
    <main className="min-h-screen bg-[#2D1B10] text-[#E8E6E1] pb-20 font-sans relative">
      
      <a href="/" className="absolute md:fixed top-6 left-6 flex items-center gap-2 text-[#C4A464] hover:text-white transition-colors z-[100] font-bold bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 shadow-lg">
        <ArrowLeft className="w-5 h-5" /> Back
      </a>
      
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32">
        {/* Page Title */}
        <div className="text-center mb-16">
          <span className="text-[#C4A464] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Get In Touch</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#E8E6E1]">Contact Us</h1>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-24">
          <div className="relative rounded-2xl bg-[#3A2417] p-4 md:p-8 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.03),inset_0_0_5px_rgba(255,255,255,0.05)] flex flex-col items-center text-center hover:bg-[#452D1C] transition-colors">
            <Phone className="w-6 h-6 md:w-10 md:h-10 text-[#C4A464] mb-2 md:mb-4" />
            <h3 className="font-serif text-sm md:text-xl mb-1 md:mb-2">Phone</h3>
            <p className="text-[#EBE6DD]/70 text-[10px] md:text-base">{footer.phone || "+91 98765 43210"}</p>
          </div>
          
          <div className="relative rounded-2xl bg-[#3A2417] p-4 md:p-8 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.03),inset_0_0_5px_rgba(255,255,255,0.05)] flex flex-col items-center text-center hover:bg-[#452D1C] transition-colors">
            <Mail className="w-6 h-6 md:w-10 md:h-10 text-[#C4A464] mb-2 md:mb-4" />
            <h3 className="font-serif text-sm md:text-xl mb-1 md:mb-2">Email</h3>
            <p className="text-[#EBE6DD]/70 text-[10px] md:text-base break-all">{footer.email || "info@spicegarden.com"}</p>
          </div>

          <a href={footer.instagram || "#"} target="_blank" rel="noreferrer" className="relative rounded-2xl bg-[#3A2417] p-4 md:p-8 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.03),inset_0_0_5px_rgba(255,255,255,0.05)] flex flex-col items-center text-center hover:bg-[#452D1C] transition-colors group cursor-pointer">
            <InstagramIcon className="w-6 h-6 md:w-10 md:h-10 text-[#C4A464] mb-2 md:mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-serif text-sm md:text-xl mb-1 md:mb-2">Instagram</h3>
            <p className="text-[#EBE6DD]/70 text-[10px] md:text-base">Follow Us</p>
          </a>

          <a href={footer.facebook || "#"} target="_blank" rel="noreferrer" className="relative rounded-2xl bg-[#3A2417] p-4 md:p-8 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.03),inset_0_0_5px_rgba(255,255,255,0.05)] flex flex-col items-center text-center hover:bg-[#452D1C] transition-colors group cursor-pointer">
            <FacebookIcon className="w-6 h-6 md:w-10 md:h-10 text-[#C4A464] mb-2 md:mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-serif text-sm md:text-xl mb-1 md:mb-2">Facebook</h3>
            <p className="text-[#EBE6DD]/70 text-[10px] md:text-base">Join Our Page</p>
          </a>
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto relative rounded-3xl bg-[#3A2417] p-8 md:p-12 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.03),inset_0_0_5px_rgba(255,255,255,0.05)] mb-32">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-[#C4A464] mb-2">Send us a request or query</h2>
            <p className="text-[#EBE6DD]/70">We'll get back to you as soon as possible.</p>
          </div>

          {status === "success" ? (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 p-6 rounded-2xl text-center">
              <h3 className="text-xl font-bold mb-2">Thank you!</h3>
              <p>Your message has been sent successfully. We will reach out shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#EBE6DD]/80 mb-2">Your Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#25150D] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4A464] transition-colors" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#EBE6DD]/80 mb-2">Your Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-[#25150D] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4A464] transition-colors" placeholder="youremail@gmail.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#EBE6DD]/80 mb-2">Mobile Number</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#25150D] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4A464] transition-colors" placeholder={footer.phone || "+91 98765 43210"} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#EBE6DD]/80 mb-2">Describe your concern / query</label>
                <textarea required rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-[#25150D] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#C4A464] transition-colors" placeholder="How can we help you?" />
              </div>
              <button 
                type="submit" 
                disabled={status === "submitting"}
                className="w-full bg-[#C4A464] text-[#1A1009] px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {status === "submitting" ? "Sending..." : (
                  <>
                    <Send className="w-5 h-5" /> Submit Request
                  </>
                )}
              </button>
              {status === "error" && <p className="text-red-400 text-sm text-center mt-4">Something went wrong. Please try again.</p>}
            </form>
          )}
        </div>

        {/* Follow Us On Instagram Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#E8E6E1]">Follow Us On Instagram</h2>
        </div>

        {/* Instagram Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {/* Left Column */}
          <div className="grid grid-cols-2 md:flex md:flex-col gap-4 lg:gap-6">
            <a href={footer.instagram || "#"} target="_blank" rel="noreferrer" className="relative rounded-2xl overflow-hidden aspect-square border-4 border-white/5 hover:border-white/20 transition-all cursor-pointer block">
              {insta[0] && (isVideo(resolveImageUrl(insta[0])) ? 
                <video src={resolveImageUrl(insta[0])} className="w-full h-full object-cover" autoPlay muted loop playsInline /> : 
                <img src={resolveImageUrl(insta[0])} className="w-full h-full object-cover" alt="Insta 1" />
              )}
            </a>
            <a href={footer.instagram || "#"} target="_blank" rel="noreferrer" className="relative rounded-2xl overflow-hidden aspect-square border-4 border-white/5 hover:border-white/20 transition-all cursor-pointer block">
              {insta[1] && (isVideo(resolveImageUrl(insta[1])) ? 
                <video src={resolveImageUrl(insta[1])} className="w-full h-full object-cover" autoPlay muted loop playsInline /> : 
                <img src={resolveImageUrl(insta[1])} className="w-full h-full object-cover" alt="Insta 2" />
              )}
            </a>
          </div>
          
          {/* Center Column (Large) */}
          <a href={footer.instagram || "#"} target="_blank" rel="noreferrer" className="md:col-span-2 relative rounded-3xl overflow-hidden border-4 border-white/5 hover:border-white/20 transition-all cursor-pointer group flex items-center justify-center aspect-square md:aspect-auto min-h-[250px]">
            {insta[2] && (isVideo(resolveImageUrl(insta[2])) ? 
              <video src={resolveImageUrl(insta[2])} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" autoPlay muted loop playsInline /> : 
              <img src={resolveImageUrl(insta[2])} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Insta Center" />
            )}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
            {/* View Details Circle */}
            <div className="relative z-10 w-24 h-24 md:w-40 md:h-40 rounded-full border border-white flex items-center justify-center bg-black/20 backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-all duration-300">
              <span className="font-bold text-xs md:text-sm tracking-wider uppercase text-center px-2">View Details</span>
            </div>
          </a>
          
          {/* Right Column */}
          <div className="grid grid-cols-2 md:flex md:flex-col gap-4 lg:gap-6">
            <a href={footer.instagram || "#"} target="_blank" rel="noreferrer" className="relative rounded-2xl overflow-hidden aspect-square border-4 border-white/5 hover:border-white/20 transition-all cursor-pointer block">
              {insta[3] && (isVideo(resolveImageUrl(insta[3])) ? 
                <video src={resolveImageUrl(insta[3])} className="w-full h-full object-cover" autoPlay muted loop playsInline /> : 
                <img src={resolveImageUrl(insta[3])} className="w-full h-full object-cover" alt="Insta 4" />
              )}
            </a>
            <a href={footer.instagram || "#"} target="_blank" rel="noreferrer" className="relative rounded-2xl overflow-hidden aspect-square border-4 border-white/5 hover:border-white/20 transition-all cursor-pointer block">
              {insta[4] && (isVideo(resolveImageUrl(insta[4])) ? 
                <video src={resolveImageUrl(insta[4])} className="w-full h-full object-cover" autoPlay muted loop playsInline /> : 
                <img src={resolveImageUrl(insta[4])} className="w-full h-full object-cover" alt="Insta 5" />
              )}
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
