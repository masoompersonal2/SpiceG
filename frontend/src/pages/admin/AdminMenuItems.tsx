import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  isVeg: boolean;
  priceText: string;
  image: string;
}

export function AdminMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editedItems, setEditedItems] = useState<Record<number, {name: string, priceText: string}>>({});

  const [toastMessage, setToastMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const CATEGORIES = [
    "All", "Main Course (Non-Veg)", "Soups", "Starters", "Chinese", 
    "Main Course (Veg)", "Beverages & Salads", "Breads", 
    "Biryani & Rice", "Desserts"
  ];

  const fetchItems = () => {
    fetch("http://localhost:3000/api/menu")
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      window.location.replace("/admin/login");
      return;
    }
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(i => i.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleEdit = (id: number, field: 'name' | 'priceText', value: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    setEditedItems(prev => ({
      ...prev,
      [id]: {
        name: prev[id]?.name ?? item.name,
        priceText: prev[id]?.priceText ?? item.priceText,
        [field]: value
      }
    }));
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await fetch("http://localhost:3000/api/menu/bulk-delete", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds })
    });
    
    if (res.ok) {
      setToastMessage("Items deleted successfully.");
      setSelectedIds([]);
      fetchItems();
    }
    setShowDeleteModal(false);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const confirmSave = async () => {
    const token = localStorage.getItem("adminToken");
    
    const updates = Object.keys(editedItems).map(idStr => ({
      id: parseInt(idStr),
      name: editedItems[parseInt(idStr)].name,
      priceText: editedItems[parseInt(idStr)].priceText
    }));

    if (updates.length === 0) {
      setShowSaveModal(false);
      return;
    }

    const res = await fetch("http://localhost:3000/api/menu/bulk-update", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ items: updates })
    });
    
    if (res.ok) {
      setToastMessage("Changes saved successfully.");
      setEditedItems({});
      fetchItems();
    }
    setShowSaveModal(false);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[#3B2314] text-[#EBE6DD] font-serif py-16 px-4 md:px-8 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-[#2D1B10] text-[#00E5B5] px-6 py-3 rounded-full font-sans font-bold shadow-2xl border border-white/10 flex items-center gap-3"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#2D1B10] p-8 rounded-[2rem] border border-[#4A2F1D] max-w-sm w-full shadow-2xl">
              <h3 className="font-serif text-2xl text-white mb-4">Confirm Deletion</h3>
              <p className="font-sans text-gray-300 mb-8">Are you sure you want to permanently delete {selectedIds.length} selected item(s)?</p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl font-sans font-bold text-gray-400 hover:text-white transition-colors bg-[#1A1009]">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl font-sans font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#2D1B10] p-8 rounded-[2rem] border border-[#4A2F1D] max-w-sm w-full shadow-2xl">
              <h3 className="font-serif text-2xl text-white mb-4">Save Changes</h3>
              <p className="font-sans text-gray-300 mb-8">Are you sure you want to save updates to {Object.keys(editedItems).length} item(s)?</p>
              <div className="flex gap-4">
                <button onClick={() => setShowSaveModal(false)} className="flex-1 py-3 rounded-xl font-sans font-bold text-gray-400 hover:text-white transition-colors bg-[#1A1009]">Cancel</button>
                <button onClick={confirmSave} className="flex-1 py-3 rounded-xl font-sans font-bold text-white bg-[#00E5B5] hover:bg-[#00C29A] text-black transition-colors shadow-lg">Save</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <button 
        onClick={() => window.location.href = "/admin/dashboard?tab=2"}
        className="fixed top-4 left-4 md:top-6 md:left-6 text-[#F36B39] hover:text-white flex items-center gap-2 transition-colors font-sans text-sm font-bold group z-50 bg-[#2D1B10]/80 px-4 py-2 rounded-full backdrop-blur-sm border border-[#4A2F1D]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        Back
      </button>

      {/* Sticky Header Container for Filters & Tabs */}
      <div className="sticky top-0 z-40 bg-[#3B2314] pt-16 md:pt-6 pb-4 md:pb-6 border-b border-[#4A2F1D] mb-8 shadow-[0_10px_30px_-10px_rgba(45,27,16,0.8)] -mx-4 md:-mx-8 px-4 md:px-8">
        
        {/* Admin Controls */}
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 items-center justify-between mb-6 bg-[#2D1B10] p-4 rounded-2xl border border-[#4A2F1D] shadow-lg">
          <div className="flex items-center gap-4">
            <button onClick={handleSelectAll} className="font-sans text-sm font-bold bg-[#1A1009] px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors">
              {selectedIds.length === filteredItems.length && filteredItems.length > 0 ? "Deselect All" : "Select All"}
            </button>
            <span className="font-sans text-sm text-[#F36B39] font-bold">{selectedIds.length} Selected</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowDeleteModal(true)}
              disabled={selectedIds.length === 0}
              className="font-sans text-sm font-bold bg-red-900/30 text-red-500 px-6 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Delete Selected
            </button>
            <button 
              onClick={() => setShowSaveModal(true)}
              disabled={Object.keys(editedItems).length === 0}
              className="font-sans text-sm font-bold bg-[#00E5B5]/20 text-[#00E5B5] px-6 py-2 rounded-lg hover:bg-[#00E5B5] hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Top filters */}
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

        {/* Categories Tabs (Desktop) */}
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
          <div 
            key={item.id} 
            onClick={() => toggleSelect(item.id)}
            className={`relative bg-[#2D1B10] border rounded-[1rem] md:rounded-2xl overflow-hidden transition-colors group shadow-lg flex flex-col h-full md:h-[380px] cursor-pointer ${
              selectedIds.includes(item.id) ? 'border-[#00E5B5]' : 'border-[#4A2F1D] hover:border-[#F36B39]'
            }`}
          >
            
            {/* Checkbox */}
            <div className="absolute top-2 right-2 md:top-3 md:right-3 z-[60]" onClick={e => e.stopPropagation()}>
              <input 
                type="checkbox" 
                checked={selectedIds.includes(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="w-4 h-4 md:w-6 md:h-6 accent-[#F36B39] cursor-pointer shadow-xl"
              />
            </div>

            <div className="h-28 sm:h-32 md:h-48 w-full overflow-hidden bg-black shrink-0 relative">
              <img src={item.image.startsWith('http') ? item.image : (item.image.startsWith('/') && !item.image.startsWith('/uploads') ? item.image : `http://localhost:3000${item.image}?v=2`)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B10] to-transparent pointer-events-none"></div>
            </div>
            <div className="p-2 sm:p-4 md:p-6 font-sans relative z-10 flex flex-col flex-1 justify-between gap-1.5 md:gap-2">
              <div className="flex items-start gap-1.5 md:gap-3 w-full">
                {/* Veg / Non-Veg Indicator */}
                <div className={`mt-[2px] md:mt-2 shrink-0 w-3 h-3 md:w-4 md:h-4 rounded-sm border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                  <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                </div>
                {/* Editable Name */}
                <div onClick={e => e.stopPropagation()} className="w-full">
                  <input 
                    type="text"
                    value={editedItems[item.id]?.name ?? item.name}
                    onChange={e => handleEdit(item.id, 'name', e.target.value)}
                    className="font-serif text-[13px] sm:text-base md:text-lg text-[#EBE6DD] leading-tight w-full bg-transparent border-b border-transparent focus:border-[#F36B39] focus:outline-none focus:bg-white/5 px-1 py-1 rounded-t-sm transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-auto" onClick={e => e.stopPropagation()}>
                <span className="text-[#F36B39] font-bold">₹</span>
                {/* Editable Price */}
                <input 
                  type="text"
                  value={editedItems[item.id]?.priceText ?? item.priceText}
                  onChange={e => handleEdit(item.id, 'priceText', e.target.value)}
                  className="text-[#F36B39] font-sans font-bold text-xs sm:text-sm md:text-base w-full bg-transparent border-b border-transparent focus:border-[#F36B39] focus:outline-none focus:bg-white/5 px-1 py-1 rounded-t-sm transition-colors"
                />
              </div>
            </div>
            
            {/* Liquid Glass Border Overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-[1rem] md:rounded-2xl shadow-[inset_0_0_10px_rgba(255,255,255,0.08),inset_0_0_3px_rgba(255,255,255,0.15)] md:shadow-[inset_0_0_20px_rgba(255,255,255,0.08),inset_0_0_5px_rgba(255,255,255,0.15)] z-50 transition-all duration-500 group-hover:bg-white/5"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
