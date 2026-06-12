import { useState, useEffect } from "react";
import { Search, Plus, Minus, Settings, Calendar, Menu as MenuIcon, ShoppingBag, MapPin, User, LogOut, Upload, Info, Check } from "lucide-react";

// Shared Custom Modal
function Modal({ isOpen, title, desc, onConfirm, onCancel, confirmText = "Confirm", isDestructive = false }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-8">{desc}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-bold transition-colors">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 py-3 rounded-full font-bold transition-colors ${isDestructive ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#B2E624] hover:bg-[#a0d21d] text-black'}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ------------------------ Menu Tab ------------------------
function MenuTab({ cart, setCart }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const CATEGORIES = ["All", "Main Course (Non-Veg)", "Soups", "Starters", "Chinese", "Main Course (Veg)", "Beverages & Salads", "Breads", "Biryani & Rice", "Desserts"];

  useEffect(() => {
    fetch("http://localhost:3000/api/menu").then(r => r.json()).then(setItems);
  }, []);

  const filteredItems = items.filter((item: any) => {
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl p-6 lg:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">Our Menu</h1>
        <div className="flex gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#B2E624]" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-[#B2E624] text-black' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item: any) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all group flex flex-col">
              <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                <img src={item.image.startsWith('http') ? item.image : (item.image.startsWith('/') && !item.image.startsWith('/uploads') ? item.image : `http://localhost:3000${item.image}`)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start gap-2 mb-2">
                  <div className={`mt-1 shrink-0 w-3 h-3 rounded-sm border-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  </div>
                  <h3 className="font-bold text-lg leading-tight line-clamp-2">{item.name}</h3>
                </div>
                <div className="flex items-end justify-between mt-auto pt-4">
                  <p className="text-xl font-extrabold">{/^\d/.test(item.priceText) ? `₹${item.priceText}` : item.priceText}</p>
                  <button 
                    onClick={() => {
                      const existing = cart.find((i: any) => i.id === item.id);
                      if (existing) {
                        setCart(cart.map((i: any) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
                      } else {
                        setCart([...cart, { ...item, quantity: 1 }]);
                      }
                    }}
                    className="bg-[#B2E624] text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-[#a0d21d] transition-colors shadow-lg shadow-[#B2E624]/20 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && <div className="col-span-full py-12 text-center text-gray-500">No dishes found.</div>}
        </div>
      </div>
    </div>
  );
}

// ------------------------ Events Tab ------------------------
function EventsTab() {
  const [events, setEvents] = useState<any[]>([]);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("All Events");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingEvent, setBookingEvent] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/events").then(r => r.json()).then(d => setEvents(d.filter((e:any) => e.isEnabled)));
    fetch("http://localhost:3000/api/customer/auth/events", { credentials: "include" }).then(r => r.json()).then(setMyEvents).catch(() => {});
  }, []);

  const handleBook = async () => {
    if (!bookingEvent) return;
    try {
      const res = await fetch("http://localhost:3000/api/customer/auth/events/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ eventId: bookingEvent.id })
      });
      if (res.ok) {
        // Refresh my events
        fetch("http://localhost:3000/api/customer/auth/events", { credentials: "include" }).then(r => r.json()).then(setMyEvents);
      }
    } finally {
      setBookingEvent(null);
    }
  };

  const displayedEvents = activeTab === "All Events" ? events : myEvents.map((b: any) => b.event).filter(Boolean);
  const filteredEvents = displayedEvents.filter((e: any) => e.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl p-6 lg:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] relative">
      <Modal isOpen={!!bookingEvent} title="Book Event" desc={`Are you sure you want to book a ticket for "${bookingEvent?.title}"?`} onConfirm={handleBook} onCancel={() => setBookingEvent(null)} confirmText="Yes, Book" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">Events</h1>
        <div className="flex gap-3">
          <div className="relative w-full md:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#B2E624]" />
          </div>
          <div className="flex bg-gray-100 rounded-full p-1 shrink-0">
            {["All Events", "My Events"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((ev: any, idx: number) => {
            const booking = activeTab === "My Events" ? myEvents.find((b: any) => b.eventId === ev.id) : null;
            return (
              <div key={`${ev.id}-${idx}`} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all group flex flex-col">
                <div className="h-48 w-full relative overflow-hidden bg-gray-100">
                  <img src={ev.image.startsWith('http') ? ev.image : `http://localhost:3000${ev.image}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={ev.title} />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md rounded-xl p-2 flex flex-col items-center justify-center min-w-[50px] shadow-sm">
                    <span className="text-gray-500 text-[10px] font-bold uppercase">{new Date(ev.date).toLocaleString('default', {month:'short'})}</span>
                    <span className="text-black text-lg font-black leading-none">{new Date(ev.date).getDate()}</span>
                  </div>
                  {activeTab === "My Events" && booking && (
                    <div className="absolute top-3 right-3 bg-[#B2E624] text-black px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {booking.status}
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-1 text-gray-500 text-xs font-bold uppercase mb-3"><MapPin className="w-3 h-3" /> {ev.location}</div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{ev.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6">{ev.subtitle}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black">₹{ev.price}</span>
                      <span className="text-xs text-gray-500 ml-1">/ticket</span>
                    </div>
                    {activeTab === "All Events" ? (
                      <button onClick={() => setBookingEvent(ev)} className="bg-[#B2E624] text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#a0d21d] transition-colors shadow-lg shadow-[#B2E624]/20">
                        Book Now
                      </button>
                    ) : (
                      <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold text-gray-600">
                        {booking?.tickets} Ticket(s)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredEvents.length === 0 && <div className="col-span-full py-12 text-center text-gray-500">No events found.</div>}
        </div>
      </div>
    </div>
  );
}

// ------------------------ Reservations Tab ------------------------
function ReservationsTab() {
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/reservations/my", { credentials: "include" })
      .then(r => r.json()).then(setReservations).catch(() => {});
  }, []);

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl p-6 lg:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
      <h1 className="text-2xl font-bold mb-8">My Reservations</h1>
      
      <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide">
        {reservations.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No reservations found.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {reservations.map((res: any) => (
              <div key={res.id} className="border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{res.date} at {res.time}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      res.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      res.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                  <div className="text-gray-500 text-sm flex gap-4">
                    <span><User className="inline w-3 h-3 mr-1"/>{res.name}</span>
                    <span><Info className="inline w-3 h-3 mr-1"/>{res.phone}</span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400">
                  Booked on {new Date(res.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------ Settings Tab ------------------------
function SettingsTab({ user, onUpdate }: any) {
  const [profile, setProfile] = useState({ fullName: user.fullName||'', mobile: user.mobile||'', location: user.location||'', profileImage: user.profileImage||'' });
  const [pass, setPass] = useState({ previousPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleProfileSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/customer/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setMsg({ text: "Profile updated successfully", type: "success" });
        onUpdate();
      } else throw new Error();
    } catch {
      setMsg({ text: "Failed to update profile", type: "error" });
    }
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handlePassSubmit = async (e: any) => {
    e.preventDefault();
    if (pass.newPassword !== pass.confirmPassword) return setMsg({ text: "Passwords don't match", type: "error" });
    try {
      const res = await fetch("http://localhost:3000/api/customer/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ previousPassword: pass.previousPassword, newPassword: pass.newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: "Password updated successfully", type: "success" });
        setPass({ previousPassword: '', newPassword: '', confirmPassword: '' });
      } else throw new Error(data.message);
    } catch(err:any) {
      setMsg({ text: err.message || "Failed to update password", type: "error" });
    }
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.append("image", file);
    try {
      const res = await fetch("http://localhost:3000/api/customer/auth/upload", { method: "POST", credentials: "include", body: fd });
      const data = await res.json();
      if (res.ok) setProfile({ ...profile, profileImage: data.imageUrl });
    } catch {}
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl p-6 lg:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
      {msg.text && (
        <div className={`absolute top-6 right-6 px-6 py-3 rounded-full text-sm font-bold shadow-lg z-50 animate-in fade-in slide-in-from-top-4 ${msg.type === 'success' ? 'bg-[#B2E624] text-black' : 'bg-red-500 text-white'}`}>
          {msg.text}
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-8">Account Settings</h1>
      
      <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide flex flex-col lg:flex-row gap-12">
        
        {/* Profile Section */}
        <div className="flex-1 max-w-xl">
          <h2 className="text-lg font-bold mb-6">Profile Details</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden relative border-4 border-white shadow-sm">
                {profile.profileImage ? <img src={`http://localhost:3000${profile.profileImage}`} className="w-full h-full object-cover" /> : <User className="w-10 h-10 m-6 text-gray-400" />}
              </div>
              <div>
                <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF up to 2MB</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input required type="text" value={profile.fullName} onChange={e=>setProfile({...profile, fullName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B2E624]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                <input required type="text" value={profile.mobile} onChange={e=>setProfile({...profile, mobile: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B2E624]" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <input required type="text" value={profile.location} onChange={e=>setProfile({...profile, location: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B2E624]" />
              </div>
            </div>
            <button type="submit" className="px-8 py-3 bg-[#B2E624] text-black font-bold rounded-xl hover:bg-[#a0d21d] transition-colors shadow-lg shadow-[#B2E624]/20">Save Profile</button>
          </form>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-[1px] bg-gray-100 self-stretch"></div>

        {/* Password Section */}
        <div className="flex-1 max-w-xl">
          <h2 className="text-lg font-bold mb-6">Security</h2>
          <form onSubmit={handlePassSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Previous Password</label>
              <input required type="password" value={pass.previousPassword} onChange={e=>setPass({...pass, previousPassword: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B2E624]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <input required type="password" value={pass.newPassword} onChange={e=>setPass({...pass, newPassword: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B2E624]" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input required type="password" value={pass.confirmPassword} onChange={e=>setPass({...pass, confirmPassword: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B2E624]" />
            </div>
            <button type="submit" className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg">Update Password</button>
          </form>
        </div>

      </div>
    </div>
  );
}

// ------------------------ Main Component ------------------------
export function CustomerDashboard() {
  const queryParams = new URLSearchParams(window.location.search);
  const initialTab = queryParams.get("tab") || "Menu";
  const [currentTab, setCurrentTab] = useState(initialTab);

  // Update URL silently when tab changes
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    window.history.replaceState(null, '', `?tab=${tab}`);
  };

  const [user, setUser] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [attemptingToLeave, setAttemptingToLeave] = useState(false);
  const [reservationSuccessMsg, setReservationSuccessMsg] = useState("");

  useEffect(() => {
    // Process any pending reservations
    const pending = localStorage.getItem("pendingReservation");
    if (pending) {
      try {
        const payload = JSON.parse(pending);
        fetch("http://localhost:3000/api/reservations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }).then(() => {
          localStorage.removeItem("pendingReservation");
          setReservationSuccessMsg("Table Booked Successfully!");
          setTimeout(() => setReservationSuccessMsg(""), 4000);
        });
      } catch (e) {
        localStorage.removeItem("pendingReservation");
      }
    }

    // Trap the browser back button
    window.history.pushState({ page: 'dashboard' }, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState({ page: 'dashboard' }, '', window.location.href);
      setAttemptingToLeave(true);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/customer/auth/me", { credentials: "include" });
      if (!res.ok) throw new Error();
      setUser(await res.json());
    } catch {
      window.location.replace("/auth");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/customer/auth/logout", { method: "POST", credentials: "include" });
      window.location.replace("/");
    } catch {
      window.location.replace("/");
    }
  };

  if (!user) return <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#B2E624] border-t-transparent rounded-full animate-spin"></div></div>;

  const tabs = [
    { id: "Menu", icon: MenuIcon },
    { id: "Orders", icon: ShoppingBag },
    { id: "Events", icon: Calendar },
    { id: "Reservations", icon: MapPin },
    { id: "Settings", icon: Settings },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FB] font-sans text-[#1A1A1A] overflow-hidden">
      {reservationSuccessMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-black text-[#B2E624] rounded-full text-lg font-bold shadow-2xl z-[300] animate-in slide-in-from-top-10 fade-in duration-500 flex items-center gap-3">
          <Check className="w-6 h-6" />
          {reservationSuccessMsg}
        </div>
      )}
      <Modal isOpen={attemptingToLeave} title="Leave Dashboard?" desc="Are you sure you want to go back to the home page?" onConfirm={() => window.location.replace("/")} onCancel={() => setAttemptingToLeave(false)} confirmText="Yes, Leave" isDestructive={true} />
      <Modal isOpen={isLoggingOut} title="Sign Out" desc="Are you sure you want to sign out from your account?" onConfirm={handleLogout} onCancel={() => setIsLoggingOut(false)} confirmText="Yes, Sign Out" isDestructive={true} />
      
      {/* Fixed Top Header */}
      <header className="bg-white px-6 md:px-8 py-4 flex items-center justify-between border-b border-gray-100 shrink-0 z-50 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B2E624] flex items-center justify-center shadow-lg shadow-[#B2E624]/20">
            <span className="text-black font-black text-xl leading-none">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight">SpiceGarden</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-2 text-[15px] font-medium text-gray-500 bg-gray-50 p-1.5 rounded-full">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => handleTabChange(t.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${currentTab === t.id ? 'bg-white text-black shadow-sm' : 'hover:text-black hover:bg-gray-100/50'}`}>
                <Icon className="w-4 h-4" /> {t.id}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={() => setIsLoggingOut(true)} className="hidden md:flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
          {user.profileImage ? (
            <img src={`http://localhost:3000${user.profileImage}`} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm"><User className="w-5 h-5 text-gray-400" /></div>
          )}
        </div>
      </header>

      {/* Main Scrollable Content Layout */}
      <main className="flex-1 overflow-y-auto w-full p-4 md:p-8 relative">
        <div className={`max-w-[1600px] mx-auto h-full grid ${currentTab === "Menu" ? "lg:grid-cols-[1fr_350px]" : "grid-cols-1"} gap-6 lg:gap-8`}>
          
          {/* Left Area - Active Tab Content */}
          <div className="h-full overflow-hidden">
            {currentTab === "Menu" && <MenuTab cart={cart} setCart={setCart} />}
            {currentTab === "Events" && <EventsTab />}
            {currentTab === "Reservations" && <ReservationsTab />}
            {currentTab === "Settings" && <SettingsTab user={user} onUpdate={fetchUser} />}
            {currentTab === "Orders" && (
              <div className="h-full flex flex-col bg-white rounded-3xl p-6 lg:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No Past Orders</h2>
                <p className="text-gray-500 max-w-sm">You haven't placed any online orders yet. Explore our menu to discover delicious meals!</p>
              </div>
            )}
          </div>

          {/* Right Sidebar - My Cart (Only visible on Menu tab) */}
          {currentTab === "Menu" && (
            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)] flex flex-col h-full overflow-hidden">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h2 className="text-xl font-bold">My Cart {cart.length > 0 && <span className="text-[#B2E624] text-sm bg-black px-2 py-0.5 rounded-full ml-2">{cart.reduce((a: number, b: any) => a + b.quantity, 0)}</span>}</h2>
                <button onClick={() => setCart([])} className="text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full hover:bg-gray-100 hover:text-red-500 transition-colors">Clear All</button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">Your cart is empty</h3>
                    <p className="text-sm text-gray-500">Looks like you haven't added anything to your cart yet.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {cart.map((item: any) => (
                      <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <img src={item.image.startsWith('http') ? item.image : `http://localhost:3000${item.image}`} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1">
                          <h4 className="font-bold text-sm leading-tight mb-1">{item.name}</h4>
                          <div className="text-xs text-gray-500 mb-2">₹{item.priceText.replace(/[^\d]/g, '')}</div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => {
                              if (item.quantity > 1) {
                                setCart(cart.map((i: any) => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i));
                              } else {
                                setCart(cart.filter((i: any) => i.id !== item.id));
                              }
                            }} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold">{item.quantity}</span>
                            <button onClick={() => {
                              setCart(cart.map((i: any) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
                            }} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="font-bold text-sm">
                          ₹{(parseInt(item.priceText.replace(/[^\d]/g, '')) * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 shrink-0">
                <div className="flex justify-between text-sm font-medium text-gray-500 mb-4">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">
                    ₹{cart.reduce((total: number, item: any) => total + (parseInt(item.priceText.replace(/[^\d]/g, '')) * item.quantity), 0).toLocaleString()}
                  </span>
                </div>
                <button disabled={cart.length === 0} className={`w-full py-4 font-bold rounded-full transition-colors ${cart.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}>
                  Checkout
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
