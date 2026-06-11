import { ArrowLeft, MapPin, Share, Calendar, IndianRupee } from "lucide-react";
import { useState, useEffect } from "react";

export function EventsPage() {
  const [siteData, setSiteData] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("All Events");

  useEffect(() => {
    fetch("http://localhost:3000/api/content/site")
      .then(res => res.json())
      .then(data => setSiteData(data));
    
    fetch("http://localhost:3000/api/events")
      .then(res => res.json())
      .then(data => setEvents(data.filter((e: any) => e.isEnabled)));
  }, []);

  const resolveImageUrl = (url: string | undefined) => {
    if (!url) return "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070";
    if (url.startsWith("http")) return url;
    return `http://localhost:3000${url}?v=2`;
  };

  const getMonthAndDay = (dateString: string) => {
    const d = new Date(dateString);
    const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    return { month, day };
  };

  const isThisWeekend = (dateString: string) => {
    const d = new Date(dateString);
    const day = d.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString).getTime() > new Date().getTime();
  };

  const filteredEvents = events.filter(ev => {
    if (activeTab === "This Weekend") return isThisWeekend(ev.date) && isUpcoming(ev.date);
    if (activeTab === "Upcoming") return isUpcoming(ev.date);
    return true;
  });

  const heroTitle = siteData?.eventsH?.title || 'Exclusive Resort Experiences';
  const heroSubtitle = siteData?.eventsH?.subtitle || 'Discover curated moments of luxury, from private beach yoga to gourmet gala dinners at our world-class retreats.';
  const bgImage = siteData?.eventsH?.bgImage;

  return (
    <main className="min-h-screen flex flex-col w-full bg-[#1A1009] text-[#E8E6E1] pb-24 font-sans">
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center flex-col text-center px-6 overflow-hidden">
        <a href="/" className="absolute md:fixed top-8 left-8 flex items-center gap-2 text-[#C4A464] hover:text-white transition-colors z-[100] font-bold bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 shadow-lg">
          <ArrowLeft className="w-5 h-5" /> Back
        </a>
        
        <img 
          src={resolveImageUrl(bgImage)} 
          alt="Events Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#1A1009]/80 to-[#1A1009] z-10"></div>
        
        <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
            {heroTitle.split(' ').map((word: string, i: number, arr: string[]) => 
              i === arr.length - 1 ? <span key={i} className="block text-[#C4A464] italic">{word}</span> : word + ' '
            )}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Events Filter and Grid */}
      <section id="events-grid" className="w-full max-w-7xl mx-auto px-6 md:px-12 -mt-10 relative z-30">
        
        {/* Filter Tabs */}
        <div className="sticky top-0 pt-6 pb-4 mb-8 z-50 bg-[#1A1009]/90 backdrop-blur-md rounded-b-3xl -mx-6 px-6 md:-mx-12 md:px-12 shadow-[0_10px_30px_rgba(26,16,9,0.5)]">
          <div className="flex flex-nowrap md:flex-wrap items-center gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {["All Events", "Upcoming", "This Weekend"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative overflow-hidden px-3 py-1.5 md:px-6 md:py-2.5 text-xs md:text-base whitespace-nowrap rounded-lg md:rounded-xl font-bold transition-all border group shadow-lg ${activeTab === tab ? 'bg-[#C4A464] text-[#1A1009] border-[#C4A464]' : 'bg-[#25150D] text-[#C4A464] border-white/5 hover:bg-[#3A2417]'}`}
              >
                <span className="relative z-10">{tab}</span>
                <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[inset_0_0_20px_rgba(255,255,255,0.192),inset_0_0_5px_rgba(255,255,255,0.274)] z-0 transition-all duration-500 group-hover:bg-white/5"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredEvents.map(ev => {
            const { month, day } = getMonthAndDay(ev.date);
            const percentageBooked = ev.totalSeats > 0 ? Math.round((ev.bookedSeats / ev.totalSeats) * 100) : 0;
            const seatsLeft = Math.max(0, ev.totalSeats - ev.bookedSeats);

            return (
              <div key={ev.id} className="relative rounded-3xl bg-[#201510] border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02),inset_0_0_5px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                
                {/* Image & Badges */}
                <div className="relative h-48 md:h-64 w-full overflow-hidden">
                  <img src={resolveImageUrl(ev.image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={ev.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#201510] to-transparent"></div>
                  
                  {/* Date Badge */}
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-black/80 backdrop-blur-md border border-[#C4A464]/30 rounded-xl md:rounded-2xl p-2 md:p-3 flex flex-col items-center justify-center min-w-[50px] md:min-w-[60px] shadow-lg">
                    <span className="text-[#C4A464] text-[10px] md:text-xs font-bold tracking-widest">{month}</span>
                    <span className="text-white text-xl md:text-2xl font-serif">{day}</span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-[#C4A464] text-[#1A1009] px-3 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl font-bold flex items-center gap-1 shadow-lg text-xs md:text-base">
                    <span>₹{ev.price}</span>
                    <span className="text-[10px] md:text-xs opacity-70">PER GUEST</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-[#C4A464] text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2 md:mb-4">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4" /> {ev.location}
                  </div>
                  <h3 className="text-xl md:text-3xl font-serif text-white mb-1 md:mb-2">{ev.title}</h3>
                  <p className="text-gray-400 text-xs md:text-sm line-clamp-2 mb-4 md:mb-8">{ev.subtitle}</p>

                  <div className="mt-auto">
                    <div className="flex justify-between items-center text-[10px] md:text-xs font-bold mb-1 md:mb-2">
                      <span className="text-[#00E5B5]">{seatsLeft} SEATS AVAILABLE</span>
                      <span className="text-gray-500">{percentageBooked}% BOOKED</span>
                    </div>
                    <div className="w-full h-1 md:h-1.5 bg-[#1A1009] rounded-full overflow-hidden mb-4 md:mb-8">
                      <div className="h-full bg-[#C4A464] rounded-full" style={{ width: `${percentageBooked}%` }}></div>
                    </div>

                    <div className="flex gap-2 md:gap-4">
                      <button className="flex-1 bg-[#C4A464] text-[#1A1009] py-2 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl font-bold shadow-lg hover:bg-white transition-colors relative overflow-hidden group/btn">
                        <span className="relative z-10">Book Now</span>
                        <div className="absolute inset-0 pointer-events-none rounded-lg md:rounded-xl shadow-[inset_0_0_20px_rgba(255,255,255,0.3),inset_0_0_5px_rgba(255,255,255,0.4)] z-0 transition-all duration-500"></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Liquid Glass Overlay for Ticket Card */}
                <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[inset_0_0_20px_rgba(255,255,255,0.192),inset_0_0_5px_rgba(255,255,255,0.274)] z-50 transition-all duration-500 group-hover:bg-white/5"></div>
              </div>
            );
          })}

          {filteredEvents.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500 font-serif text-2xl">
              No events found for the selected category.
            </div>
          )}
        </div>

      </section>
    </main>
  );
}
