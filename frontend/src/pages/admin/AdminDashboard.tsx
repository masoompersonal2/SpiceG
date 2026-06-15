import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminContentTab } from "./AdminContentTab";
import { AdminHeaderPagesTab } from "./AdminHeaderPagesTab";
import { AdminMenuItems } from "./AdminMenuItems";
import { AdminQueries } from "./AdminQueries";
import { AdminDeliveryFriendsList } from "./AdminDeliveryFriendsList";
import { AdminGalleryImages } from "./AdminGalleryImages";
import { Modal } from "../../components/ui/Modal";

const TimeSelector = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  const [h, m] = (value || "12:00").split(":");
  const hour24 = parseInt(h, 10);
  const hour12 = hour24 % 12 || 12;
  const ampm = hour24 >= 12 ? "PM" : "AM";
  const minute = m;

  const handleUpdate = (newH12: string, newM: string, newAmPm: string) => {
    let h24 = parseInt(newH12, 10);
    if (newAmPm === "PM" && h24 !== 12) h24 += 12;
    if (newAmPm === "AM" && h24 === 12) h24 = 0;
    onChange(`${h24.toString().padStart(2, '0')}:${newM}`);
  };

  return (
    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-2 py-1 shadow-sm">
      <select value={hour12.toString().padStart(2, '0')} onChange={e => handleUpdate(e.target.value, minute, ampm)} className="bg-transparent focus:outline-none cursor-pointer text-gray-700 font-medium">
        {Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
      </select>
      <span className="text-gray-400 font-bold">:</span>
      <select value={minute} onChange={e => handleUpdate(hour12.toString(), e.target.value, ampm)} className="bg-transparent focus:outline-none cursor-pointer text-gray-700 font-medium">
        {["00", "15", "30", "45"].map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={ampm} onChange={e => handleUpdate(hour12.toString(), minute, e.target.value)} className="bg-transparent text-[#E04D2D] font-bold focus:outline-none cursor-pointer">
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export function AdminDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [adminView, setAdminView] = useState<'main' | 'menu-list' | 'queries-list' | 'delivery-list' | 'gallery-list'>('main');
  const [attemptingToLeave, setAttemptingToLeave] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Prevent accidental back button navigation
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setAttemptingToLeave(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const [profile, setProfile] = useState({ username: "Admin User", profileImage: "https://i.pravatar.cc/150?img=47" });
  
  // Profile Update State
  const [updateUsername, setUpdateUsername] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Menu Item State
  const [menuName, setMenuName] = useState("");
  const [menuCategory, setMenuCategory] = useState("Main Course (Non-Veg)");
  const [menuIsVeg, setMenuIsVeg] = useState("false");
  const [menuPriceText, setMenuPriceText] = useState("");
  const [menuImage, setMenuImage] = useState<File | null>(null);

  // Reservations State
  const [reservations, setReservations] = useState<any[]>([]);
  const [resSearchQuery, setResSearchQuery] = useState("");
  const [resFilter, setResFilter] = useState("Recent");
  const [resStatusTab, setResStatusTab] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');

  // Settings State
  const [settings, setSettings] = useState({ openTime: "18:00", closeTime: "23:00" });

  // Contact Requests (Queries) State
  const [queries, setQueries] = useState<any[]>([]);
  const [querySearch, setQuerySearch] = useState("");
  const [queryFilter, setQueryFilter] = useState("Recent");

  // Staff Requests State
  const [staffRequests, setStaffRequests] = useState<any[]>([]);
  const [deliveryRequests, setDeliveryRequests] = useState<any[]>([]);

  // Delivery Partner Hiring States
  const [idInputType, setIdInputType] = useState<"url" | "file">("url");
  const [resumeInputType, setResumeInputType] = useState<"url" | "file">("url");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [resumeUploadFile, setResumeUploadFile] = useState<File | null>(null);

  const [toastMessage, setToastMessage] = useState("");

  // Reservation Custom Pricing
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedResId, setSelectedResId] = useState<number | null>(null);
  const [customPrice, setCustomPrice] = useState("");

  const CATEGORIES = [
    "Main Course (Non-Veg)", "Soups", "Starters", "Chinese", 
    "Main Course (Veg)", "Beverages & Salads", "Breads", 
    "Biryani & Rice", "Desserts"
  ];

  useEffect(() => {
    const checkSession = () => {
      if (!sessionStorage.getItem("adminSession")) {
        window.location.replace("/admin/login");
      }
    };
    checkSession();
    window.addEventListener("pageshow", checkSession);

    // Profile verification acts as the guard now
    fetchProfile();
    
    // Read tab from URL if present
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam !== null) {
      setActiveTab(parseInt(tabParam, 10));
    }
    
    return () => {
      window.removeEventListener("pageshow", checkSession);
    };
  }, []);

  const fetchProfile = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
      const res = await fetch(`${apiUrl}/admin/profile`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          username: data.username,
          profileImage: data.profileImage ? (data.profileImage.startsWith('http') ? data.profileImage : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${data.profileImage}?v=2`) : "https://i.pravatar.cc/150?img=47"
        });
        setUpdateUsername(data.username);
        setIsAuthenticated(true);
      } else if (res.status === 401) {
        window.location.replace("/admin/login");
      }
    } catch (e) {
      console.error(e);
      window.location.replace("/admin/login");
    }
  };

  const handleLogout = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
    sessionStorage.removeItem("adminSession");
    await fetch(`${apiUrl}/auth/logout`, { method: "POST", credentials: "include" });
    window.location.replace("/");
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
    
    // Upload image first if selected
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      
      await fetch(`${apiUrl}/admin/upload`, {
        method: "POST",
        credentials: "include",
        body: formData
      });
    }

    // Update credentials
    await fetch(`${apiUrl}/admin/profile`, {
      method: "PUT",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: updateUsername,
        password: updatePassword || undefined
      })
    });

    setUpdatePassword("");
    setSelectedFile(null);
    fetchProfile();
    
    setToastMessage("Profile updated successfully!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleAddMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuImage) {
      setToastMessage("Please select an image!");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
    const formData = new FormData();
    formData.append("name", menuName);
    formData.append("category", menuCategory);
    formData.append("isVeg", menuIsVeg);
    formData.append("priceText", menuPriceText);
    formData.append("image", menuImage);

    const res = await fetch(`${apiUrl}/menu`, {
      method: "POST",
      credentials: "include",
      body: formData
    });

    if (res.ok) {
      setToastMessage("Menu Item Added!");
      setTimeout(() => setToastMessage(""), 3000);
      setMenuName("");
      setMenuPriceText("");
      setMenuImage(null);
    } else {
      setToastMessage("Error adding item.");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const fetchReservations = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
    const res = await fetch(`${apiUrl}/reservations`, {
      credentials: "include"
    });
    if (res.ok) {
      const data = await res.json();
      setReservations(data);
    }
  };

  const fetchSettings = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/settings`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.openTime) setSettings(data);
    }
  };

  const fetchQueries = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
    const res = await fetch(`${apiUrl}/contact`, {
      credentials: "include"
    });
    if (res.ok) {
      const data = await res.json();
      setQueries(data);
    }
  };

  const saveSettings = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
    const res = await fetch(`${apiUrl}/settings`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    if (res.ok) {
      setToastMessage("Settings Updated!");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  useEffect(() => {
    if (activeTab === 3) {
      fetchReservations();
      fetchSettings();
    }
    if (activeTab === 4) {
      fetchQueries();
    }
    if (activeTab === 6) {
      fetchStaffRequests();
    }
  }, [activeTab]);

  const fetchStaffRequests = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
    const res = await fetch(`${apiUrl}/admin/credential-requests`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setStaffRequests(data);
    }
    const resDel = await fetch(`${apiUrl}/admin/delivery-friends/requests-detailed`, { credentials: "include" });
    if (resDel.ok) {
      setDeliveryRequests(await resDel.json());
    }
  };

  const handleStaffRequest = async (id: number, action: 'approve' | 'reject') => {
    const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
    const res = await fetch(`${apiUrl}/admin/credential-requests/${id}/${action}`, {
      method: "PUT",
      credentials: "include"
    });
    if (res.ok) {
      setToastMessage(`Request ${action}d successfully`);
      setTimeout(() => setToastMessage(""), 3000);
      fetchStaffRequests();
    }
  };

  const handleDeliveryRequest = async (id: number, action: 'approve' | 'reject') => {
    const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
    const res = await fetch(`${apiUrl}/admin/delivery-friends/requests/${id}/${action}`, {
      method: "PUT",
      credentials: "include"
    });
    if (res.ok) {
      setToastMessage(`Delivery Partner Request ${action}d successfully`);
      setTimeout(() => setToastMessage(""), 3000);
      fetchStaffRequests();
    }
  };

  const updateReservationStatus = async (id: number, status: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
    await fetch(`${apiUrl}/reservations/${id}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    fetchReservations();
  };

  const handleAcceptWithPrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResId || !customPrice) return;
    
    const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
    const res = await fetch(`${apiUrl}/reservations/${selectedResId}/accept-with-price`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseInt(customPrice) })
    });
    
    if (res.ok) {
      setToastMessage("Reservation accepted with custom price.");
      setTimeout(() => setToastMessage(""), 3000);
      setShowPriceModal(false);
      setSelectedResId(null);
      setCustomPrice("");
      fetchReservations();
    } else {
      alert("Failed to update reservation");
    }
  };

  const filteredReservations = reservations
    .filter(res => res.name.toLowerCase().includes(resSearchQuery.toLowerCase()) || res.phone.includes(resSearchQuery))
    .filter(res => {
      if (resStatusTab === 'Approved') return res.status === 'Approved';
      if (resStatusTab === 'Rejected') return res.status === 'Rejected';
      
      // If Pending tab, check resFilter
      if (res.status === 'Approved' || res.status === 'Rejected') return false; // Hide from pending
      if (resFilter === "Recent") return true; // Show all sorted by creation
      if (resFilter === "Pending") return res.status === "Pending" || res.status === "New";
      return true;
    });

  const filteredQueries = queries
    .filter(q => q.name.toLowerCase().includes(querySearch.toLowerCase()) || q.email.toLowerCase().includes(querySearch.toLowerCase()))
    .sort((a, b) => {
      if (queryFilter === "Recent") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (queryFilter === "Old") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return 0;
    });



  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F6EEED] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E04D2D]"></div>
      </div>
    );
  }

  if (adminView === 'menu-list') {
    return <AdminMenuItems onBack={() => setAdminView('main')} />;
  }
  if (adminView === 'queries-list') {
    return <AdminQueries onBack={() => setAdminView('main')} />;
  }
  if (adminView === 'delivery-list') {
    return <AdminDeliveryFriendsList onBack={() => setAdminView('main')} />;
  }
  if (adminView === 'gallery-list') {
    return <AdminGalleryImages onBack={() => setAdminView('main')} />;
  }

  return (
    <div className="min-h-screen bg-[#F6EEED] font-sans flex relative overflow-hidden">
      <Modal isOpen={attemptingToLeave} title="Leave Dashboard?" desc="Are you sure you want to go back to the home page?" onConfirm={() => window.location.replace("/")} onCancel={() => setAttemptingToLeave(false)} confirmText="Yes, Leave" isDestructive={true} />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-[#2D211F] text-[#00E5B5] px-6 py-3 rounded-full font-bold shadow-xl border border-white/10 flex items-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100] md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed top-0 left-0 h-screen w-[260px] bg-white z-[101] md:hidden shadow-2xl flex flex-col p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <img src="/logo.jpg" alt="Spice Garden" className="w-8 h-8 rounded-full mix-blend-multiply" />
                  <h1 className="text-[#E04D2D] font-bold text-lg tracking-tight">spice garden</h1>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto pb-4">
                {[
                  { id: 0, label: "Dashboard", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg> },
                  { id: 1, label: "Profile Settings", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg> },
                  { id: 2, label: "Menu", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h16"/><path d="M4 14h16"/><path d="M4 6h16"/><path d="M4 18h16"/></svg> },
                  { id: 3, label: "Reservations", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
                  { id: 4, label: "Queries", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> },
                  { id: 5, label: "Header Pages", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><path d="m9 16 3-3 3 3"/></svg> },
                  { id: 6, label: "Requests", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                  { id: 7, label: "Delivery Partners", icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.64 5H3"/><path d="m7 14-3 5"/><path d="m11 14 3 5"/><path d="m15 14-3 5"/><rect width="2" height="4" x="18" y="10" rx="1"/><circle cx="5" cy="19" r="2"/><circle cx="15" cy="19" r="2"/></svg> },
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === tab.id ? 'bg-[#2D211F] text-[#F36B39]' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={profile.profileImage} alt="Admin" className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover" />
                  <span className="text-sm font-bold text-gray-800 truncate max-w-[100px]">{profile.username}</span>
                </div>
                <button onClick={handleLogout} className="w-10 h-10 rounded-full bg-[#FFE5E0] text-[#E04D2D] flex shrink-0 items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-[100px] h-screen py-8 px-4 border-r border-transparent">
        <div className="bg-white rounded-full flex flex-col items-center py-6 gap-8 h-full shadow-sm">
          {/* Dashboard Tab */}
          <button 
            onClick={() => setActiveTab(0)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTab === 0 ? 'bg-[#2D211F] text-[#F36B39] shadow-lg transform scale-105' : 'text-gray-400 hover:text-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
          </button>
          
          {/* Settings Tab */}
          <button 
            onClick={() => setActiveTab(1)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTab === 1 ? 'bg-[#2D211F] text-[#F36B39] shadow-lg transform scale-105' : 'text-gray-400 hover:text-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>
          </button>

          {/* Menu Management Tab */}
          <button 
            onClick={() => setActiveTab(2)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTab === 2 ? 'bg-[#2D211F] text-[#F36B39] shadow-lg transform scale-105' : 'text-gray-400 hover:text-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h16"/><path d="M4 14h16"/><path d="M4 6h16"/><path d="M4 18h16"/></svg>
          </button>

          {/* Reservations Tab */}
          <button 
            onClick={() => setActiveTab(3)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTab === 3 ? 'bg-[#2D211F] text-[#F36B39] shadow-lg transform scale-105' : 'text-gray-400 hover:text-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </button>

          {/* Queries Tab */}
          <button 
            onClick={() => setActiveTab(4)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTab === 4 ? 'bg-[#2D211F] text-[#F36B39] shadow-lg transform scale-105' : 'text-gray-400 hover:text-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </button>

          {/* Header Pages Tab */}
          <button 
            onClick={() => setActiveTab(5)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTab === 5 ? 'bg-[#2D211F] text-[#F36B39] shadow-lg transform scale-105' : 'text-gray-400 hover:text-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><path d="m9 16 3-3 3 3"/></svg>
          </button>

          {/* Staff Requests Tab */}
          <button 
            onClick={() => setActiveTab(6)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTab === 6 ? 'bg-[#2D211F] text-[#F36B39] shadow-lg transform scale-105' : 'text-gray-400 hover:text-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </button>
          
          {/* Delivery Friends Tab */}
          <button 
            onClick={() => setActiveTab(7)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTab === 7 ? 'bg-[#2D211F] text-[#F36B39] shadow-lg transform scale-105' : 'text-gray-400 hover:text-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.64 5H3"/><path d="m7 14-3 5"/><path d="m11 14 3 5"/><path d="m15 14-3 5"/><rect width="2" height="4" x="18" y="10" rx="1"/><circle cx="5" cy="19" r="2"/><circle cx="15" cy="19" r="2"/></svg>
          </button>
          
          <div className="mt-auto"></div>
          
          <button className="w-12 h-12 text-gray-400 hover:text-gray-800 rounded-full flex items-center justify-center transition-colors mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="shrink-0 px-4 py-4 md:px-10 md:py-6 flex items-center justify-between gap-4">
          
          {/* Mobile Menu Toggle & Logo */}
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              className="md:hidden p-2 text-gray-600 bg-white rounded-full shadow-sm shrink-0"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <div className="hidden md:flex items-center gap-2">
              <img src="/logo.jpg" alt="Spice Garden" className="w-8 h-8 rounded-full mix-blend-multiply" />
              <h1 className="text-[#E04D2D] font-bold text-xl tracking-tight">spice garden</h1>
            </div>
            
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 md:ml-12 truncate max-w-[150px] md:max-w-none">
              {activeTab === 0 ? 'Dashboard' : activeTab === 1 ? 'Profile Settings' : activeTab === 2 ? 'Menu Management' : activeTab === 3 ? 'Reservations' : activeTab === 4 ? 'Contact Queries' : activeTab === 5 ? 'Header Pages Management' : activeTab === 6 ? 'Update Requests' : 'Delivery Partners'}
            </h2>
          </div>

          {/* Profile Area */}
          <div className="flex items-center gap-4 md:gap-6 ml-auto bg-white rounded-full pl-2 pr-2 py-2 shadow-sm">
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors hidden sm:flex">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
            <div className="flex items-center gap-3">
              <img src={profile.profileImage} alt="Admin" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
              <div className="hidden lg:flex flex-col pr-2">
                <span className="text-sm font-bold text-gray-800">{profile.username}</span>
                <span className="text-xs text-gray-400 font-medium">Admin Store</span>
              </div>
            </div>
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-[#FFE5E0] text-[#E04D2D] hover:bg-[#E04D2D] hover:text-white flex items-center justify-center transition-colors mr-1 shadow-sm"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="px-4 md:px-10 pb-10 flex-1 w-full max-w-full overflow-y-auto pt-2 flex flex-col">
          {activeTab === 0 && (
            /* Content Management View (CMS) */
            <AdminContentTab showToast={(msg) => {
              setToastMessage(msg);
              setTimeout(() => setToastMessage(""), 3000);
            }} />
          )}

          {activeTab === 1 && (
            /* Settings View */
            <div className="w-full min-h-[60vh] bg-white rounded-3xl md:rounded-[2rem] shadow-sm p-4 md:p-8 max-w-3xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold text-[#2D211F] mb-6 md:mb-8">Admin Profile Settings</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-6 md:space-y-8">
                {/* Profile Image Upload */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
                  <div className="relative shrink-0">
                    <img 
                      src={selectedFile ? URL.createObjectURL(selectedFile) : profile.profileImage} 
                      alt="Profile Preview" 
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[#F6EEED] shadow-sm" 
                    />
                    <label className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-[#E04D2D] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#C84022] transition-colors shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }} 
                      />
                    </label>
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="font-bold text-gray-800 text-lg">Profile Picture</h4>
                    <p className="text-sm text-gray-400 mt-1">Upload a new avatar from your device.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                    <input 
                      type="text" 
                      required
                      value={updateUsername}
                      onChange={(e) => setUpdateUsername(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E04D2D] focus:ring-1 focus:ring-[#E04D2D] transition-colors bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password (optional)</label>
                    <input 
                      type="password" 
                      value={updatePassword}
                      onChange={(e) => setUpdatePassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E04D2D] focus:ring-1 focus:ring-[#E04D2D] transition-colors bg-gray-50"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="bg-[#2D211F] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 2 && (
            /* Menu Management View */
            <div className="w-full flex-1 h-full min-h-0 bg-white rounded-3xl md:rounded-[2rem] shadow-sm max-w-3xl mx-auto flex flex-col overflow-hidden">
              <div className="p-4 md:p-8 flex-1 overflow-y-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-[#2D211F]">Add New Menu Item</h3>
                  <button 
                    onClick={() => setAdminView('menu-list')} 
                    className="bg-[#2D211F] text-[#F36B39] px-6 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform w-full md:w-auto text-center"
                  >
                    View Items
                  </button>
                </div>
                <form onSubmit={handleAddMenuItem} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dish Image</label>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden relative">
                    {menuImage ? (
                      <img src={URL.createObjectURL(menuImage)} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) setMenuImage(e.target.files[0]);
                    }} />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dish Name</label>
                  <input type="text" required value={menuName} onChange={e => setMenuName(e.target.value)} placeholder="e.g. Bangada (Rawa Fry)" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E04D2D] focus:ring-1 focus:ring-[#E04D2D] bg-gray-50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select value={menuCategory} onChange={e => setMenuCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E04D2D] focus:ring-1 focus:ring-[#E04D2D] bg-gray-50">
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dietary Type</label>
                    <select value={menuIsVeg} onChange={e => setMenuIsVeg(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E04D2D] focus:ring-1 focus:ring-[#E04D2D] bg-gray-50">
                      <option value="false">Non-Veg (Red Dot)</option>
                      <option value="true">Veg (Green Dot)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price or Text</label>
                  <input type="text" required value={menuPriceText} onChange={e => setMenuPriceText(e.target.value)} placeholder="e.g. As Per Catch" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E04D2D] focus:ring-1 focus:ring-[#E04D2D] bg-gray-50" />
                </div>

                <button type="submit" className="w-full bg-[#E04D2D] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#C84022] transition-colors shadow-lg">
                  Add Item
                </button>
              </form>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            /* Reservations View */
            <div className="w-full min-h-[60vh] bg-white rounded-3xl md:rounded-[2rem] shadow-sm p-4 md:p-8 max-w-5xl mx-auto flex flex-col gap-6 md:gap-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl md:text-2xl font-bold text-[#2D211F]">Online Reservations</h3>
              </div>
              
              {/* Settings Form */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
                <div>
                  <h4 className="font-bold text-gray-800">Booking Time Limits</h4>
                  <p className="text-sm text-gray-500">Define the valid time slots users can book.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <span className="text-sm font-bold text-gray-600 hidden sm:inline">From</span>
                    <TimeSelector value={settings.openTime} onChange={v => setSettings({...settings, openTime: v})} />
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <span className="text-sm font-bold text-gray-600 hidden sm:inline">To</span>
                    <TimeSelector value={settings.closeTime} onChange={v => setSettings({...settings, closeTime: v})} />
                  </div>
                  <button onClick={saveSettings} className="w-full sm:w-auto bg-[#2D211F] text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-black transition-colors mt-2 sm:mt-0">
                    Save Time
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div className="relative w-full md:w-64 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={resSearchQuery}
                    onChange={(e) => setResSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-[#E04D2D] transition-colors"
                  />
                </div>
                
                {resStatusTab === 'Pending' ? (
                  <>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button onClick={() => setResStatusTab('Approved')} className="flex-1 md:flex-none px-6 py-2 rounded-xl font-bold border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 transition-colors">Approved</button>
                      <button onClick={() => setResStatusTab('Rejected')} className="flex-1 md:flex-none px-6 py-2 rounded-xl font-bold border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors">Rejected</button>
                    </div>

                    <select 
                      value={resFilter}
                      onChange={(e) => setResFilter(e.target.value)}
                      className="w-full md:w-48 bg-white border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-[#E04D2D] cursor-pointer"
                    >
                      <option value="Recent">All Pending</option>
                      <option value="Pending">New (Pending)</option>
                    </select>
                  </>
                ) : (
                  <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto ml-auto">
                     <h4 className={`font-bold mr-0 md:mr-4 ${resStatusTab === 'Approved' ? 'text-green-700' : 'text-red-700'}`}>{resStatusTab}</h4>
                     <button onClick={() => setResStatusTab('Pending')} className="px-6 py-2 rounded-xl font-bold border border-gray-200 text-gray-700 bg-white hover:bg-gray-100 transition-colors flex items-center gap-2">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                       Back
                     </button>
                  </div>
                )}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReservations.map(res => (
                  <div key={res.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg leading-tight">{res.name}</h4>
                        <p className="text-gray-500 text-sm mt-1">{res.phone}</p>
                        {res.email && <p className="text-gray-400 text-xs mt-1">{res.email}</p>}
                      </div>
                    </div>
                    <div className="flex gap-4 items-center text-sm font-medium text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                      <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> {res.date}</span>
                      <span className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {res.time}</span>
                    </div>

                    {/* Inline Action Buttons */}
                    {(res.status === 'Pending' || res.status === 'New') && (
                      <div className="flex gap-3 mt-6">
                        <button 
                          onClick={() => { setSelectedResId(res.id); setShowPriceModal(true); }}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          Accept & Set Price
                        </button>
                        <button 
                          onClick={() => updateReservationStatus(res.id, 'Rejected')}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {filteredReservations.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No reservations found matching your filters.
                </div>
              )}
            </div>
          )}

          {activeTab === 4 && (
            /* Contact Queries View */
            <div className="w-full min-h-[60vh] bg-white rounded-3xl md:rounded-[2rem] shadow-sm p-4 md:p-8 max-w-5xl mx-auto flex flex-col gap-6 md:gap-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl md:text-2xl font-bold text-[#2D211F]">Customer Queries & Requests</h3>
                <button onClick={() => setAdminView('queries-list')} className="bg-[#2D211F] text-[#F36B39] px-6 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 w-full md:w-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  View All
                </button>
              </div>
              
              {/* Controls */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div className="relative w-full md:w-64 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <input 
                    type="text" 
                    placeholder="Search name or email..." 
                    value={querySearch}
                    onChange={(e) => setQuerySearch(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-[#E04D2D] transition-colors"
                  />
                </div>
                
                <select 
                  value={queryFilter}
                  onChange={(e) => setQueryFilter(e.target.value)}
                  className="w-full md:w-48 bg-white border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-[#E04D2D] cursor-pointer"
                >
                  <option value="Recent">Recent First</option>
                  <option value="Old">Oldest First</option>
                </select>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredQueries.map(q => (
                  <div key={q.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg leading-tight">{q.name}</h4>
                        <p className="text-gray-500 text-sm mt-1">{q.email}</p>
                        <p className="text-gray-400 text-xs mt-1">{q.phone}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-400">{new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex-1 text-sm text-gray-700 bg-white p-4 rounded-xl border border-gray-100 whitespace-pre-wrap">
                      {q.message}
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredQueries.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No queries found matching your filters.
                </div>
              )}
            </div>
          )}

          {activeTab === 5 && (
            /* Header Pages Management View */
            <AdminHeaderPagesTab 
              showToast={(msg) => {
                setToastMessage(msg);
                setTimeout(() => setToastMessage(""), 3000);
              }} 
              onViewGallery={() => setAdminView('gallery-list')}
            />
          )}

          {activeTab === 6 && (
            <div className="w-full min-h-[60vh] bg-white rounded-3xl md:rounded-[2rem] shadow-sm p-4 md:p-8 max-w-4xl mx-auto flex flex-col gap-6 md:gap-8">
              <h3 className="text-xl md:text-2xl font-bold text-[#2D211F]">Staff Credential Requests</h3>
              <p className="text-gray-500 mb-4">Approve or reject staff requests to change their username/password.</p>
              
              <div className="flex flex-col gap-4">
                {staffRequests.map(req => (
                  <div key={req.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="font-bold text-gray-800">Staff ID: {req.staffId}</div>
                      <div className="text-sm text-gray-500 mt-1">Requested New Username: <span className="font-semibold text-black">{req.newUsername}</span></div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(req.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleStaffRequest(req.id, 'approve')}
                        className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-sm text-sm"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStaffRequest(req.id, 'reject')}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-600 transition-colors shadow-sm text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}

                {staffRequests.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    No pending credential requests from staff.
                  </div>
                )}
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-[#2D211F] mt-8">Delivery Partner Requests</h3>
              <p className="text-gray-500 mb-4">Approve or reject delivery partners requests to change their details.</p>

              <div className="flex flex-col gap-4">
                {deliveryRequests.map(req => (
                  <div key={req.id} className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="font-bold text-gray-800">{req.friendName} ({req.friendUniqueId})</div>
                      {req.newMobile && <div className="text-sm text-gray-500 mt-1">New Mobile: <span className="font-semibold text-black">{req.newMobile}</span></div>}
                      {req.newEmail && <div className="text-sm text-gray-500 mt-1">New Email: <span className="font-semibold text-black">{req.newEmail}</span></div>}
                      {req.newAddress && <div className="text-sm text-gray-500 mt-1">New Address: <span className="font-semibold text-black">{req.newAddress}</span></div>}
                      <div className="text-xs text-gray-400 mt-1">{new Date(req.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleDeliveryRequest(req.id, 'approve')}
                        className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-sm text-sm"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleDeliveryRequest(req.id, 'reject')}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-600 transition-colors shadow-sm text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}

                {deliveryRequests.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    No pending requests from delivery partners.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 7 && (
            <div className="w-full min-h-[60vh] bg-white rounded-3xl md:rounded-[2rem] shadow-sm p-4 md:p-8 max-w-4xl mx-auto flex flex-col gap-6 md:gap-8 overflow-y-auto">
              <div className="flex justify-between items-center">
                <h3 className="text-xl md:text-2xl font-bold text-[#2D211F]">Add Delivery Partner</h3>
                <button 
                  onClick={() => setAdminView('delivery-list')}
                  className="bg-[#2D211F] text-[#F36B39] px-6 py-2 rounded-xl font-bold shadow-lg transition-transform hover:scale-105"
                >
                  View All Partners
                </button>
              </div>

              <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                let finalIdCard = formData.get("idCardImage") as string;
                let finalResume = formData.get("resumeFile") as string;

                const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;

                // Upload ID Card if file
                if (idInputType === "file" && idFile) {
                  const fd = new FormData();
                  fd.append("file", idFile);
                  const uploadRes = await fetch(`${apiUrl}/admin/upload-file`, { method: "POST", credentials: "include", body: fd });
                  if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    finalIdCard = data.fileUrl;
                  }
                }

                // Upload Resume if file
                if (resumeInputType === "file" && resumeUploadFile) {
                  const fd = new FormData();
                  fd.append("file", resumeUploadFile);
                  const uploadRes = await fetch(`${apiUrl}/admin/upload-file`, { method: "POST", credentials: "include", body: fd });
                  if (uploadRes.ok) {
                    const data = await uploadRes.json();
                    finalResume = data.fileUrl;
                  }
                }

                const res = await fetch(`${apiUrl}/admin/delivery-friends/hire`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({
                    name: formData.get("name"),
                    email: formData.get("email"),
                    mobile: formData.get("mobile"),
                    idCardImage: finalIdCard || "",
                    idCardNumber: formData.get("idCardNumber"),
                    address: formData.get("address"),
                    resumeFile: finalResume || "",
                    password: formData.get("password"),
                  })
                });
                if (res.ok) {
                  const data = await res.json();
                  setToastMessage(`Hired successfully! Unique ID: ${data.friend.uniqueId}`);
                  setTimeout(() => setToastMessage(""), 5000);
                  (e.target as HTMLFormElement).reset();
                  setIdFile(null);
                  setResumeUploadFile(null);
                }
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <input name="name" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E04D2D]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input name="email" type="email" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E04D2D]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
                    <input name="mobile" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E04D2D]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Setup Login Password</label>
                    <input name="password" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E04D2D]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ID Card Number (Aadhar/Pan)</label>
                    <input name="idCardNumber" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E04D2D]" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-bold text-gray-700">ID Card Image</label>
                      <div className="flex gap-2 text-xs font-semibold">
                        <button type="button" onClick={() => setIdInputType("url")} className={`px-2 py-1 rounded ${idInputType === "url" ? 'bg-black text-white' : 'bg-gray-200'}`}>URL</button>
                        <button type="button" onClick={() => setIdInputType("file")} className={`px-2 py-1 rounded ${idInputType === "file" ? 'bg-black text-white' : 'bg-gray-200'}`}>Upload</button>
                      </div>
                    </div>
                    {idInputType === "url" ? (
                      <input name="idCardImage" required placeholder="https://..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E04D2D]" />
                    ) : (
                      <input type="file" required accept="image/*,.pdf" onChange={(e) => setIdFile(e.target.files?.[0] || null)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E04D2D] bg-white" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Residential Address</label>
                  <textarea name="address" required rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E04D2D]" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700">Resume Document (Optional)</label>
                    <div className="flex gap-2 text-xs font-semibold">
                      <button type="button" onClick={() => setResumeInputType("url")} className={`px-2 py-1 rounded ${resumeInputType === "url" ? 'bg-black text-white' : 'bg-gray-200'}`}>URL</button>
                      <button type="button" onClick={() => setResumeInputType("file")} className={`px-2 py-1 rounded ${resumeInputType === "file" ? 'bg-black text-white' : 'bg-gray-200'}`}>Upload</button>
                    </div>
                  </div>
                  {resumeInputType === "url" ? (
                    <input name="resumeFile" placeholder="https://..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E04D2D]" />
                  ) : (
                    <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={(e) => setResumeUploadFile(e.target.files?.[0] || null)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#E04D2D] bg-white" />
                  )}
                </div>

                <button className="w-full bg-[#E04D2D] hover:bg-[#C84022] text-white font-black py-4 rounded-xl shadow-lg transition-colors">
                  Hire Partner
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Accept & Set Price Modal */}
      <AnimatePresence>
        {showPriceModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white p-8 rounded-[2rem] max-w-sm w-full shadow-2xl">
              <h3 className="font-bold text-2xl text-gray-800 mb-4">Set Booking Amount</h3>
              <p className="text-gray-500 mb-6 text-sm">Enter the required booking fee for this reservation.</p>
              <form onSubmit={handleAcceptWithPrice}>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Amount (₹)</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E04D2D] focus:ring-1 focus:ring-[#E04D2D] bg-gray-50"
                  />
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setShowPriceModal(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 transition-colors shadow-lg">Confirm</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
