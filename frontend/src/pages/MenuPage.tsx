import { useState, useEffect } from "react";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  isVeg: boolean;
  priceText: string;
  image: string;
}

export function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const CATEGORIES = [
    "All", "Main Course (Non-Veg)", "Soups", "Starters", "Chinese", 
    "Main Course (Veg)", "Beverages & Salads", "Breads", 
    "Biryani & Rice", "Desserts"
  ];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/menu`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#3B2314] text-[#EBE6DD] font-serif py-16 px-4 md:px-8 relative">
      
      {/* Back Button */}
      <button 
        onClick={() => window.location.href = "/"}
        className="absolute md:fixed top-4 left-4 md:top-6 md:left-6 text-[#F36B39] hover:text-white flex items-center gap-2 transition-colors font-sans text-sm font-bold group z-[100] bg-[#2D1B10]/80 px-4 py-2 rounded-full backdrop-blur-sm border border-[#4A2F1D]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        Back
      </button>

      {/* Header text - HIDDEN ON MOBILE */}
      <div className="hidden md:block max-w-4xl mx-auto text-center mb-12 mt-8 md:mt-0">
        <p className="text-[#C1A87D] font-sans tracking-widest text-sm uppercase mb-6 font-semibold">Our Menu</p>
        <h1 className="text-4xl md:text-6xl font-normal leading-tight mb-6">
          Delicious Indian & Chinese<br />Cuisine
        </h1>
        <p className="text-gray-400 font-sans text-lg">
          Authentic flavors, fresh ingredients, served with love
        </p>
      </div>

      {/* Sticky Header Container for Filters & Tabs */}
      <div className="sticky top-0 z-40 bg-[#3B2314] pt-16 md:pt-6 pb-4 md:pb-6 border-b border-[#4A2F1D] mb-8 shadow-[0_10px_30px_-10px_rgba(45,27,16,0.8)] -mx-4 md:-mx-8 px-4 md:px-8">
        
        {/* Top filters - Full Width & Side-by-side on mobile */}
        <div className="w-full flex flex-row gap-2 md:gap-4 justify-between items-center mb-4 md:mb-6">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2D1B10] text-white border border-[#4A2F1D] rounded-full py-2.5 md:py-3 pl-10 md:pl-12 pr-4 focus:outline-none focus:border-[#F36B39] font-sans text-sm md:text-base shadow-[inset_0_0_15px_rgba(255,255,255,0.05),inset_0_0_3px_rgba(255,255,255,0.15)] transition-all duration-500 hover:bg-[#2D1B10]/80 focus:bg-[#2D1B10]/80"
            />
          </div>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="shrink-0 w-32 md:w-auto bg-[#2D1B10] text-[#EBE6DD] border border-[#4A2F1D] rounded-full px-3 md:px-6 py-2.5 md:py-3 focus:outline-none focus:border-[#F36B39] font-sans text-xs md:text-base appearance-none cursor-pointer truncate shadow-[inset_0_0_15px_rgba(255,255,255,0.05),inset_0_0_3px_rgba(255,255,255,0.15)] transition-all duration-500 hover:bg-[#2D1B10]/80"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Categories Tabs (Desktop) - Squeezed into single line, full width */}
        <div className="hidden md:flex w-full justify-between items-center gap-1 xl:gap-2">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-1 whitespace-nowrap px-1 py-1.5 rounded-full border font-sans text-[10px] xl:text-xs font-bold transition-all duration-500 truncate text-center ${
                selectedCategory === cat 
                  ? 'bg-[#F36B39] text-white border-[#F36B39] shadow-[inset_0_0_15px_rgba(255,255,255,0.2),inset_0_0_4px_rgba(255,255,255,0.3)]' 
                  : 'bg-[#2D1B10] border-[#4A2F1D] text-gray-300 hover:border-[#F36B39] hover:text-white hover:bg-[#2D1B10]/80 shadow-[inset_0_0_15px_rgba(255,255,255,0.05),inset_0_0_3px_rgba(255,255,255,0.15)]'
              }`}
              title={cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="w-full mx-auto grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="relative bg-[#2D1B10] border border-[#4A2F1D] rounded-[1rem] md:rounded-2xl overflow-hidden hover:border-[#F36B39] transition-colors group shadow-lg flex flex-col h-full md:h-[380px]">
            <div className="h-28 sm:h-32 md:h-48 w-full overflow-hidden bg-black shrink-0 relative">
              <img src={item.image.startsWith('http') ? item.image : (item.image.startsWith('/') && !item.image.startsWith('/uploads') ? item.image : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${item.image}?v=2`)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-2 sm:p-4 md:p-6 font-sans relative z-10 flex flex-col flex-1 justify-between gap-1.5 md:gap-2">
              <div className="flex items-start gap-2 md:gap-3">
                {/* Veg / Non-Veg Indicator */}
                <div className={`mt-[2px] md:mt-1 shrink-0 w-3 h-3 md:w-4 md:h-4 rounded-sm border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                  <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                </div>
                <h3 className="font-serif text-[13px] sm:text-base md:text-xl text-[#EBE6DD] leading-tight line-clamp-3">{item.name}</h3>
              </div>
              <p className="text-[#F36B39] font-sans font-bold text-xs sm:text-sm md:text-lg mt-auto">
                {/^\d/.test(item.priceText) ? `₹ ${item.priceText}` : item.priceText}
              </p>
            </div>
            
            {/* Liquid Glass Border Overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-[1rem] md:rounded-2xl shadow-[inset_0_0_10px_rgba(255,255,255,0.08),inset_0_0_3px_rgba(255,255,255,0.15)] md:shadow-[inset_0_0_20px_rgba(255,255,255,0.08),inset_0_0_5px_rgba(255,255,255,0.15)] z-50 transition-all duration-500 group-hover:bg-white/5"></div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400 font-sans">
            No dishes found for your selection.
          </div>
        )}
      </div>

    </div>
  );
}
