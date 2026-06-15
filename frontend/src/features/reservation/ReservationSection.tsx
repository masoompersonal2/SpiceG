import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle2 } from "lucide-react";
import { useContent } from "../../context/ContentContext";

const ReservationTimeSelector = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  const [h, m] = (value || "18:00").split(":");
  const hour24 = parseInt(h, 10);
  const hour12 = hour24 % 12 || 12;
  const ampm = hour24 >= 12 ? "PM" : "AM";
  const minute = m;

  const handleUpdate = (newH12: string, newM: string, newAmPm: string) => {
    let h24 = parseInt(newH12, 10);
    if (newAmPm === "PM" && h24 !== 12) h24 += 12;
    if (newAmPm === "AM" && h24 === 12) h24 = 0;
    onChange(`${h24.toString().padStart(2, '0')}:${newM}`);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <select value={hour12.toString().padStart(2, '0')} onChange={e => handleUpdate(e.target.value, minute, ampm)} className="bg-transparent text-white border border-gray-600 rounded px-3 py-2 focus:outline-none flex-1 appearance-none cursor-pointer">
        {Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => <option key={h} value={h} className="bg-zinc-900 text-white">{h}</option>)}
      </select>
      <span className="text-white font-bold">:</span>
      <select value={minute} onChange={e => handleUpdate(hour12.toString(), e.target.value, ampm)} className="bg-transparent text-white border border-gray-600 rounded px-3 py-2 focus:outline-none flex-1 appearance-none cursor-pointer">
        {["00", "15", "30", "45"].map(m => <option key={m} value={m} className="bg-zinc-900 text-white">{m}</option>)}
      </select>
      <select value={ampm} onChange={e => handleUpdate(hour12.toString(), minute, e.target.value)} className="bg-transparent text-[#E04D2D] font-bold border border-[#E04D2D]/50 rounded px-3 py-2 focus:outline-none flex-1 appearance-none cursor-pointer">
        <option value="AM" className="bg-zinc-900 text-white">AM</option>
        <option value="PM" className="bg-zinc-900 text-white">PM</option>
      </select>
    </div>
  );
};

export function ReservationSection() {
  const { siteData } = useContent();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState({ openTime: "18:00", closeTime: "23:00" });

  const resolveMediaUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/') && !url.startsWith('/uploads')) return url;
    return `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${url}`;
  };

  // Fetch time settings on load
  useState(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && data.openTime) setSettings(data);
      })
      .catch(err => console.error(err));
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);
    
    if (!name || !phone || !date || !time) return;

    // Time validation
    if (time < settings.openTime || time > settings.closeTime) {
      setErrorMsg(`This time slot is not available. We are open from ${settings.openTime} to ${settings.closeTime}.`);
      setIsSubmitting(false);
      return;
    }

    try {
      localStorage.setItem("pendingReservation", JSON.stringify({
        name, email, phone, date, time
      }));

      window.location.href = "/auth";
    } catch (error) {
      setErrorMsg("Error initiating reservation. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reservation" className="w-full px-4 md:px-6 py-8 md:py-24 flex flex-col items-center bg-[#F6EEED] relative">
      
      {/* Success Toast */}
      <AnimatePresence>
        {false && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-[#141414] text-[#E04D2D] px-6 py-4 rounded-full font-serif text-lg font-bold shadow-2xl border border-white/10 flex items-center gap-3"
          >
            <CheckCircle2 className="w-6 h-6" />
            Table Reserved Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[1600px] mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center max-w-3xl mb-16 px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#3b2314] mb-6"
          >
            {siteData?.online?.onlineTitle || "ONLINE RESERVATION"}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed whitespace-pre-line"
          >
            {siteData?.online?.onlineDescription || "Spice Garden is one of the most popular restaurants. Special menus made by our passionate chefs and quality that will impress you."}
          </motion.p>
        </div>

        {/* Two Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full items-stretch lg:h-[600px]">
          
          {/* Left: Form Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-transparent p-8 md:p-12 lg:p-16 flex flex-col justify-center w-full"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-10 w-full max-w-md mx-auto lg:mx-0">
              
              <div className="relative border-b border-gray-600 pb-3 group">
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name" 
                  className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg md:text-xl transition-colors" 
                />
                <div className="absolute bottom-0 left-0 h-[2px] bg-[#E04D2D] w-0 group-focus-within:w-full transition-all duration-300"></div>
              </div>

              <div className="relative border-b border-gray-600 pb-3 group">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email" 
                  className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg md:text-xl transition-colors" 
                />
                <div className="absolute bottom-0 left-0 h-[2px] bg-[#E04D2D] w-0 group-focus-within:w-full transition-all duration-300"></div>
              </div>

              <div className="relative border-b border-gray-600 pb-3 group">
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone" 
                  className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg md:text-xl transition-colors" 
                />
                <div className="absolute bottom-0 left-0 h-[2px] bg-[#E04D2D] w-0 group-focus-within:w-full transition-all duration-300"></div>
              </div>

              <div className="relative border-b border-gray-600 pb-3 flex items-center justify-between group">
                <input 
                  type="text" 
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Date" 
                  onFocus={(e) => e.target.type = 'date'}
                  onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg md:text-xl transition-colors cursor-pointer" 
                  onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                />
                <Calendar className="w-5 h-5 text-gray-400 pointer-events-none group-focus-within:text-[#E04D2D] transition-colors" />
                <div className="absolute bottom-0 left-0 h-[2px] bg-[#E04D2D] w-0 group-focus-within:w-full transition-all duration-300"></div>
              </div>

              <div className="relative border-b border-gray-600 pb-3 flex flex-col gap-2 group">
                <label className="text-gray-400 text-sm">Time</label>
                <ReservationTimeSelector value={time} onChange={setTime} />
                <div className="absolute bottom-0 left-0 h-[2px] bg-[#E04D2D] w-0 group-focus-within:w-full transition-all duration-300"></div>
              </div>

              {errorMsg && (
                <div className="text-[#E04D2D] text-sm md:text-base font-bold bg-[#E04D2D]/10 p-4 rounded-xl border border-[#E04D2D]/30">
                  {errorMsg}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#B2E624] text-black py-4 font-bold tracking-widest hover:bg-white transition-colors duration-300 disabled:opacity-50"
              >
                {isSubmitting ? "REDIRECTING..." : "BOOK TABLE"}
              </button>
            </form>
          </motion.div>

          {/* Right: Media Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-[3rem] overflow-hidden shadow-2xl min-h-[400px] lg:min-h-0 h-full border border-gray-800/60 group bg-zinc-900"
          >
            {siteData?.online?.mediaType === 'image' ? (
              <img 
                src={resolveMediaUrl(siteData?.online?.mediaUrl)} 
                alt="Reservation" 
                className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <video 
                src={resolveMediaUrl(siteData?.online?.mediaUrl || '/reserve/reserve.mp4')} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover absolute inset-0"
              />
            )}
            {/* Liquid Glass Border Overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-[3rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.192),inset_0_0_5px_rgba(255,255,255,0.274)] z-50 transition-all duration-500 group-hover:bg-white/5"></div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
