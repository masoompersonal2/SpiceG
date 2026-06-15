import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useContent } from "../../context/ContentContext";

export function MenuPreview() {
  const { categoryData, loading } = useContent();
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [allMenuItems, setAllMenuItems] = useState<any[]>([]);

  useEffect(() => {
    if (categoryData && categoryData.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(categoryData[0].id);
    }
  }, [categoryData]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/menu`)
      .then(res => res.json())
      .then(data => setAllMenuItems(data))
      .catch(err => console.error(err));
  }, []);

  if (loading || categoryData.length === 0) return null;

  const activeCategory = categoryData.find(c => c.id === activeCategoryId) || categoryData[0];
  const searchResults = searchQuery.trim() !== "" 
    ? allMenuItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <section id="recipes" className="w-full px-0 md:px-6 pt-6 md:pt-8 pb-8 md:pb-24 flex flex-col items-center scroll-mt-24">
      <div className="w-full max-w-[1600px] mx-auto bg-[#E04D2D] rounded-none md:rounded-[3rem] px-4 py-8 md:p-12 shadow-none md:shadow-2xl">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-12 gap-4 md:gap-6">
          <h2 className="font-serif text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase w-full md:w-auto text-center md:text-left">
            RECIPES
          </h2>
          
          <div className="flex flex-row gap-2 w-full md:w-auto items-center">
            {/* Search Bar */}
            <div className="relative flex-1 md:w-[400px]">
              <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-white/80" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu (e.g. Biryani)..." 
                className="w-full bg-black/10 border-2 border-white/30 rounded-full py-3 md:py-4 pl-10 md:pl-14 pr-4 md:pr-6 text-xs md:text-sm text-white placeholder-white/70 focus:outline-none focus:border-white focus:bg-black/20 transition-colors"
              />
            </div>

            {/* Mobile Dropdown */}
            <div className="relative shrink-0 md:hidden">
              <select 
                value={activeCategoryId || ""} 
                onChange={(e) => setActiveCategoryId(Number(e.target.value))}
                className="w-full bg-transparent border-2 border-white/50 rounded-full py-3 px-4 text-xs font-semibold text-white appearance-none focus:outline-none focus:border-white max-w-[120px] truncate"
              >
                {categoryData.filter((c: any) => c.isEnabled).map((cat: any) => (
                  <option key={cat.id} value={cat.id} className="text-black">{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid Layout or Search Results */}
        {searchQuery.trim() !== "" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full min-h-[400px]">
            {searchResults.length === 0 ? (
              <div className="col-span-full flex items-center justify-center text-white text-xl">
                No items found for "{searchQuery}"
              </div>
            ) : (
              searchResults.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow-xl flex flex-col gap-3 group relative overflow-hidden h-fit">
                  <div className="w-full h-32 md:h-40 rounded-xl overflow-hidden relative">
                    <img 
                      src={item.image?.startsWith('http') ? item.image : (item.image?.startsWith('/') && !item.image?.startsWith('/uploads') ? item.image : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${item.image}`)} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-xl shadow-[inset_0_0_20px_rgba(255,255,255,0.192),inset_0_0_5px_rgba(255,255,255,0.274)] z-50"></div>
                  </div>
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800 text-sm md:text-base leading-tight">{item.name}</h4>
                      <div className={`w-3 h-3 shrink-0 rounded-full border-2 ${item.isVeg ? 'border-green-600 bg-green-100' : 'border-red-600 bg-red-100'} flex items-center justify-center ml-2`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                      </div>
                    </div>
                    <p className="text-[#E04D2D] font-bold mt-1 md:mt-2 text-sm">{item.priceText}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 lg:h-[750px]">
            {/* Left Column: Tabs (Desktop only) */}
            <div className="hidden md:flex lg:col-span-3 flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
              {categoryData.filter((c: any) => c.isEnabled).map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`w-full py-4 px-6 rounded-full text-center text-sm md:text-base font-semibold tracking-wider transition-all duration-300 shrink-0 ${
                    activeCategoryId === cat.id 
                      ? "bg-white text-[#E04D2D] border-2 border-white shadow-xl" 
                      : "bg-transparent text-white/80 border-2 border-white/30 hover:border-white/60 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Middle Column: Large Featured Image */}
            <div className="col-span-2 lg:col-span-6 relative rounded-[2rem] overflow-hidden group min-h-[250px] md:min-h-[350px] lg:min-h-0">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={`${activeCategoryId}-1`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  src={activeCategory.image1?.startsWith('http') ? activeCategory.image1 : (activeCategory.image1?.startsWith('/') && !activeCategory.image1?.startsWith('/uploads') ? activeCategory.image1 : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${activeCategory.image1}`)} 
                  alt={`${activeCategory.name} 1`}
                  className="w-full h-full absolute inset-0 object-cover"
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 pointer-events-none rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.192),inset_0_0_5px_rgba(255,255,255,0.274)] z-50 transition-all duration-500 group-hover:bg-white/5"></div>

              <div className="absolute top-6 right-6 bg-white text-[#E04D2D] text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 cursor-pointer">
                {activeCategory.name} <span className="text-black text-[10px] bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center font-sans">↗</span>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-2 lg:col-span-3 flex flex-row lg:flex-col gap-4 md:gap-6 lg:gap-8 h-[120px] md:h-[250px] lg:h-full">
              <div className="relative rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden flex-1 group">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={`${activeCategoryId}-2`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    src={activeCategory.image2?.startsWith('http') ? activeCategory.image2 : (activeCategory.image2?.startsWith('/') && !activeCategory.image2?.startsWith('/uploads') ? activeCategory.image2 : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${activeCategory.image2}`)} 
                    alt={`${activeCategory.name} 2`}
                    className="w-full h-full absolute inset-0 object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 pointer-events-none rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.192),inset_0_0_5px_rgba(255,255,255,0.274)] z-50 transition-all duration-500 group-hover:bg-white/5"></div>
              </div>

              <div 
                onClick={() => window.location.href = "/menu"}
                className="relative rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden flex-1 group cursor-pointer"
              >
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={`${activeCategoryId}-3`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    src={activeCategory.image3?.startsWith('http') ? activeCategory.image3 : (activeCategory.image3?.startsWith('/') && !activeCategory.image3?.startsWith('/uploads') ? activeCategory.image3 : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${activeCategory.image3}`)} 
                    alt={`${activeCategory.name} 3`}
                    className="w-full h-full absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors duration-500 group-hover:bg-black/50 z-10">
                  <span className="text-white font-serif text-3xl md:text-5xl font-bold">
                    30+
                  </span>
                </div>
                <div className="absolute inset-0 pointer-events-none rounded-[1.5rem] lg:rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.192),inset_0_0_5px_rgba(255,255,255,0.274)] z-50 transition-all duration-500 group-hover:bg-white/5"></div>
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
}
