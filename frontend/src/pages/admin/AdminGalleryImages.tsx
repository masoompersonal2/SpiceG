import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryImage {
  id: number;
  row: number;
  title: string;
  image: string;
  createdAt: string;
}

export function AdminGalleryImages() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rowFilter, setRowFilter] = useState("All");
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchImages = () => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/gallery-image`)
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      window.location.replace("/admin/login");
      return;
    }
    fetchImages();
  }, []);

  const filteredImages = images
    .filter(img => img.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(img => {
      if (rowFilter === "All") return true;
      return img.row.toString() === rowFilter.replace("Row ", "");
    });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredImages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredImages.map(i => i.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/gallery-image/bulk-delete`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds })
    });
    
    if (res.ok) {
      setToastMessage("Images deleted successfully.");
      setSelectedIds([]);
      fetchImages();
    } else {
      setToastMessage("Error deleting images.");
    }
    setShowDeleteModal(false);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const resolveImageUrl = (url: string | undefined) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${url}?v=2`;
  };

  return (
    <div className="min-h-screen bg-[#F6EEED] text-gray-800 font-sans py-16 px-4 md:px-8 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-[#2D211F] text-[#00E5B5] px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
              <p className="text-gray-500 mb-8 font-medium">Are you sure you want to permanently delete {selectedIds.length} selected image{selectedIds.length === 1 ? '' : 's'}?</p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Back Button */}
      <button 
        onClick={() => window.location.href = "/admin/dashboard?tab=5"}
        className="fixed top-4 left-4 md:top-6 md:left-6 text-gray-500 hover:text-gray-800 flex items-center gap-2 transition-colors text-sm font-bold group z-50 bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-200 shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        Back
      </button>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto mt-8">
        
        {/* Header Controls */}
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 sticky top-4 z-40">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            {/* Selection Info */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button onClick={handleSelectAll} className="font-bold bg-gray-50 px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors shrink-0">
                {selectedIds.length === filteredImages.length && filteredImages.length > 0 ? "Deselect All" : "Select All"}
              </button>
              <span className="text-sm font-bold text-[#E04D2D] shrink-0">{selectedIds.length} Selected</span>
              
              {selectedIds.length > 0 && (
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="ml-auto md:ml-4 text-sm font-bold bg-red-50 text-red-500 px-6 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                >
                  Delete Selected
                </button>
              )}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input 
                  type="text" 
                  placeholder="Search image title..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-[#E04D2D] transition-colors"
                />
              </div>
              <select 
                value={rowFilter}
                onChange={(e) => setRowFilter(e.target.value)}
                className="w-full sm:w-48 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-[#E04D2D] cursor-pointer"
              >
                <option value="All">All Rows</option>
                <option value="1">Row 1</option>
                <option value="2">Row 2</option>
                <option value="3">Row 3</option>
              </select>
            </div>

          </div>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map(img => (
            <div 
              key={img.id} 
              onClick={() => toggleSelect(img.id)}
              className={`bg-white border rounded-3xl p-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col cursor-pointer ${
                selectedIds.includes(img.id) ? 'border-[#E04D2D] ring-2 ring-[#E04D2D]/20' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Checkbox */}
              <div className="absolute top-4 right-4 z-10" onClick={e => e.stopPropagation()}>
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(img.id)}
                  onChange={() => toggleSelect(img.id)}
                  className="w-5 h-5 accent-[#E04D2D] cursor-pointer"
                />
              </div>

              <div className="w-full h-40 bg-gray-100 rounded-xl overflow-hidden mb-4 relative group">
                <img src={resolveImageUrl(img.image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>

              <div>
                <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1 truncate">{img.title || "Untitled Image"}</h4>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#E04D2D] bg-[#E04D2D]/10 px-2 py-1 rounded-md">Row {img.row}</span>
                  <span className="text-xs text-gray-400 font-medium">{new Date(img.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredImages.length === 0 && (
          <div className="text-center py-20 text-gray-400 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            No images found matching your filters.
          </div>
        )}

      </div>
    </div>
  );
}
