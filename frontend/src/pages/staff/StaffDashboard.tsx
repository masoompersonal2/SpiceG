import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { Modal } from "../../components/ui/Modal";

export function StaffDashboard() {
  const queryParams = new URLSearchParams(window.location.search);
  const tabParam = queryParams.get("tab");
  const initialTab = tabParam === 'Orders' ? 1 : tabParam === 'Settings' ? 2 : tabParam === 'Fees' ? 3 : 0;
  
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Sync tab with URL
  const handleTabChange = (index: number) => {
    setActiveTab(index);
    const tabName = index === 1 ? 'Orders' : index === 2 ? 'Settings' : index === 3 ? 'Fees' : 'Dashboard';
    window.history.replaceState(null, '', `?tab=${tabName}`);
  };
  
  const [profile, setProfile] = useState({ username: "Staff", profileImage: "https://i.pravatar.cc/150?img=47" });
  
  // Profile Update State
  const [updateUsername, setUpdateUsername] = useState("");
  const [updatePassword, setUpdatePassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [settings, setSettings] = useState<any>(null);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [availableFriends, setAvailableFriends] = useState<any[]>([]);
  const [orderMessage, setOrderMessage] = useState("");
  const [selectedFriendId, setSelectedFriendId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  // All Orders State
  const [isViewingAll, setIsViewingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  // Navigation Blocker State
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveAction, setLeaveAction] = useState<"logout" | "back" | null>(null);

  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    // Navigation Trap
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
      setShowLeaveModal(true);
      setLeaveAction("back");
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const checkSession = () => {
      if (!sessionStorage.getItem("staffSession")) {
        window.location.replace("/admin/login");
      }
    };
    checkSession();
    window.addEventListener("pageshow", checkSession);

    fetchProfile();

    return () => {
      window.removeEventListener("pageshow", checkSession);
    };
  }, []);

  useEffect(() => {
    if (activeTab === 1) {
      fetchOrders();
      fetchAvailableFriends();
    } else if (activeTab === 2 || activeTab === 3) {
      fetchSettings();
    }
  }, [activeTab]);

  const fetchSettings = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
      const res = await fetch(`${apiUrl}/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettings({
          ...data,
          customFees: typeof data.customFees === 'string' ? JSON.parse(data.customFees) : (data.customFees || [])
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMessage("");
    try {
      const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
      const res = await fetch(`${apiUrl}/settings/staff`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSettingsMessage("Settings updated successfully");
        setTimeout(() => setSettingsMessage(""), 3000);
      } else {
        setSettingsMessage("Failed to update settings");
      }
    } catch (err) {
      setSettingsMessage("Error updating settings");
    }
  };

  const fetchProfile = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
      const res = await fetch(`${apiUrl}/staff/profile`, {
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
      window.location.replace("/admin/login");
    }
  };

  const handleLogout = async () => {
    setShowLeaveModal(true);
    setLeaveAction("logout");
  };

  const confirmLeave = async () => {
    if (leaveAction === "logout") {
      sessionStorage.removeItem("staffSession");
      const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
      await fetch(`${apiUrl}/staff/logout`, { method: "POST", credentials: "include" });
      window.location.replace("/");
    } else if (leaveAction === "back") {
      window.removeEventListener('popstate', () => {});
      window.history.back(); // Or redirect to home
      window.location.replace("/");
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
    
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
    const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
    const res = await fetch(`${apiUrl}/staff/orders`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setOrders(data);
    }
  };

  const fetchAvailableFriends = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
    const res = await fetch(`${apiUrl}/staff/available-friends`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setAvailableFriends(data);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string, message?: string, friendId?: string) => {
    const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
    await fetch(`${apiUrl}/staff/orders/${orderId}/status`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status, message, deliveryFriendId: friendId })
    });
    setOrderMessage("");
    setSelectedFriendId("");
    setSelectedOrder(null);
    fetchOrders();
    fetchAvailableFriends();
    setToastMessage(`Order ${status}`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleBulkDelete = async () => {
    if (selectedOrderIds.length === 0) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}`;
      const res = await fetch(`${apiUrl}/staff/orders/bulk-delete`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderIds: selectedOrderIds })
      });
      if (res.ok) {
        setSelectedOrderIds([]);
        setShowBulkDeleteModal(false);
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSelectOrder = (id: number) => {
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter(i => i !== id));
    } else {
      setSelectedOrderIds([...selectedOrderIds, id]);
    }
  };

  const toggleSelectAll = () => {
    const displayedOrderIds = displayedOrders.map(o => o.id);
    const allSelected = displayedOrderIds.every(id => selectedOrderIds.includes(id));
    if (allSelected) {
      setSelectedOrderIds(selectedOrderIds.filter(id => !displayedOrderIds.includes(id)));
    } else {
      const newSelections = displayedOrderIds.filter(id => !selectedOrderIds.includes(id));
      setSelectedOrderIds([...selectedOrderIds, ...newSelections]);
    }
  };

  const displayedOrders = isViewingAll 
    ? orders.filter(o => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        // search by customer username or dish
        const matchesCustomer = o.customer?.username?.toLowerCase().includes(q) || false;
        const matchesItems = o.items.some((item: any) => item.name.toLowerCase().includes(q));
        return matchesCustomer || matchesItems;
      })
    : orders;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F6EEED] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E04D2D]"></div>
      </div>
    );
  }

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

      <Modal 
        isOpen={showLeaveModal}
        title="Leave Dashboard?"
        desc="Are you sure you want to leave the dashboard? You will need to log in again to access the staff panel."
        onConfirm={confirmLeave}
        onCancel={() => setShowLeaveModal(false)}
        confirmText="Yes, Leave"
        isDestructive={true}
      />

      <Modal 
        isOpen={showBulkDeleteModal} 
        title="Delete Orders" 
        desc={`Are you sure you want to delete ${selectedOrderIds.length} selected order(s)? This action cannot be undone.`} 
        onConfirm={handleBulkDelete} 
        onCancel={() => setShowBulkDeleteModal(false)} 
        confirmText="Yes, Delete" 
        isDestructive={true} 
      />

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-[100px] h-screen py-8 px-4 border-r border-transparent">
        <div className="bg-white rounded-full flex flex-col items-center py-6 gap-8 h-full shadow-sm">
          {/* Dashboard Tab */}
          <button 
            onClick={() => handleTabChange(0)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTab === 0 ? 'bg-[#B2E624] text-black shadow-lg transform scale-105' : 'text-gray-400 hover:text-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
          </button>

          {/* Orders Tab */}
          <button 
            onClick={() => handleTabChange(1)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeTab === 1 ? 'bg-[#B2E624] text-black shadow-lg transform scale-105' : 'text-gray-400 hover:text-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </button>
          
          <div className="mt-auto"></div>
          
          {/* Settings Tab */}
          <button 
            onClick={() => handleTabChange(2)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all mb-4 ${activeTab === 2 ? 'bg-[#B2E624] text-black shadow-lg transform scale-105' : 'text-gray-400 hover:text-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>
          </button>

          {/* Fees Tab */}
          <button 
            onClick={() => handleTabChange(3)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all mb-4 ${activeTab === 3 ? 'bg-[#B2E624] text-black shadow-lg transform scale-105' : 'text-gray-400 hover:text-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="shrink-0 px-4 py-4 md:px-10 md:py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <h2 className="text-lg md:text-2xl font-bold text-gray-800">
              {activeTab === 0 ? 'Staff Dashboard' : activeTab === 1 ? 'Orders' : activeTab === 3 ? 'Fees & Charges' : 'Staff Settings'}
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

          {activeTab === 1 && !isViewingAll && (
            <div className="w-full min-h-[60vh] bg-white rounded-3xl md:rounded-[2rem] shadow-sm p-4 md:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">Pending Orders</h3>
                <button 
                  onClick={() => setIsViewingAll(true)}
                  className="bg-black text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {orders.filter(o => o.status === 'Pending' || o.status === 'Approved' || o.status === 'Ready for Pickup' || o.status === 'Out for Delivery').map(order => (
                  <div key={order.id} className={`border rounded-2xl p-6 shadow-sm relative ${order.status === 'Delivered' ? 'border-green-200 bg-green-50' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">Order by {order.customer?.username || `Customer #${order.customerId}`}</h4>
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
                            <span className={`w-3 h-3 rounded-full ${item.isVeg === "true" || item.isVeg === true ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="font-medium flex-1">{item.name}</span>
                            <span className="text-gray-500">x{item.quantity}</span>
                            <span className="font-semibold text-gray-700">₹{parseInt(item.priceText.replace(/[^\d]/g, '')) * item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {order.deliveryType === 'Delivery' && (
                      <div className="mb-4 bg-white p-4 rounded-xl border border-gray-100">
                        <h5 className="font-semibold text-gray-700 mb-3">Order Receiving Details:</h5>
                        <div className="flex gap-4">
                          {order.homeImage && (
                            <img src={`${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${order.homeImage}`} alt="Home" className="w-24 h-24 rounded-lg object-cover border border-gray-200" />
                          )}
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium text-gray-500">Receiver:</span> {order.receiverName || 'Not provided'}</p>
                            <p><span className="font-medium text-gray-500">Mobile:</span> {order.receiverMobile || 'Not provided'}</p>
                            <p><span className="font-medium text-gray-500">Location:</span> {order.customerLocation || 'Not provided'}</p>
                            <p><span className="font-medium text-gray-500">Address:</span> {order.streetAddress || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {order.status === 'Approved' && (
                      <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="text-sm">
                          {order.deliveryType === 'Pickup' ? (
                            <span className="font-bold">Customer will pick up</span>
                          ) : (
                            <>Assigned to: <span className="font-bold">{order.deliveryFriend?.name}</span> ({order.deliveryFriend?.uniqueId})</>
                          )}
                        </div>
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, order.deliveryType === 'Pickup' ? 'Ready for Pickup' : 'Out for Delivery')}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-xl transition-colors shadow-md w-full sm:w-auto"
                        >
                          {order.deliveryType === 'Pickup' ? 'Order prepared, please pick it up' : 'Food Prepared, Delivery is on the way'}
                        </button>
                      </div>
                    )}

                    {order.status === 'Ready for Pickup' && (
                      <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="text-sm font-bold text-green-600">Waiting for customer to pick up...</div>
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-xl transition-colors shadow-md w-full sm:w-auto"
                        >
                          Mark as Delivered
                        </button>
                      </div>
                    )}

                    {order.status === 'Out for Delivery' && (
                      <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="text-sm font-bold text-blue-600">Out for delivery by {order.deliveryFriend?.name || "partner"}</div>
                        <button 
                          onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-xl transition-colors shadow-md w-full sm:w-auto"
                        >
                          Mark as Delivered (Override)
                        </button>
                      </div>
                    )}

                    {order.status === 'Pending' && selectedOrder !== order.id && (
                      <button 
                        onClick={() => { setSelectedOrder(order.id); setOrderMessage(""); setSelectedFriendId(""); }}
                        className="bg-black text-white px-6 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors w-full mt-4"
                      >
                        Process Order
                      </button>
                    )}

                    {selectedOrder === order.id && (
                      <div className="mt-4 p-4 bg-gray-100 border border-gray-200 rounded-xl">
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col">
                            <h6 className="font-bold mb-2">Approve Order</h6>
                            {order.deliveryType === 'Pickup' ? (
                              <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 mb-auto text-gray-500 font-bold">
                                I will pick up (No partner needed)
                              </div>
                            ) : (
                              <select 
                                value={selectedFriendId}
                                onChange={(e) => setSelectedFriendId(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none bg-gray-50 mb-auto"
                              >
                                <option value="">Select a Delivery Partner...</option>
                                {availableFriends.map(f => (
                                  <option key={f.id} value={f.id}>{f.name} ({f.uniqueId}) - {f.mobile}</option>
                                ))}
                              </select>
                            )}
                            <button 
                              onClick={() => {
                                if (order.deliveryType !== 'Pickup' && !selectedFriendId) {
                                  setToastMessage("Please select a delivery partner to approve");
                                  setTimeout(() => setToastMessage(""), 3000);
                                  return;
                                }
                                handleUpdateOrderStatus(order.id, 'Approved', "", selectedFriendId);
                              }}
                              className="w-full mt-3 bg-[#B2E624] text-black py-3 rounded-xl font-bold shadow-md hover:bg-[#9bd41c] transition-colors"
                            >
                              Approve Order
                            </button>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-red-100 flex flex-col">
                            <h6 className="font-bold text-red-600 mb-2">Reject Order</h6>
                            <textarea 
                              placeholder="Mandatory message for rejection (e.g. Items out of stock)"
                              value={orderMessage}
                              onChange={(e) => setOrderMessage(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none transition-colors resize-none h-20 mb-auto"
                            />
                            <button 
                              onClick={() => {
                                if (!orderMessage) {
                                  setToastMessage("Message is mandatory for rejection!");
                                  setTimeout(() => setToastMessage(""), 3000);
                                  return;
                                }
                                handleUpdateOrderStatus(order.id, 'Rejected', orderMessage);
                              }}
                              className="w-full mt-3 bg-red-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-red-600 transition-colors"
                            >
                              Reject Order
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={() => { setSelectedOrder(null); setOrderMessage(""); setSelectedFriendId(""); }}
                          className="w-full text-gray-500 hover:text-black font-semibold py-3 mt-2"
                        >
                          Cancel Processing
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {orders.filter(o => o.status === 'Pending' || o.status === 'Approved' || o.status === 'Ready for Pickup' || o.status === 'Out for Delivery').length === 0 && (
                  <div className="text-center py-12 text-gray-400 font-bold">
                    No pending orders right now.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 1 && isViewingAll && (
            <div className="w-full bg-white rounded-3xl md:rounded-[2rem] shadow-sm overflow-hidden flex flex-col relative h-[80vh]">
              <div className="md:sticky md:top-0 bg-white/95 backdrop-blur-md z-20 border-b border-gray-100 px-6 py-4 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsViewingAll(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                    Back
                  </button>
                  <h1 className="text-xl md:text-2xl font-bold">All Orders</h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search by customer or dish name..." 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#B2E624]" 
                    />
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700 shrink-0">
                      <input 
                        type="checkbox" 
                        checked={displayedOrders.length > 0 && displayedOrders.every(o => selectedOrderIds.includes(o.id))}
                        onChange={toggleSelectAll}
                        className="w-5 h-5 accent-black"
                      />
                      Select All
                    </label>
                    <button 
                      onClick={() => setShowBulkDeleteModal(true)}
                      disabled={selectedOrderIds.length === 0}
                      className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors shrink-0 ${selectedOrderIds.length > 0 ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                      Delete Selected ({selectedOrderIds.length})
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {displayedOrders.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 font-bold">No orders found.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayedOrders.map((order: any) => (
                      <div 
                        key={order.id} 
                        onClick={() => toggleSelectOrder(order.id)} 
                        className={`cursor-pointer border rounded-2xl p-6 flex flex-col transition-shadow relative ${
                          selectedOrderIds.includes(order.id) 
                            ? 'border-[#B2E624] bg-[#B2E624]/5 shadow-sm' 
                            : order.status === 'Delivered'
                              ? 'border-green-200 bg-green-50 hover:shadow-md'
                              : 'border-gray-100 bg-white hover:shadow-md'
                        }`}
                      >
                        <div className="absolute top-4 right-4 z-10">
                          <input 
                            type="checkbox" 
                            checked={selectedOrderIds.includes(order.id)}
                            onChange={() => toggleSelectOrder(order.id)}
                            className="w-5 h-5 accent-black cursor-pointer"
                          />
                        </div>
                        <div className="flex justify-between items-start mb-4 pr-8">
                          <div>
                            <h3 className="text-lg font-bold">Order by {order.customer?.username || `Customer #${order.customerId}`}</h3>
                            <div className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                              order.status === 'Approved' || order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'Rejected' || order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4 bg-white p-4 rounded-xl border border-gray-100">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg === "true" || item.isVeg === true ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                <span className="font-medium">{item.name}</span>
                                <span className="text-gray-500">x{item.quantity}</span>
                              </div>
                              <span className="font-bold text-gray-700">₹{parseInt(item.priceText.replace(/[^\d]/g, '')) * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {order.deliveryType === 'Delivery' && (
                          <div className="mb-4 bg-white p-4 rounded-xl border border-gray-100">
                            <h5 className="font-semibold text-gray-700 mb-3">Order Receiving Details:</h5>
                            <div className="flex gap-4">
                              {order.homeImage && (
                                <img src={`${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${order.homeImage}`} alt="Home" className="w-24 h-24 rounded-lg object-cover border border-gray-200" />
                              )}
                              <div className="text-sm space-y-1">
                                <p><span className="font-medium text-gray-500">Receiver:</span> {order.receiverName || 'Not provided'}</p>
                                <p><span className="font-medium text-gray-500">Mobile:</span> {order.receiverMobile || 'Not provided'}</p>
                                <p><span className="font-medium text-gray-500">Location:</span> {order.customerLocation || 'Not provided'}</p>
                                <p><span className="font-medium text-gray-500">Address:</span> {order.streetAddress || 'Not provided'}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                          <span className="text-sm font-medium text-gray-500">Payment: {order.paymentMethod}</span>
                          <div className="text-lg font-black">₹{order.totalAmount}</div>
                        </div>
                      </div>
                    ))}
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

          {activeTab === 3 && settings && (
            <div className="w-full min-h-[60vh] bg-white rounded-3xl md:rounded-[2rem] shadow-sm p-4 md:p-8 max-w-3xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 md:mb-8">Fees & Charges Settings</h3>
                {settingsMessage && (
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-200 mb-6">
                    {settingsMessage}
                  </div>
                )}
                <form onSubmit={handleUpdateSettings} className="space-y-6 md:space-y-8">
                  
                  {/* GST Section */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-800 text-lg">GST</h4>
                        <input 
                          type="number" 
                          value={settings.gstPercentage}
                          onChange={(e) => setSettings({...settings, gstPercentage: parseInt(e.target.value) || 0})}
                          className="w-16 px-2 py-1 text-center rounded-lg border border-gray-300 font-bold"
                        />
                        <span className="font-bold text-gray-800">%</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Automatically calculates {settings.gstPercentage}% tax on the order subtotal.</p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={settings.gstEnabled} onChange={(e) => setSettings({...settings, gstEnabled: e.target.checked})} />
                        <div className={`block w-14 h-8 rounded-full transition-colors ${settings.gstEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${settings.gstEnabled ? 'transform translate-x-6' : ''}`}></div>
                      </div>
                    </label>
                  </div>

                  {/* Delivery, Platform & Table Booking Fees */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Charge (₹)</label>
                      <input 
                        type="number" 
                        value={settings.deliveryCharge}
                        onChange={(e) => setSettings({...settings, deliveryCharge: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#B2E624] focus:ring-1 focus:ring-[#B2E624] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Platform Fee (₹)</label>
                      <input 
                        type="number" 
                        value={settings.platformFee}
                        onChange={(e) => setSettings({...settings, platformFee: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#B2E624] focus:ring-1 focus:ring-[#B2E624] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Table Booking Fee (₹)</label>
                      <input 
                        type="number" 
                        value={settings.tableBookingFee || 0}
                        onChange={(e) => setSettings({...settings, tableBookingFee: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#B2E624] focus:ring-1 focus:ring-[#B2E624] bg-white"
                      />
                    </div>
                  </div>

                  {/* Custom Fees / Discounts */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-gray-800 text-lg">Custom Discounts & Offers</h4>
                      <button type="button" onClick={() => setSettings({...settings, customFees: [...settings.customFees, {title: '', value: 0, isDiscount: false}]})} className="text-sm font-bold bg-black text-white px-4 py-2 rounded-xl">Add Field</button>
                    </div>
                    
                    <div className="space-y-4">
                      {settings.customFees.map((fee: any, idx: number) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl items-center">
                          <input 
                            type="text" 
                            placeholder="Title (e.g. Weekend Offer)" 
                            value={fee.title}
                            onChange={(e) => {
                              const newFees = [...settings.customFees];
                              newFees[idx].title = e.target.value;
                              setSettings({...settings, customFees: newFees});
                            }}
                            className="w-full flex-1 px-4 py-2 rounded-xl border border-gray-200"
                          />
                          <div className="flex gap-2 w-full sm:w-auto">
                            <select 
                              value={fee.isDiscount ? 'discount' : 'charge'}
                              onChange={(e) => {
                                const newFees = [...settings.customFees];
                                newFees[idx].isDiscount = e.target.value === 'discount';
                                setSettings({...settings, customFees: newFees});
                              }}
                              className="px-4 py-2 rounded-xl border border-gray-200 bg-white shrink-0"
                            >
                              <option value="charge">Extra Charge</option>
                              <option value="discount">Discount</option>
                            </select>
                            <input 
                              type="number" 
                              placeholder="₹ Value" 
                              value={fee.value}
                              onChange={(e) => {
                                const newFees = [...settings.customFees];
                                newFees[idx].value = parseInt(e.target.value) || 0;
                                setSettings({...settings, customFees: newFees});
                              }}
                              className="w-24 px-4 py-2 rounded-xl border border-gray-200"
                            />
                          </div>
                          <button type="button" onClick={() => {
                            const newFees = [...settings.customFees];
                            newFees.splice(idx, 1);
                            setSettings({...settings, customFees: newFees});
                          }} className="text-red-500 font-bold p-2 hover:bg-red-50 rounded-lg">Remove</button>
                        </div>
                      ))}
                      {settings.customFees.length === 0 && (
                        <div className="text-center py-6 text-gray-400 text-sm">No custom fields added.</div>
                      )}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="bg-[#B2E624] text-black px-8 py-3 rounded-xl font-bold hover:bg-[#9bd41c] transition-colors shadow-lg"
                  >
                    Save Fees Settings
                  </button>
                </form>
              </div>
          )}
        </div>
      </main>
    </div>
  );
}
