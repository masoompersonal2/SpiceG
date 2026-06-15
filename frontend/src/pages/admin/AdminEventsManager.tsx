import { useState, useEffect } from "react";
import { Search, ChevronDown, Trash2, Edit3, CheckCircle, XCircle } from "lucide-react";

export function AdminEventsManager({ onBack, showToast }: { onBack: () => void, showToast: (msg: string) => void }) {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Recent");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/events`);
    if (res.ok) {
      const data = await res.json();
      setEvents(data);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(events.map(ev => ev.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} tickets?`)) return;
        
    try {
      for (const id of selectedIds) {
        await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/events/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers: { }
        });
      }
      showToast("Selected tickets deleted.");
      setSelectedIds([]);
      fetchEvents();
    } catch {
      showToast("Error deleting tickets.");
    }
  };

  const handleToggleEnable = async () => {
    try {
      for (const id of selectedIds) {
        const ev = events.find(e => e.id === id);
        if (ev) {
          await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/events/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {  
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ isEnabled: !ev.isEnabled })
          });
        }
      }
      showToast("Visibility toggled for selected tickets.");
      setSelectedIds([]);
      fetchEvents();
    } catch {
      showToast("Error toggling tickets.");
    }
  };

  const startEdit = (ev: any) => {
    setEditingId(ev.id);
    setEditForm({ ...ev, date: new Date(ev.date).toISOString().split('T')[0] });
  };

  const saveEdit = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/events/${editingId}`, {
      method: "PUT",
      credentials: "include",
      headers: {  
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editForm)
    });
    if (res.ok) {
      showToast("Ticket updated successfully.");
      setEditingId(null);
      fetchEvents();
    } else {
      showToast("Failed to update ticket.");
    }
  };

  const filteredEvents = events
    .filter(ev => ev.title.toLowerCase().includes(search.toLowerCase()) || ev.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (filter === "Recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (filter === "Old") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return 0;
    });

  return (
    <div className="w-full h-full bg-white rounded-[2rem] shadow-sm flex flex-col overflow-hidden border border-gray-100">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50">
        <div>
          <button onClick={onBack} className="text-gray-500 hover:text-black mb-2 flex items-center gap-2 text-sm font-bold">
            ← Back to Header Pages
          </button>
          <h3 className="text-2xl font-bold text-gray-800">Event Tickets Management</h3>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#E04D2D] text-sm"
            />
          </div>
          <div className="relative">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:border-[#E04D2D] text-sm cursor-pointer"
            >
              <option value="Recent">Recent First</option>
              <option value="Old">Oldest First</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#E04D2D]/10 px-6 py-3 flex items-center justify-between border-b border-[#E04D2D]/20">
          <span className="text-sm font-bold text-[#E04D2D]">{selectedIds.length} tickets selected</span>
          <div className="flex gap-2">
            <button onClick={handleToggleEnable} className="text-sm bg-white text-gray-700 px-4 py-1.5 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 font-semibold">
              Toggle Visibility
            </button>
            <button onClick={handleDeleteSelected} className="text-sm bg-red-50 text-red-600 px-4 py-1.5 rounded-lg border border-red-100 shadow-sm hover:bg-red-100 font-semibold flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500">
              <th className="py-3 px-4 w-12">
                <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === events.length && events.length > 0} className="w-4 h-4 rounded border-gray-300 text-[#E04D2D] focus:ring-[#E04D2D]" />
              </th>
              <th className="py-3 px-4">Event Details</th>
              <th className="py-3 px-4">Date & Location</th>
              <th className="py-3 px-4">Pricing & Seats</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(ev => (
              <tr key={ev.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                <td className="py-4 px-4">
                  <input type="checkbox" checked={selectedIds.includes(ev.id)} onChange={() => handleSelect(ev.id)} className="w-4 h-4 rounded border-gray-300 text-[#E04D2D] focus:ring-[#E04D2D]" />
                </td>
                
                {editingId === ev.id ? (
                  /* Edit Mode Row Content */
                  <td colSpan={5} className="py-4 px-4 bg-gray-50">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500 mb-1 block">Title</label>
                        <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full border rounded p-1 text-sm" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500 mb-1 block">Subtitle</label>
                        <input type="text" value={editForm.subtitle} onChange={e => setEditForm({...editForm, subtitle: e.target.value})} className="w-full border rounded p-1 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Date</label>
                        <input type="date" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} className="w-full border rounded p-1 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Location</label>
                        <input type="text" value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} className="w-full border rounded p-1 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Price</label>
                        <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} className="w-full border rounded p-1 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Total Seats</label>
                        <input type="number" value={editForm.totalSeats} onChange={e => setEditForm({...editForm, totalSeats: Number(e.target.value)})} className="w-full border rounded p-1 text-sm" />
                      </div>
                      <div className="col-span-full flex justify-end gap-2 mt-2">
                        <button onClick={() => setEditingId(null)} className="px-4 py-1.5 text-sm bg-gray-200 rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
                        <button onClick={saveEdit} className="px-4 py-1.5 text-sm bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600">Save</button>
                      </div>
                    </div>
                  </td>
                ) : (
                  /* Display Mode Row Content */
                  <>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img src={ev.image?.startsWith('http') ? ev.image : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${ev.image}?v=2`} className="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                        <div>
                          <p className="font-bold text-gray-800 line-clamp-1">{ev.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{ev.subtitle || 'No subtitle'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-semibold text-gray-700">{new Date(ev.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{ev.location}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-bold text-gray-800">₹{ev.price}</p>
                      <p className="text-xs text-gray-500">{ev.bookedSeats} / {ev.totalSeats} booked</p>
                    </td>
                    <td className="py-4 px-4">
                      {ev.isEnabled ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full"><CheckCircle className="w-3 h-3"/> Active</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full"><XCircle className="w-3 h-3"/> Hidden</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button onClick={() => startEdit(ev)} className="p-2 text-gray-400 hover:text-[#E04D2D] transition-colors rounded-full hover:bg-[#E04D2D]/10">
                        <Edit3 className="w-5 h-5" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {filteredEvents.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400">No events found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
