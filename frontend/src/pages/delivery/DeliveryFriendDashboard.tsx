import { useState, useEffect } from "react";
import { Search, MapPin, Check, User, Package, History, CheckCircle2 } from "lucide-react";
import { Modal } from "../../components/ui/Modal";

export function DeliveryFriendDashboard() {
  const queryParams = new URLSearchParams(window.location.search);
  const initialTab = queryParams.get("tab") || "Active Orders";
  const [currentTab, setCurrentTab] = useState(initialTab);

  const [profile, setProfile] = useState<any>(null);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastDeliveries, setPastDeliveries] = useState<any[]>([]);
  const [searchPastQuery, setSearchPastQuery] = useState("");
  const [pastSortOrder, setPastSortOrder] = useState("recent");

  const [attemptingToLeave, setAttemptingToLeave] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    window.history.replaceState(null, '', `?tab=${tab}`);
  };

  useEffect(() => {
    const checkSession = () => {
      if (!sessionStorage.getItem("deliverySession")) {
        window.location.replace("/admin/login");
      }
    };
    checkSession();
    window.addEventListener("pageshow", checkSession);

    fetchProfile();
    fetchActiveOrders();

    // Navigation Trap
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
      setAttemptingToLeave(true);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener("pageshow", checkSession);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (currentTab === "Past Deliveries") {
      fetchPastDeliveries();
    }
  }, [currentTab]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/delivery-friend/profile`, { credentials: "include" });
      if (res.ok) {
        setProfile(await res.json());
        setIsAuthenticated(true);
      } else if (res.status === 401) {
        window.location.replace("/admin/login");
      }
    } catch {
      window.location.replace("/admin/login");
    }
  };

  const fetchActiveOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/delivery-friend/active-orders`, { credentials: "include" });
      if (res.ok) setActiveOrders(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPastDeliveries = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/delivery-friend/past-deliveries`, { credentials: "include" });
      if (res.ok) setPastDeliveries(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    setAttemptingToLeave(true);
  };

  const handleStatusChange = async (status: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/delivery-friend/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setToastMsg(`Status updated to ${status}`);
      setTimeout(() => setToastMsg(""), 3000);
      fetchProfile();
    }
  };

  const handleMarkDelivered = async (orderId: number) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/delivery-friend/orders/${orderId}/delivered`, {
      method: "PUT",
      credentials: "include"
    });
    if (res.ok) {
      setToastMsg("Order marked as Delivered");
      setTimeout(() => setToastMsg(""), 3000);
      fetchActiveOrders();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F6EEED] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E04D2D]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row relative">
      <Modal 
        isOpen={attemptingToLeave}
        title="Leave Dashboard?"
        desc="Are you sure you want to go back to the home page?"
        onConfirm={async () => {
          sessionStorage.removeItem("deliverySession");
          try {
            await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/auth/logout`, { method: "POST", credentials: "include" });
          } catch {}
          window.location.replace("/");
        }}
        onCancel={() => setAttemptingToLeave(false)}
        confirmText="Yes, Leave"
        isDestructive={true}
      />
      
      {toastMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-black text-[#B2E624] rounded-full text-sm font-bold shadow-2xl z-[300] animate-in slide-in-from-top-10 flex items-center gap-2">
          <Check className="w-5 h-5" />
          {toastMsg}
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-[280px] h-screen bg-white shadow-xl py-8 px-6 sticky top-0 shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-[#B2E624] rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 leading-none">SpiceGarden</h1>
            <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">Delivery Partner</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {['Active Orders', 'Past Deliveries', 'Settings'].map(tab => (
            <button 
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all ${currentTab === tab ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              {tab === "Active Orders" ? <Package className="w-5 h-5" /> : tab === "Past Deliveries" ? <History className="w-5 h-5" /> : <User className="w-5 h-5" />}
              {tab}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3 mb-6">
            <img src={profile.profileImage ? (profile.profileImage.startsWith('http') ? profile.profileImage : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${profile.profileImage}`) : "https://i.pravatar.cc/150"} className="w-12 h-12 rounded-full border-2 border-gray-100 object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate">{profile.name}</p>
              <p className="text-xs font-semibold text-gray-500">{profile.uniqueId}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-3 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 font-bold rounded-xl transition-colors">Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="bg-white md:bg-transparent px-4 py-4 md:px-8 md:py-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="md:hidden flex items-center gap-3">
            <div className="w-10 h-10 bg-[#B2E624] rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-black" />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto bg-white px-4 py-2 rounded-full shadow-sm">
            <span className="font-bold text-sm text-gray-600 hidden sm:inline">Current Status:</span>
            <select 
              value={profile.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`font-bold text-sm focus:outline-none cursor-pointer bg-transparent ${profile.status === 'Available' ? 'text-green-600' : profile.status === 'Delivering' ? 'text-blue-600' : 'text-red-600'}`}
            >
              <option value="Available">🟢 Available</option>
              <option value="Delivering">🔵 Delivering</option>
              <option value="On Leave">🔴 On Leave</option>
            </select>
          </div>
        </header>

        <div className="px-4 pb-10 md:px-8 flex-1 w-full max-w-5xl mx-auto">
          {currentTab === "Active Orders" && (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Active Deliveries</h2>
              {activeOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-bold">No active orders assigned to you.</div>
              ) : (
                <div className="space-y-4">
                  {activeOrders.map(order => (
                    <div key={order.id} className="border-2 border-gray-100 rounded-2xl p-6 relative">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                          <h3 className="font-black text-xl">Order #{order.id}</h3>
                          <p className="text-sm text-gray-500 font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full font-bold text-sm mt-2 md:mt-0">
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-[2] bg-gray-50 rounded-xl p-4 flex gap-4 items-start">
                          {order.homeImage && (
                            <img src={`${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${order.homeImage}`} alt="Home" className="w-24 h-24 rounded-lg object-cover border border-gray-200 shrink-0" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-bold mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" /> Delivery Details</h4>
                            <div className="text-sm space-y-1">
                              <p><span className="font-medium text-gray-500">Receiver:</span> {order.receiverName || 'N/A'} - {order.receiverMobile || 'N/A'}</p>
                              <p><span className="font-medium text-gray-500">Location:</span> {order.customerLocation || 'N/A'}</p>
                              <p><span className="font-medium text-gray-500">Address:</span> {order.streetAddress || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex-[0.5] bg-gray-50 rounded-xl p-4">
                          <h4 className="font-bold mb-3">Amount</h4>
                          <p className="text-2xl font-black text-[#B2E624]">₹{order.totalAmount}</p>
                          <p className="text-sm font-bold text-gray-500">{order.paymentMethod}</p>
                        </div>
                      </div>

                      {order.status === "Out for Delivery" && (
                        <button 
                          onClick={() => handleMarkDelivered(order.id)}
                          className="w-full mt-6 py-4 bg-black text-white hover:bg-gray-800 font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg"
                        >
                          Mark as Delivered <CheckCircle2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentTab === "Past Deliveries" && (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold">Past Deliveries</h2>
                <div className="flex gap-4 items-center">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search location or ID..." 
                      value={searchPastQuery}
                      onChange={(e) => setSearchPastQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#B2E624]" 
                    />
                  </div>
                  <select 
                    value={pastSortOrder} 
                    onChange={(e) => setPastSortOrder(e.target.value)}
                    className="bg-gray-50 border-none rounded-full px-4 py-2 text-sm font-bold focus:outline-none cursor-pointer focus:ring-2 focus:ring-[#B2E624]"
                  >
                    <option value="recent">Recent First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>

              {pastDeliveries.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-bold">No past deliveries yet.</div>
              ) : (
                <div className="space-y-4">
                  {pastDeliveries
                    .filter(order => {
                      if (!searchPastQuery) return true;
                      const q = searchPastQuery.toLowerCase();
                      const loc = order.customerLocation ? order.customerLocation.toLowerCase() : "";
                      return order.id.toString().includes(q) || loc.includes(q);
                    })
                    .sort((a, b) => {
                      if (pastSortOrder === "recent") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
                    })
                    .map(order => (
                    <div key={order.id} className={`border rounded-2xl p-6 relative ${order.status === 'Delivered' ? 'border-green-200 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                          <h3 className="font-bold text-lg">Order #{order.id}</h3>
                          <p className="text-sm text-gray-500 font-medium">{new Date(order.updatedAt).toLocaleString()}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-xs mt-2 md:mt-0">
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate">{order.streetAddress || order.customerLocation || "Unknown Location"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentTab === "Settings" && (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Settings</h2>
              <div className="space-y-8">
                {/* Direct Update Form */}
                <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50">
                  <h3 className="text-lg font-bold mb-4">Direct Updates</h3>
                  <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const name = formData.get("name");
                    const password = formData.get("password");
                    
                    if (selectedFile) {
                      const fileData = new FormData();
                      fileData.append("image", selectedFile);
                      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/delivery-friend/profile-image`, {
                        method: "POST",
                        credentials: "include",
                        body: fileData
                      });
                    }

                    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/delivery-friend/profile`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({ name, password })
                    });
                    if (res.ok) {
                      setToastMsg("Profile updated directly");
                      setTimeout(() => setToastMsg(""), 3000);
                      setSelectedFile(null);
                      fetchProfile();
                    }
                  }}>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
                      <div className="relative shrink-0">
                        <img 
                          src={selectedFile ? URL.createObjectURL(selectedFile) : (profile.profileImage ? (profile.profileImage.startsWith('http') ? profile.profileImage : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${profile.profileImage}`) : "https://i.pravatar.cc/150")} 
                          alt="Profile Preview" 
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" 
                        />
                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors shadow-lg">
                          <CheckCircle2 className="w-5 h-5" />
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
                      <div className="text-center md:text-left md:mt-2">
                        <h4 className="font-bold text-gray-800">Profile Picture</h4>
                        <p className="text-xs text-gray-500">Upload a new avatar from your device.</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">Full Name</label>
                      <input name="name" defaultValue={profile.name} required className="w-full px-4 py-3 rounded-xl border focus:border-black outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">New Password (optional)</label>
                      <input name="password" type="password" placeholder="Leave blank to keep current" className="w-full px-4 py-3 rounded-xl border focus:border-black outline-none" />
                    </div>
                    <button className="bg-black text-white px-6 py-3 rounded-xl font-bold">Save Direct Changes</button>
                  </form>
                </div>

                {/* Request Admin Update Form */}
                <div className="border border-yellow-200 rounded-2xl p-6 bg-yellow-50">
                  <h3 className="text-lg font-bold text-yellow-800 mb-2">Request Admin Updates</h3>
                  <p className="text-sm text-yellow-700 mb-4">Changes to Mobile, Email, or Address must be approved by the Admin.</p>
                  <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/delivery-friend/update-request`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      credentials: "include",
                      body: JSON.stringify({
                        newMobile: formData.get("mobile"),
                        newEmail: formData.get("email"),
                        newAddress: formData.get("address")
                      })
                    });
                    if (res.ok) {
                      setToastMsg("Request submitted to Admin");
                      setTimeout(() => setToastMsg(""), 3000);
                      (e.target as HTMLFormElement).reset();
                    }
                  }}>
                    <div>
                      <label className="block text-sm font-bold mb-2">New Mobile Number</label>
                      <input name="mobile" placeholder={`Current: ${profile.mobile}`} className="w-full px-4 py-3 rounded-xl border border-yellow-200 focus:border-yellow-400 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">New Email</label>
                      <input name="email" type="email" placeholder={`Current: ${profile.email}`} className="w-full px-4 py-3 rounded-xl border border-yellow-200 focus:border-yellow-400 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">New Address</label>
                      <textarea name="address" placeholder={`Current: ${profile.address}`} className="w-full px-4 py-3 rounded-xl border border-yellow-200 focus:border-yellow-400 outline-none" />
                    </div>
                    <button className="bg-yellow-500 text-white hover:bg-yellow-600 px-6 py-3 rounded-xl font-bold shadow-md">Submit Request</button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40 pb-safe">
          {['Active Orders', 'Past Deliveries', 'Settings'].map(tab => (
            <button 
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-4 flex flex-col items-center justify-center gap-1 ${currentTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab === "Active Orders" ? <Package className="w-6 h-6" /> : tab === "Past Deliveries" ? <History className="w-6 h-6" /> : <User className="w-6 h-6" />}
              <span className="text-[10px] font-bold text-center leading-none mt-1">{tab}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
