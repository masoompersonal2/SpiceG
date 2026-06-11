import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  status: string;
}

export function AdminApprovedReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchReservations = () => {
    const token = localStorage.getItem("adminToken");
    fetch("http://localhost:3000/api/reservations", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Filter ONLY approved
        setReservations(data.filter((r: Reservation) => r.status === "Approved"));
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      window.location.replace("/admin/login");
      return;
    }
    fetchReservations();
  }, []);

  const filteredItems = reservations.filter(item => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.phone.includes(searchQuery);
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

  const confirmDelete = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await fetch("http://localhost:3000/api/reservations/bulk-delete", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds })
    });
    
    if (res.ok) {
      setToastMessage("Reservations deleted successfully.");
      setSelectedIds([]);
      fetchReservations();
    }
    setShowDeleteModal(false);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F6EEED] font-sans py-12 px-4 md:px-8 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-[#2D211F] text-[#00E5B5] px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-3"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white p-8 rounded-[2rem] max-w-sm w-full shadow-2xl">
              <h3 className="font-bold text-2xl text-gray-800 mb-4">Confirm Deletion</h3>
              <p className="text-gray-500 mb-8">Are you sure you want to permanently delete {selectedIds.length} selected reservation(s)?</p>
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
        onClick={() => window.location.href = "/admin/dashboard?tab=3"}
        className="fixed top-4 left-4 md:top-6 md:left-6 text-gray-500 hover:text-gray-800 flex items-center gap-2 transition-colors font-bold z-50 bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        Back
      </button>

      <div className="max-w-5xl mx-auto pt-10">
        
        <h2 className="text-3xl font-bold text-[#2D211F] mb-8 text-center md:text-left">Approved Reservations</h2>

        {/* Admin Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <button onClick={handleSelectAll} className="text-sm font-bold bg-gray-100 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors">
              {selectedIds.length === filteredItems.length && filteredItems.length > 0 ? "Deselect All" : "Select All"}
            </button>
            <span className="text-sm text-[#E04D2D] font-bold">{selectedIds.length} Selected</span>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                placeholder="Search name or phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-[#E04D2D] transition-colors"
              />
            </div>
            <button 
              onClick={() => setShowDeleteModal(true)}
              disabled={selectedIds.length === 0}
              className="shrink-0 text-sm font-bold bg-red-100 text-red-600 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Delete Selected
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(res => (
            <div 
              key={res.id} 
              onClick={() => toggleSelect(res.id)}
              className={`bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative cursor-pointer ${selectedIds.includes(res.id) ? 'border-green-500 ring-2 ring-green-500/20' : 'border-gray-200'}`}
            >
              {/* Checkbox */}
              <div className="absolute top-4 right-4" onClick={e => e.stopPropagation()}>
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(res.id)}
                  onChange={() => toggleSelect(res.id)}
                  className="w-5 h-5 accent-green-500 cursor-pointer"
                />
              </div>

              <div className="mb-4 pr-8">
                <h4 className="font-bold text-gray-800 text-lg leading-tight">{res.name}</h4>
                <p className="text-gray-500 text-sm mt-1">{res.phone}</p>
                {res.email && <p className="text-gray-400 text-xs mt-1">{res.email}</p>}
              </div>
              <div className="flex gap-4 items-center text-sm font-medium text-gray-600 bg-green-50 p-3 rounded-xl border border-green-100">
                <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> {res.date}</span>
                <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {res.time}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-400 font-medium">
            No approved reservations found.
          </div>
        )}

      </div>
    </div>
  );
}
