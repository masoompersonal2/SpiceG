import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactQuery {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
}

export function AdminQueries() {
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [queryFilter, setQueryFilter] = useState("Recent");
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchQueries = () => {
    const token = localStorage.getItem("adminToken");
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/contact`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setQueries(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      window.location.replace("/admin/login");
      return;
    }
    fetchQueries();
  }, []);

  const filteredQueries = queries
    .filter(q => q.name.toLowerCase().includes(searchQuery.toLowerCase()) || q.email.toLowerCase().includes(searchQuery.toLowerCase()) || q.phone.includes(searchQuery))
    .sort((a, b) => {
      if (queryFilter === "Recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (queryFilter === "Old") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return 0;
    });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredQueries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredQueries.map(i => i.id));
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
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/contact/bulk-delete`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds })
    });
    
    if (res.ok) {
      setToastMessage("Queries deleted successfully.");
      setSelectedIds([]);
      fetchQueries();
    } else {
      setToastMessage("Error deleting queries.");
    }
    setShowDeleteModal(false);
    setTimeout(() => setToastMessage(""), 3000);
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
              <p className="text-gray-500 mb-8 font-medium">Are you sure you want to permanently delete {selectedIds.length} selected quer{selectedIds.length === 1 ? 'y' : 'ies'}?</p>
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
        onClick={() => window.location.href = "/admin/dashboard?tab=4"}
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
                {selectedIds.length === filteredQueries.length && filteredQueries.length > 0 ? "Deselect All" : "Select All"}
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
                  placeholder="Search name, email, or phone..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-[#E04D2D] transition-colors"
                />
              </div>
              <select 
                value={queryFilter}
                onChange={(e) => setQueryFilter(e.target.value)}
                className="w-full sm:w-48 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-[#E04D2D] cursor-pointer"
              >
                <option value="Recent">Recent First</option>
                <option value="Old">Oldest First</option>
              </select>
            </div>

          </div>
        </div>

        {/* Queries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQueries.map(q => (
            <div 
              key={q.id} 
              onClick={() => toggleSelect(q.id)}
              className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col cursor-pointer ${
                selectedIds.includes(q.id) ? 'border-[#E04D2D] ring-2 ring-[#E04D2D]/20' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Checkbox */}
              <div className="absolute top-4 right-4 z-10" onClick={e => e.stopPropagation()}>
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(q.id)}
                  onChange={() => toggleSelect(q.id)}
                  className="w-5 h-5 accent-[#E04D2D] cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-start mb-4 pr-8">
                <div>
                  <h4 className="font-bold text-gray-800 text-lg leading-tight">{q.name}</h4>
                  <p className="text-gray-500 text-sm mt-1">{q.email}</p>
                  <p className="text-gray-400 text-xs mt-1 font-medium">{q.phone}</p>
                </div>
              </div>
              <div className="text-xs font-bold text-gray-400 mb-3 bg-gray-50 self-start px-3 py-1 rounded-full border border-gray-100">
                {new Date(q.createdAt).toLocaleString()}
              </div>
              <div className="flex-1 text-sm text-gray-700 bg-gray-50/50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">
                {q.message}
              </div>
            </div>
          ))}
        </div>
        
        {filteredQueries.length === 0 && (
          <div className="text-center py-20 text-gray-400 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            No queries found matching your filters.
          </div>
        )}

      </div>
    </div>
  );
}
