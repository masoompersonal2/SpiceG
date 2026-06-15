import { useState, useEffect } from "react";

export function AdminDeliveryFriendsList({ onBack }: { onBack?: () => void }) {
  const [friends, setFriends] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/admin/delivery-friends`, { credentials: "include" });
    if (res.ok) setFriends(await res.json());
  };

  const handleUpdate = async (id: number, e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/admin/delivery-friends/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        mobile: formData.get("mobile"),
        address: formData.get("address"),
      })
    });
    setEditingId(null);
    fetchFriends();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to fire this Delivery Partner permanently?")) {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/admin/delivery-friends/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      fetchFriends();
    }
  };

  const filtered = friends.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.uniqueId.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#F6EEED] flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => onBack ? onBack() : window.location.href = "/admin/dashboard"} className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Delivery Partners Directory</h1>
        </div>
        <div className="relative w-full max-w-sm hidden md:block">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-12 pr-4 focus:outline-none focus:border-[#E04D2D] transition-colors"
          />
        </div>
      </header>

      <div className="p-6 md:hidden">
        <input 
          type="text" 
          placeholder="Search..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E04D2D]"
        />
      </div>

      <main className="flex-1 p-6 overflow-y-auto max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(friend => (
            <div key={friend.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#E04D2D]"></div>
              {editingId === friend.id ? (
                <form onSubmit={(e) => handleUpdate(friend.id, e)} className="space-y-4">
                  <input name="name" defaultValue={friend.name} required className="w-full px-3 py-2 border rounded-lg text-sm font-bold" />
                  <input name="mobile" defaultValue={friend.mobile} required className="w-full px-3 py-2 border rounded-lg text-sm" />
                  <input name="email" defaultValue={friend.email} required className="w-full px-3 py-2 border rounded-lg text-sm" />
                  <textarea name="address" defaultValue={friend.address} required className="w-full px-3 py-2 border rounded-lg text-sm" />
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-green-500 text-white font-bold py-2 rounded-lg">Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-lg">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-start gap-4 mb-4">
                    <img src={friend.profileImage || "https://i.pravatar.cc/150"} className="w-16 h-16 rounded-2xl object-cover shadow-sm border-2 border-gray-50" />
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">{friend.name}</h3>
                      <p className="text-[#E04D2D] font-black text-sm tracking-widest">{friend.uniqueId}</p>
                      <span className={`inline-block px-3 py-1 mt-1 text-[10px] font-black uppercase tracking-wider rounded-full ${friend.status === 'Available' ? 'bg-green-100 text-green-700' : friend.status === 'Delivering' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                        {friend.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl">
                    <p className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> {friend.mobile}</p>
                    <p className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> {friend.email}</p>
                    <p className="flex items-start gap-2"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> <span className="line-clamp-2 leading-tight">{friend.address}</span></p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setEditingId(friend.id)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-xl transition-colors">Edit</button>
                    <button onClick={() => handleDelete(friend.id)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-xl transition-colors">Fire</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
