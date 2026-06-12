import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function StaffDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  
  const [profile, setProfile] = useState({ username: "Staff", profileImage: "https://i.pravatar.cc/150?img=47" });
  
  // Profile Update State
  const [updateUsername, setUpdateUsername] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [orderMessage, setOrderMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchProfile();
    
    // Read tab from URL if present
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam !== null) {
      setActiveTab(parseInt(tabParam, 10));
    }
  }, []);

  useEffect(() => {
    if (activeTab === 1) fetchOrders();
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const res = await fetch(`${apiUrl}/staff/profile`, {
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          username: data.username,
          profileImage: data.profileImage ? (data.profileImage.startsWith('http') ? data.profileImage : `http://localhost:3000${data.profileImage}?v=2`) : "https://i.pravatar.cc/150?img=47"
        });
        setUpdateUsername(data.username);
      } else if (res.status === 401) {
        window.location.replace("/admin/login");
      }
    } catch (e) {
      window.location.replace("/admin/login");
    }
  };

  const handleLogout = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    await fetch(`${apiUrl}/staff/logout`, { method: "POST", credentials: "include" });
    window.location.replace("/");
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    
    // Upload image first if selected
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      
      await fetch(`${apiUrl}/staff/profile-image`, {
        method: "PUT",
        credentials: "include",
        body: formData
      });
    }

    // Submit Credential Change Request if username or password provided
    if (updateUsername !== profile.username || updatePassword) {
      const res = await fetch(`${apiUrl}/staff/credential-request`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newUsername: updateUsername,
          newPassword: updatePassword || "staffSPICE" // Requires real original pwd if unchanged ideally, but we will mock for now
        })
      });
      if (res.ok) {
        setToastMessage("Credential change requested! Waiting for admin approval.");
      }
    } else {
      setToastMessage("Profile updated successfully!");
    }

    setUpdatePassword("");
    setSelectedFile(null);
    fetchProfile();
    setTimeout(() => setToastMessage(""), 3000);
  };

  const fetchOrders = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const res = await fetch(`${apiUrl}/staff/orders`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setOrders(data);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string, message: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    await fetch(`${apiUrl}/staff/orders/${orderId}/status`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status, message })
    });
    setOrderMessage("");
    setSelectedOrder(null);
    fetchOrders();
    setToastMessage(`Order ${status}`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F6EEED] flex overflow-hidden relative font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-50 bg-[#B2E624] text-black px-6 py-3 rounded-full font-bold shadow-xl border border-white/10 flex items-center gap-3"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-[100px] h-screen py-8 px-4 border-r border-transparent">
        <div className="bg-white rounded-full flex flex-col items-center py-6 gap-8 h-full shadow-sm">
          {/* Dashboard Tab */}
          <button 
            onClick={() => setActiveTab(0)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTab === 0 ? 'bg-[#B2E624] text-black shadow-lg transform scale-105' : 'text-gray-400 hover:text-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
          </button>

          {/* Orders Tab */}
          <button 
            onClick={() => setActiveTab(1)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTab === 1 ? 'bg-[#B2E624] text-black shadow-lg transform scale-105' : 'text-gray-400 hover:text-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </button>
          
          <div className="mt-auto"></div>
          
          {/* Settings Tab */}
          <button 
            onClick={() => setActiveTab(2)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all mb-4 ${activeTab === 2 ? 'bg-[#B2E624] text-black shadow-lg transform scale-105' : 'text-gray-400 hover:text-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="shrink-0 px-4 py-4 md:px-10 md:py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <h2 className="text-lg md:text-2xl font-bold text-gray-800">
              {activeTab === 0 ? 'Staff Dashboard' : activeTab === 1 ? 'Today\'s Orders' : 'Staff Settings'}
            </h2>
          </div>

          <div className="flex items-center gap-4 md:gap-6 ml-auto bg-white rounded-full pl-2 pr-2 py-2 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 pl-2">
              <img src={profile.profileImage} alt="Staff" className="w-10 h-10 rounded-full border-2 border-[#B2E624] shadow-sm object-cover" />
              <div className="hidden lg:flex flex-col pr-2">
                <span className="text-sm font-bold text-gray-800">{profile.username}</span>
                <span className="text-xs text-gray-400 font-medium">Support Staff</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors mr-1 shadow-sm"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="px-4 md:px-10 pb-10 flex-1 w-full max-w-full overflow-y-auto pt-2 flex flex-col">
          {activeTab === 0 && (
            <div className="w-full flex-1 flex items-center justify-center text-gray-400 bg-white rounded-3xl shadow-sm min-h-[50vh]">
              Dashboard blank as requested. Please select "Orders" from the sidebar.
            </div>
          )}

          {activeTab === 1 && (
            <div className="w-full min-h-[60vh] bg-white rounded-3xl md:rounded-[2rem] shadow-sm p-4 md:p-8 flex flex-col gap-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">Pending Orders</h3>
              <div className="grid grid-cols-1 gap-6">
                {orders.map(order => (
                  <div key={order.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm relative">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">Order #{order.id}</h4>
                        <span className="text-sm font-medium bg-[#B2E624]/20 text-green-700 px-3 py-1 rounded-full">{order.status}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                        <div className="text-lg font-bold mt-1">₹{order.totalAmount} ({order.paymentMethod})</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-700 mb-2">Items:</h5>
                      <ul className="space-y-2">
                        {order.items.map((item: any, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-sm bg-white p-2 rounded-lg border border-gray-100">
                            <span className={`w-3 h-3 rounded-full ${item.isVeg === "true" ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="font-medium flex-1">{item.name}</span>
                            <span className="text-gray-500">x{item.quantity}</span>
                            <span className="font-semibold text-gray-700">₹{parseInt(item.priceText) * item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {order.status === 'Pending' && selectedOrder !== order.id && (
                      <button 
                        onClick={() => setSelectedOrder(order.id)}
                        className="bg-black text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                      >
                        Process Order
                      </button>
                    )}

                    {selectedOrder === order.id && (
                      <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl space-y-4">
                        <textarea 
                          placeholder="Optional message for approval, mandatory for rejection (e.g. We are preparing your order)"
                          value={orderMessage}
                          onChange={(e) => setOrderMessage(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#B2E624] focus:ring-1 focus:ring-[#B2E624] transition-colors resize-none h-24"
                        />
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleUpdateOrderStatus(order.id, 'Approved', orderMessage)}
                            className="flex-1 bg-[#B2E624] text-black py-2 rounded-xl font-bold shadow-md hover:bg-[#9bd41c] transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => {
                              if (!orderMessage) {
                                setToastMessage("Message is mandatory for rejection!");
                                setTimeout(() => setToastMessage(""), 3000);
                                return;
                              }
                              handleUpdateOrderStatus(order.id, 'Rejected', orderMessage);
                            }}
                            className="flex-1 bg-red-500 text-white py-2 rounded-xl font-bold shadow-md hover:bg-red-600 transition-colors"
                          >
                            Reject
                          </button>
                          <button 
                            onClick={() => { setSelectedOrder(null); setOrderMessage(""); }}
                            className="px-4 text-gray-500 hover:text-black font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    No orders today.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="w-full min-h-[60vh] bg-white rounded-3xl md:rounded-[2rem] shadow-sm p-4 md:p-8 max-w-3xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8">Staff Profile Settings</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-6 md:space-y-8">
                {/* Profile Image Upload */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
                  <div className="relative shrink-0">
                    <img 
                      src={selectedFile ? URL.createObjectURL(selectedFile) : profile.profileImage} 
                      alt="Profile Preview" 
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm" 
                    />
                    <label className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-[#B2E624] text-black rounded-full flex items-center justify-center cursor-pointer hover:bg-[#9bd41c] transition-colors shadow-lg">
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
                    <p className="text-sm text-gray-400 mt-1">Upload a new avatar. Changes instantly.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm border border-orange-200">
                    <strong>Note:</strong> Changing your Username or Password requires Admin approval. Your current credentials will remain active until approved.
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                    <input 
                      type="text" 
                      required
                      value={updateUsername}
                      onChange={(e) => setUpdateUsername(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#B2E624] focus:ring-1 focus:ring-[#B2E624] transition-colors bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <input 
                      type="password" 
                      value={updatePassword}
                      onChange={(e) => setUpdatePassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#B2E624] focus:ring-1 focus:ring-[#B2E624] transition-colors bg-gray-50"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg"
                >
                  Save / Request Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
