import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Minus, Settings, Calendar, Menu as MenuIcon, ShoppingBag, MapPin, User, LogOut, Upload, Info, Check, ArrowLeft, ArrowRight, X } from "lucide-react";
import { Modal } from "../../components/ui/Modal";

// ------------------------ Orders Tab ------------------------
function OrdersTab({ setCart, handleTabChange }: any) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("All");
  const [historySortOrder, setHistorySortOrder] = useState("Recent");
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const fetchOrders = () => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/orders`, { credentials: "include" })
      .then(r => r.json()).then(setOrders).catch(() => {});
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/orders/${orderId}/cancel`, {
        method: "PUT",
        credentials: "include"
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedOrderIds.length === 0) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/orders/bulk-delete`, {
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

  const activeOrders = orders.filter(o => !['Delivered', 'Rejected', 'Cancelled'].includes(o.status));
  const historyOrders = orders.filter(o => ['Delivered', 'Rejected', 'Cancelled'].includes(o.status));

  const displayedHistoryOrders = historyOrders
    .filter(o => {
      if (historyStatusFilter !== "All" && o.status !== historyStatusFilter) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return o.items.some((item: any) => item.name.toLowerCase().includes(q));
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return historySortOrder === "Recent" ? dateB - dateA : dateA - dateB;
    });

  const toggleSelectAll = () => {
    const displayedOrderIds = displayedHistoryOrders.map(o => o.id);
    const allSelected = displayedOrderIds.length > 0 && displayedOrderIds.every(id => selectedOrderIds.includes(id));
    if (allSelected) {
      setSelectedOrderIds(selectedOrderIds.filter(id => !displayedOrderIds.includes(id)));
    } else {
      const newSelections = displayedOrderIds.filter(id => !selectedOrderIds.includes(id));
      setSelectedOrderIds([...selectedOrderIds, ...newSelections]);
    }
  };

  const handleReorder = (order: any) => {
    const newCart = order.items.map((item: any) => ({ ...item, quantity: item.quantity || 1 }));
    setCart(newCart);
    handleTabChange("Checkout");
  };

  const OrderCard = ({ order, selectable = false }: { order: any, selectable?: boolean }) => (
    <div className={`border rounded-2xl p-6 shadow-sm flex flex-col relative transition-shadow ${
      selectable ? 'cursor-pointer hover:shadow-md' : ''
    } ${
      selectedOrderIds.includes(order.id) 
        ? 'border-[#B2E624] bg-[#B2E624]/5' 
        : order.status === 'Delivered' 
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-100 bg-white'
    }`}>
      {selectable && (
        <div className="absolute top-4 right-4 z-10">
          <input 
            type="checkbox" 
            checked={selectedOrderIds.includes(order.id)}
            onChange={() => toggleSelectOrder(order.id)}
            className="w-5 h-5 accent-black cursor-pointer"
          />
        </div>
      )}
      <div className={`flex justify-between items-start mb-4 ${selectable ? 'pr-8' : ''}`}>
        <div>
          <h3 className="text-lg font-bold">Order #{order.id}</h3>
          <div className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
            order.status === 'Approved' ? 'bg-green-100 text-green-700' :
            order.status === 'Rejected' || order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {order.status}
          </span>
          {order.status === 'Pending' && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleCancelOrder(order.id); }}
              className="text-xs text-red-500 font-bold hover:underline"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
      
      {order.staffMessage && order.status !== 'Approved' && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${order.status === 'Rejected' || order.status === 'Cancelled' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          <span className="font-bold">Staff Note: </span>{order.staffMessage}
        </div>
      )}
      
      {order.status === 'Approved' && (
        <div className="mb-4 text-lg font-bold text-green-600 bg-green-50 p-3 rounded-xl border border-green-200">
          {order.deliveryType === 'Pickup' ? 'Preparing your order' : 'Preparing your order'}
        </div>
      )}

      {order.status === 'Ready for Pickup' && order.deliveryType === 'Pickup' && (
        <div className="mb-4 text-lg font-bold text-green-600 bg-green-50 p-3 rounded-xl border border-green-200">
          Order prepared please pick it up
        </div>
      )}

      {order.deliveryFriend && (
        <div className="mb-4 bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#B2E624] bg-white">
              <img src={order.deliveryFriend.profileImage ? (order.deliveryFriend.profileImage.startsWith('http') ? order.deliveryFriend.profileImage : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${order.deliveryFriend.profileImage}`) : "https://i.pravatar.cc/150?img=11"} className="w-full h-full object-cover" alt="Delivery Partner" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Delivery Partner Assigned</h4>
              <p className="text-gray-600 font-semibold">{order.deliveryFriend.name}</p>
            </div>
          </div>
          {order.status !== 'Delivered' && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                alert(`Calling ${order.deliveryFriend.name}...`);
              }}
              className="bg-black text-white px-4 py-2 rounded-xl font-bold shadow-md hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Call
            </button>
          )}
        </div>
      )}

      <div className="space-y-2 mb-4 bg-gray-50 p-4 rounded-xl">
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

      <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
        <span className="text-sm font-medium text-gray-500">Payment: {order.paymentMethod}</span>
        <div className="text-lg font-black">₹{order.totalAmount}</div>
      </div>
      {selectable && (
        <button 
          onClick={(e) => { e.stopPropagation(); handleReorder(order); }}
          className="mt-4 w-full py-2 bg-black hover:bg-gray-800 text-[#B2E624] font-bold rounded-xl transition-colors shadow-md"
        >
          Reorder
        </button>
      )}
    </div>
  );

  if (isViewingHistory) {
    return (
      <div className="h-full flex flex-col bg-transparent relative">
        <Modal 
          isOpen={showBulkDeleteModal} 
          title="Delete Orders" 
          desc={`Are you sure you want to delete ${selectedOrderIds.length} selected order(s)? This action cannot be undone.`} 
          onConfirm={handleBulkDelete} 
          onCancel={() => setShowBulkDeleteModal(false)} 
          confirmText="Yes, Delete" 
          isDestructive={true} 
        />
        <div className="sticky top-0 bg-[#f9fafb]/95 backdrop-blur-md z-20 border-b border-gray-200 px-4 py-4 flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => setIsViewingHistory(false)} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
              Back
            </button>
            <div className="relative w-full md:w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B2E624] shadow-sm" 
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-4 items-center justify-between w-full md:w-auto">
            <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <select 
                value={historyStatusFilter}
                onChange={(e) => setHistoryStatusFilter(e.target.value)}
                className="bg-white border border-gray-200 shadow-sm rounded-xl text-sm px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-[#B2E624] w-full sm:w-auto"
              >
                <option value="All">All Statuses</option>
                <option value="Delivered">Delivered</option>
                <option value="Rejected">Rejected</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <select 
                value={historySortOrder}
                onChange={(e) => setHistorySortOrder(e.target.value)}
                className="bg-white border border-gray-200 shadow-sm rounded-xl text-sm px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-[#B2E624] w-full sm:w-auto"
              >
                <option value="Recent">Recent First</option>
                <option value="Oldest">Oldest First</option>
              </select>
            </div>
            
            <div className="flex items-center justify-end gap-4 w-full sm:w-auto">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-gray-700 shrink-0">
                <input 
                  type="checkbox" 
                  checked={displayedHistoryOrders.length > 0 && displayedHistoryOrders.every(o => selectedOrderIds.includes(o.id))}
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
                Delete ({selectedOrderIds.length})
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {displayedHistoryOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-bold">No history orders found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedHistoryOrders.map((order: any) => (
                <div key={order.id} onClick={() => toggleSelectOrder(order.id)} className="cursor-pointer">
                  <OrderCard order={order} selectable={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-transparent pt-2">
    <div className="flex justify-end items-center mb-4">
      {historyOrders.length > 0 && (
        <button 
          onClick={() => setIsViewingHistory(true)}
          className="text-sm font-bold text-[#B2E624] bg-black px-6 py-2 rounded-full shadow-md hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          History
        </button>
      )}
    </div>
      <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide">
        {activeOrders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Active Orders</h2>
            <p className="text-gray-500 max-w-sm">You don't have any pending orders. Explore our menu to place a new order!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {activeOrders.map((order: any) => (
              <OrderCard key={order.id} order={order} selectable={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------ Menu Tab ------------------------
function MenuTab({ cart, setCart, setShowCartPanel }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const categories = [{id: "all", name: "All"}, {id: "nonveg", name: "Main Course (Non-Veg)"}, {id: "soups", name: "Soups"}, {id: "starters", name: "Starters"}, {id: "chinese", name: "Chinese"}, {id: "veg", name: "Main Course (Veg)"}, {id: "bev", name: "Beverages & Salads"}, {id: "bread", name: "Breads"}, {id: "biryani", name: "Biryani & Rice"}, {id: "dessert", name: "Desserts"}];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/menu`).then(r => r.json()).then(setItems);
  }, []);

  const handleAddToCart = (item: any) => {
    const existing = cart.find((i: any) => i.id === item.id);
    if (existing) {
      setCart(cart.map((i: any) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (item: any) => {
    const existing = cart.find((i: any) => i.id === item.id);
    if (existing) {
      if (existing.quantity > 1) {
        setCart(cart.map((i: any) => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i));
      } else {
        setCart(cart.filter((i: any) => i.id !== item.id));
      }
    }
  };

  const filteredItems = items.filter((item: any) => {
    if (item.priceText && item.priceText.toLowerCase().includes("catch")) return false;
    const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const MenuItemCard = ({ item }: { item: any }) => {
    const cartItem = cart.find((i: any) => i.id === item.id);
    return (
    <div className="group flex flex-col cursor-pointer" onClick={() => handleAddToCart(item)}>
      <div className="relative w-full aspect-square rounded-xl md:rounded-2xl overflow-hidden mb-2 md:mb-3">
        <img src={item.image.startsWith('http') ? item.image : (item.image.startsWith('/') && !item.image.startsWith('/uploads') ? item.image : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${item.image}`)} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold text-gray-700 flex items-center gap-1 shadow-sm">
          <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg === 'true' || item.isVeg === true ? 'bg-green-500' : 'bg-red-500'}`}></span>
          {item.isVeg === 'true' || item.isVeg === true ? 'VEG' : 'NON-VEG'}
        </div>
        {cartItem ? (
          <div className="absolute bottom-2 right-2 bg-black text-white rounded-full flex items-center gap-2 px-2 py-1 shadow-lg z-10" onClick={(e) => e.stopPropagation()}>
            <button onClick={(e) => { e.stopPropagation(); handleRemoveFromCart(item); }} className="w-5 h-5 flex items-center justify-center hover:bg-gray-800 rounded-full">
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold w-4 text-center">{cartItem.quantity}</span>
            <button onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }} className="w-5 h-5 flex items-center justify-center hover:bg-gray-800 rounded-full">
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
            className="absolute bottom-2 right-2 bg-black text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:bg-[#E04D2D]"
          >
            <Plus className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        )}
      </div>
      <div className="px-0.5">
        <h3 className="text-[10px] md:text-sm font-bold leading-tight mb-0.5 group-hover:text-[#E04D2D] transition-colors line-clamp-1">{item.name}</h3>
        <p className="text-[8px] md:text-xs text-gray-400 line-clamp-1 mb-1">{item.description}</p>
        <div className="text-xs md:text-base font-black text-black">{/^\d/.test(item.priceText) ? `₹${item.priceText}` : item.priceText}</div>
      </div>
    </div>
  )};

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="sticky top-0 z-20 bg-[#F8F9FB]/95 backdrop-blur-md pb-2 pt-2 flex flex-col">
        <div className="flex flex-row items-center gap-2 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-white border border-gray-100 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#B2E624]" />
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="md:hidden bg-white border border-gray-100 rounded-xl text-[10px] sm:text-xs px-2 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-[#B2E624] w-24 shrink-0"
          >
            <option value="All">All Items</option>
            {categories.slice(1).map((c: any) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Desktop tags - hidden on mobile, single line */}
        <div className="hidden md:flex flex-nowrap items-center justify-between gap-1 w-full overflow-hidden">
          <button onClick={() => setSelectedCategory("All")} className={`px-2 py-1 rounded-full text-[9px] font-bold transition-all shrink-0 ${selectedCategory === "All" ? 'bg-black text-white shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>All Items</button>
          {categories.slice(1).map((c: any) => (
            <button key={c.id} onClick={() => setSelectedCategory(c.name)} className={`px-2 py-1 rounded-full text-[9px] font-bold transition-all shrink-0 whitespace-nowrap overflow-hidden text-ellipsis ${selectedCategory === c.name ? 'bg-black text-white shadow-sm' : 'bg-white text-gray-500 hover:bg-gray-100'}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 mt-2 md:mt-4">
          {filteredItems.map((item: any) => <MenuItemCard key={item.id} item={item} />)}
          {filteredItems.length === 0 && <div className="col-span-full py-12 text-center text-gray-500">No dishes found.</div>}
        </div>
      </div>

      {cart.length > 0 && (
        <div 
          onClick={() => setShowCartPanel(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto bg-black text-white px-6 py-4 rounded-full shadow-2xl z-[100] flex items-center justify-between gap-6 hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
              {cart.reduce((a: number, b: any) => a + b.quantity, 0)}
            </div>
            <span className="font-bold text-sm">Item{cart.length > 1 ? 's' : ''} Added</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-[#B2E624] text-sm">
            View Cart <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}
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
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/events`).then(r => r.json()).then(d => setEvents(d.filter((e:any) => e.isEnabled)));
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/events`, { credentials: "include" }).then(r => r.json()).then(setMyEvents).catch(() => {});
  }, []);

  const handleBook = async () => {
    if (!bookingEvent) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/events/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ eventId: bookingEvent.id })
      });
      if (!res.ok) throw new Error("Failed to book");
      const bookingData = await res.json();
      const bookingId = bookingData.booking.id;

      if (bookingEvent.price > 0) {
        const loadRazorpayScript = () => new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
        const resScript = await loadRazorpayScript();
        if (!resScript) { alert("Razorpay SDK failed to load."); return; }

        const rzpRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/payments/razorpay/create-order`, {
          method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
          body: JSON.stringify({ type: 'ticket_booking', id: bookingId })
        });
        const rzpOrder = await rzpRes.json();

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_dummy_key", 
          amount: rzpOrder.amount, currency: rzpOrder.currency, name: "Crave",
          description: "Event Ticket Booking", order_id: rzpOrder.id,
          handler: async function (response: any) {
            const verifyRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/payments/razorpay/verify`, {
              method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
              body: JSON.stringify({
                type: 'ticket_booking', id: bookingId, razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature
              })
            });
            if (verifyRes.ok) {
              fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/events`, { credentials: "include" }).then(r => r.json()).then(setMyEvents);
              alert("Payment successful! Ticket confirmed.");
            } else {
              alert("Payment verification failed.");
            }
          }, theme: { color: "#B2E624" }
        };
        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      } else {
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/events`, { credentials: "include" }).then(r => r.json()).then(setMyEvents);
        alert("Event booked successfully!");
      }
    } finally {
      setBookingEvent(null);
    }
  };

  const displayedEvents = activeTab === "All Events" ? events : myEvents.map((b: any) => b.event).filter(Boolean);
  const filteredEvents = displayedEvents.filter((e: any) => e.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-full flex flex-col bg-transparent relative">
      <Modal isOpen={!!bookingEvent} title="Book Event" desc={`Are you sure you want to book a ticket for "${bookingEvent?.title}"?`} onConfirm={handleBook} onCancel={() => setBookingEvent(null)} confirmText="Yes, Book" />
      
      <div className="sticky top-0 z-10 bg-[#F8F9FB]/95 backdrop-blur-md pb-3 pt-2 flex flex-row items-center gap-3 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B2E624]" />
        </div>
        <div className="flex bg-gray-100 rounded-full p-1 shrink-0">
          {["All Events", "My Events"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-gray-500'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredEvents.map((ev: any, idx: number) => {
            const booking = activeTab === "My Events" ? myEvents.find((b: any) => b.eventId === ev.id) : null;
            return (
              <div key={`${ev.id}-${idx}`} className="group flex flex-col cursor-pointer hover:opacity-90 transition-opacity">
                <div className="h-32 md:h-48 w-full relative rounded-xl overflow-hidden bg-gray-100">
                  <img src={ev.image.startsWith('http') ? ev.image : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${ev.image}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={ev.title} />
                  <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-white/90 backdrop-blur-md rounded-lg md:rounded-xl p-1.5 md:p-2 flex flex-col items-center justify-center min-w-[40px] md:min-w-[50px] shadow-sm">
                    <span className="text-gray-500 text-[8px] md:text-[10px] font-bold uppercase">{new Date(ev.date).toLocaleString('default', {month:'short'})}</span>
                    <span className="text-black text-sm md:text-lg font-black leading-none">{new Date(ev.date).getDate()}</span>
                  </div>
                  {activeTab === "My Events" && booking && (
                    <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-[#B2E624] text-black px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold shadow-sm">
                      {booking.status}
                    </div>
                  )}
                </div>
                <div className="pt-2 flex flex-col flex-1">
                  <div className="flex items-center gap-1 text-gray-500 text-[9px] md:text-xs font-bold uppercase mb-1"><MapPin className="w-3 h-3" /> {ev.location}</div>
                  <h3 className="text-base md:text-xl font-bold mb-1.5 md:mb-2 line-clamp-1">{ev.title}</h3>
                  <p className="text-gray-500 text-xs md:text-sm line-clamp-2 mb-4 md:mb-6">{ev.subtitle}</p>
                  
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
function ReservationsTab({ onPay }: { onPay: (id: number) => void }) {
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/reservations/my`, { credentials: "include" })
      .then(r => r.json()).then(setReservations).catch(() => {});
  }, []);

  return (
    <div className="h-full flex flex-col bg-transparent pt-2">
      <div className="flex-1 overflow-y-auto pr-2 pb-4 scrollbar-hide">
        {reservations.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No reservations found.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {reservations.map((res: any) => (
              <div key={res.id} className="border border-gray-100 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                    <h3 className="text-base md:text-lg font-bold">{res.date} at {res.time}</h3>
                    <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold ${
                      res.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      res.status === 'Payment Pending' ? 'bg-orange-100 text-orange-700' :
                      res.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs md:text-sm flex flex-col sm:flex-row sm:gap-4">
                    <span><User className="inline w-3 h-3 mr-1"/>{res.name}</span>
                    <span><Info className="inline w-3 h-3 mr-1"/>{res.phone}</span>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2 text-[10px] md:text-sm text-gray-400 mt-2 md:mt-0">
                  <span>Booked on {new Date(res.createdAt).toLocaleDateString()}</span>
                  {res.status === 'Payment Pending' && (
                    <button 
                      onClick={() => onPay(res.id)}
                      className="px-4 py-2 bg-[#B2E624] text-black font-bold rounded-xl shadow-md hover:bg-[#a1d020] transition-colors"
                    >
                      Pay Now
                    </button>
                  )}
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
  const [profile, setProfile] = useState({ fullName: user.fullName||'', mobile: user.mobile||'', profileImage: user.profileImage||'' });
  const [delivery, setDelivery] = useState({ 
    deliveryLocation: user.deliveryLocation||'', 
    streetAddress: user.streetAddress||'', 
    receiverName: user.receiverName||'', 
    receiverMobile: user.receiverMobile||'', 
    homeImage: user.homeImage||'' 
  });
  const [pass, setPass] = useState({ previousPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleProfileSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/profile`, {
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

  const handleDeliverySubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/delivery-details`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(delivery)
      });
      if (res.ok) {
        setMsg({ text: "Delivery details updated successfully", type: "success" });
        onUpdate();
      } else throw new Error();
    } catch {
      setMsg({ text: "Failed to update delivery details", type: "error" });
    }
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handlePassSubmit = async (e: any) => {
    e.preventDefault();
    if (pass.newPassword !== pass.confirmPassword) return setMsg({ text: "Passwords don't match", type: "error" });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/password`, {
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
    if (!e.target.files || !e.target.files[0]) return;
    const fd = new FormData();
    fd.append("image", e.target.files[0]);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/upload`, { method: "POST", credentials: "include", body: fd });
      const data = await res.json();
      if (res.ok) setProfile({ ...profile, profileImage: data.url });
    } catch {}
  };

  const handleHomeImageUpload = async (e: any) => {
    if (!e.target.files || !e.target.files[0]) return;
    const fd = new FormData();
    fd.append("image", e.target.files[0]);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/upload-home`, { method: "POST", credentials: "include", body: fd });
      const data = await res.json();
      if (res.ok) {
        setDelivery({ ...delivery, homeImage: data.url });
        alert("Home image uploaded successfully!");
      }
    } catch {}
  };

  return (
    <div className="h-full flex flex-col bg-transparent relative overflow-hidden pt-2">
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
                {profile.profileImage ? <img src={profile.profileImage.startsWith('http') ? profile.profileImage : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${profile.profileImage}`} className="w-full h-full object-cover" /> : <User className="w-10 h-10 m-6 text-gray-400" />}
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
            </div>
            <button type="submit" className="px-8 py-3 bg-[#B2E624] text-black font-bold rounded-xl hover:bg-[#a0d21d] transition-colors shadow-lg shadow-[#B2E624]/20">Save Profile</button>
          </form>

          {/* Delivery Details Section */}
          <h2 className="text-lg font-bold mt-12 mb-6">Order Receiving Details</h2>
          <form onSubmit={handleDeliverySubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-32 h-24 rounded-xl bg-gray-100 overflow-hidden relative border-4 border-white shadow-sm flex items-center justify-center text-gray-400">
                {delivery.homeImage ? <img src={delivery.homeImage.startsWith('http') ? delivery.homeImage : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${delivery.homeImage}`} className="w-full h-full object-cover" /> : <span className="text-xs font-semibold">Home Image</span>}
              </div>
              <div>
                <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload Home Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleHomeImageUpload} />
                </label>
                <p className="text-xs text-gray-400 mt-2">Help drivers find your door faster</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Delivery Location</label>
                <input required type="text" value={delivery.deliveryLocation} onChange={e=>setDelivery({...delivery, deliveryLocation: e.target.value})} placeholder="City, Area (e.g. Gokak, Belagavi)" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B2E624]" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Street Address</label>
                <input required type="text" value={delivery.streetAddress} onChange={e=>setDelivery({...delivery, streetAddress: e.target.value})} placeholder="House No., Street Name, Landmark" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B2E624]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Receiver's Name</label>
                <input required type="text" value={delivery.receiverName} onChange={e=>setDelivery({...delivery, receiverName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B2E624]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Receiver's Mobile</label>
                <input required type="text" value={delivery.receiverMobile} onChange={e=>setDelivery({...delivery, receiverMobile: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B2E624]" />
              </div>
            </div>
            <button type="submit" className="px-8 py-3 bg-black text-[#B2E624] font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg">Save Delivery Details</button>
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

// ------------------------ Checkout Tab ------------------------
function CheckoutTab({ user, cart, setCart, handleTabChange, setReservationSuccessMsg, settings }: any) {
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState("Cash on Delivery");
  const [checkoutDeliveryType, setCheckoutDeliveryType] = useState("Delivery");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const subtotal = cart.reduce((total: number, item: any) => total + (parseInt(item.priceText.replace(/[^\d]/g, '')) * item.quantity), 0);

  // Dynamic Calculations
  const platformFee = settings?.platformFee || 0;
  const deliveryCharge = checkoutDeliveryType === "Delivery" ? (settings?.deliveryCharge || 0) : 0;
  const gstAmount = settings?.gstEnabled ? Math.round(subtotal * ((settings?.gstPercentage || 18) / 100)) : 0;
  
  // Custom Fees logic
  const customFees = settings?.customFees || [];
  let customFeesTotal = 0;
  const calculatedCustomFees = customFees.map((fee: any) => {
    const amount = fee.isDiscount ? -Math.abs(fee.value) : Math.abs(fee.value);
    customFeesTotal += amount;
    return { ...fee, amount };
  });

  const finalTotal = subtotal + platformFee + deliveryCharge + gstAmount + customFeesTotal;

  const feeBreakdown = {
    subtotal,
    platformFee,
    deliveryCharge,
    gstEnabled: settings?.gstEnabled,
    gstPercentage: settings?.gstPercentage,
    gstAmount,
    customFees: calculatedCustomFees
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // COD flow — called from modal confirm
  const handleCODOrder = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setShowConfirmModal(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: cart,
          totalAmount: finalTotal,
          paymentMethod: "Cash on Delivery",
          deliveryType: checkoutDeliveryType,
          streetAddress: user.streetAddress,
          receiverName: user.receiverName,
          receiverMobile: user.receiverMobile,
          homeImage: user.homeImage,
          feeBreakdown
        })
      });
      if (!res.ok) throw new Error("Order creation failed");
      setCart([]);
      setReservationSuccessMsg("Order Placed! Our staff will confirm shortly.");
      setTimeout(() => setReservationSuccessMsg(""), 4000);
      handleTabChange("Orders");
    } catch (e) {
      console.error("Order failed", e);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Razorpay flow
  const handleRazorpayOrder = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: cart,
          totalAmount: finalTotal,
          paymentMethod: "Razorpay",
          deliveryType: checkoutDeliveryType,
          streetAddress: user.streetAddress,
          receiverName: user.receiverName,
          receiverMobile: user.receiverMobile,
          homeImage: user.homeImage,
          feeBreakdown
        })
      });
      if (!res.ok) throw new Error("Order creation failed");
      const orderData = await res.json();
      const orderId = orderData.order.id;

      const resScript = await loadRazorpayScript();
      if (!resScript) { alert("Razorpay SDK failed to load."); setIsSubmitting(false); return; }

      const razorpayOrderRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/payments/razorpay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type: 'food_order', id: orderId })
      });
      const razorpayOrder = await razorpayOrderRes.json();
      if (!razorpayOrder.id) { alert("Server error."); setIsSubmitting(false); return; }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_dummy_key",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Crave",
        description: "Food Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          const verifyRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/payments/razorpay/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              type: 'food_order', id: orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
          if (verifyRes.ok) {
            setCart([]);
            setReservationSuccessMsg("Payment Successful! Order Placed.");
            setTimeout(() => setReservationSuccessMsg(""), 4000);
            handleTabChange("Orders");
          } else {
            alert("Payment Verification Failed!");
          }
          setIsSubmitting(false);
        },
        prefill: { name: user.fullName || "Customer", email: user.email || "", contact: user.mobile || "" },
        theme: { color: "#B2E624" },
        modal: { ondismiss: () => setIsSubmitting(false) }
      };
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', () => setIsSubmitting(false));
      paymentObject.open();
    } catch (e) {
      console.error("Order failed", e);
      alert("Failed to process order.");
      setIsSubmitting(false);
    }
  };

  // Entry point — route to correct flow
  const handlePlaceOrder = () => {
    if (isSubmitting) return;
    if (checkoutPaymentMethod === "Cash on Delivery") {
      setShowConfirmModal(true);
    } else {
      handleRazorpayOrder();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col bg-transparent items-center justify-center pt-10">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500">Add some items from the menu to proceed.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-transparent relative">
      <Modal 
        isOpen={showConfirmModal} 
        title="Confirm Cash on Delivery" 
        desc="Are you sure you want to place this order using Cash on Delivery?" 
        onConfirm={handleCODOrder} 
        onCancel={() => setShowConfirmModal(false)} 
        confirmText={isSubmitting ? "Placing..." : "Yes, Confirm"} 
      />
      
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => handleTabChange("Menu")} className="flex items-center gap-2 p-2 px-4 hover:bg-gray-100 rounded-full transition-colors font-bold text-gray-700">
          <ArrowLeft className="w-5 h-5" /> Back to Menu
        </button>
        <h1 className="text-2xl font-bold ml-4">Secure Checkout</h1>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4 flex flex-col lg:flex-row gap-8">
        <div className="flex-[2] space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {cart.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-sm p-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img src={item.image.startsWith('http') ? item.image : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${item.image}`} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <span className="font-bold">{item.name}</span>
                      <div className="text-gray-500">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <span className="font-bold text-lg">₹{parseInt(item.priceText.replace(/[^\d]/g, '')) * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">Payment Options</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 border-2 border-[#B2E624] rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="radio" checked={checkoutPaymentMethod === "Cash on Delivery"} onChange={() => setCheckoutPaymentMethod("Cash on Delivery")} className="w-4 h-4 text-[#B2E624]" />
                  <span className="font-bold">Cash on Delivery</span>
                </div>
              </label>
              <label className="flex items-center justify-between p-4 border-2 border-gray-100 opacity-50 rounded-xl cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <input type="radio" disabled className="w-4 h-4" />
                  <span className="font-bold">Online Payment</span>
                </div>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded">Soon</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex-[1] flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold mb-4">Delivery Method</h2>
            <div className="space-y-3">
              <label className={`flex items-center justify-between p-4 border-2 ${checkoutDeliveryType === "Delivery" ? 'border-[#B2E624]' : 'border-gray-100'} rounded-xl cursor-pointer`}>
                <div className="flex items-center gap-3">
                  <input type="radio" checked={checkoutDeliveryType === "Delivery"} onChange={() => setCheckoutDeliveryType("Delivery")} className="w-4 h-4 text-[#B2E624]" />
                  <span className="font-bold">Delivery Partner</span>
                </div>
              </label>
              <label className={`flex items-center justify-between p-4 border-2 ${checkoutDeliveryType === "Pickup" ? 'border-[#B2E624]' : 'border-gray-100'} rounded-xl cursor-pointer`}>
                <div className="flex items-center gap-3">
                  <input type="radio" checked={checkoutDeliveryType === "Pickup"} onChange={() => setCheckoutDeliveryType("Pickup")} className="w-4 h-4 text-[#B2E624]" />
                  <span className="font-bold">I will pick up</span>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-gray-900 text-white rounded-2xl p-6 mt-auto">
            <div className="flex justify-between text-gray-400 mb-2"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            {settings?.gstEnabled && (
              <div className="flex justify-between text-gray-400 mb-2"><span>GST ({settings?.gstPercentage || 18}%)</span><span>₹{gstAmount.toLocaleString()}</span></div>
            )}
            {platformFee > 0 && (
              <div className="flex justify-between text-gray-400 mb-2"><span>Platform Fee</span><span>₹{platformFee.toLocaleString()}</span></div>
            )}
            {checkoutDeliveryType === "Delivery" && deliveryCharge > 0 && (
              <div className="flex justify-between text-gray-400 mb-2"><span>Delivery Charge</span><span>₹{deliveryCharge.toLocaleString()}</span></div>
            )}
            {calculatedCustomFees.map((fee: any, idx: number) => (
              <div key={idx} className={`flex justify-between mb-2 ${fee.amount < 0 ? 'text-green-400' : 'text-gray-400'}`}>
                <span>{fee.title}</span>
                <span>{fee.amount < 0 ? '-' : ''}₹{Math.abs(fee.amount).toLocaleString()}</span>
              </div>
            ))}
            
            <div className="flex justify-between text-2xl font-black mt-4 pt-4 border-t border-gray-800 mb-6"><span>Total</span><span className="text-[#B2E624]">₹{finalTotal.toLocaleString()}</span></div>
            
            {checkoutDeliveryType === "Delivery" && (!user.streetAddress || !user.receiverMobile || !user.receiverName || !user.deliveryLocation) ? (
              <div className="text-center">
                <p className="text-sm text-red-400 mb-4 font-bold">Please set up your order receiving details in Settings before ordering.</p>
                <button 
                  onClick={() => handleTabChange("Settings")}
                  className="w-full py-4 bg-white hover:bg-gray-200 text-black rounded-xl font-black transition-all flex items-center justify-center gap-2"
                >
                  Configure Settings
                </button>
              </div>
            ) : (
              <button 
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full mt-6 bg-[#B2E624] text-black font-bold py-4 rounded-xl shadow-lg hover:bg-[#a0d21d] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2"><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" className="opacity-75"/></svg>Placing...</span>
                ) : (
                  <><Check className="w-5 h-5" />Place Order</>
                )}
              </button>
            )}
          </div>
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCartPanel, setShowCartPanel] = useState(false);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.history.replaceState(null, '', `?tab=${tab}`);
  };

  const [user, setUser] = useState<any>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [attemptingToLeave, setAttemptingToLeave] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reservationSuccessMsg, setReservationSuccessMsg] = useState("");
  const [pendingReservation, setPendingReservation] = useState<any>(null);

  // Prevent accidental back button navigation
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setAttemptingToLeave(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    // Check for pending reservations
    const pending = localStorage.getItem("pendingReservation");
    if (pending) {
      try {
        setPendingReservation(JSON.parse(pending));
        localStorage.removeItem("pendingReservation");
      } catch (e) {
        localStorage.removeItem("pendingReservation");
      }
    }

    // Trap the browser back button
    const handlePopState = () => {
      setAttemptingToLeave(true);
      window.history.pushState(null, '', window.location.href);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const [settings, setSettings] = useState<any>(null);

  const fetchUserAndSettings = async () => {
    try {
      const resUser = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/me`, { credentials: "include" });
      if (!resUser.ok) throw new Error("Not authenticated");
      setUser(await resUser.json());
      setIsAuthenticated(true);
      // Settings are optional — don't redirect if they fail
      try {
        const resSettings = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/settings`);
        if (resSettings.ok) {
          const settingsData = await resSettings.json();
          setSettings({
            ...settingsData,
            customFees: typeof settingsData.customFees === 'string' ? JSON.parse(settingsData.customFees) : (settingsData.customFees || [])
          });
        }
      } catch {}
    } catch {
      window.location.replace("/auth");
    }
  };

  useEffect(() => {
    fetchUserAndSettings();
  }, []);

  const handlePendingReservationConfirm = async () => {
    if (!pendingReservation) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(pendingReservation),
      });
      if (!res.ok) throw new Error();
      setReservationSuccessMsg("Reservation request sent to admin for approval!");
      setTimeout(() => setReservationSuccessMsg(""), 4000);
    } catch (e) {
      console.error(e);
      alert("Failed to book table.");
    } finally {
      setPendingReservation(null);
    }
  };

  const handlePayReservation = async (reservationId: number) => {
    try {
      const loadRazorpayScript = () => new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
      const resScript = await loadRazorpayScript();
      if (!resScript) { alert("Razorpay SDK failed to load."); return; }

      const rzpRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/payments/razorpay/create-order`, {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ type: 'table_reservation', id: reservationId })
      });
      const rzpOrder = await rzpRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_dummy_key", 
        amount: rzpOrder.amount, currency: rzpOrder.currency, name: "Crave",
        description: "Table Booking Fee", order_id: rzpOrder.id,
        handler: async function (response: any) {
          const verifyRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/payments/razorpay/verify`, {
            method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
            body: JSON.stringify({
              type: 'table_reservation', id: reservationId, razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature
            })
          });
          if (verifyRes.ok) {
            setReservationSuccessMsg("Payment successful! Table booked.");
            setTimeout(() => setReservationSuccessMsg(""), 4000);
            window.location.reload(); // Reload to fetch updated reservations
          } else {
            alert("Payment verification failed.");
          }
        }, theme: { color: "#B2E624" }
      };
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (e) {
      console.error(e);
      alert("Failed to initiate payment.");
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("customerSession");
    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/customer/auth/logout`, { method: "POST", credentials: "include" });
    } catch {}
    window.location.replace("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F6EEED] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E04D2D]"></div>
      </div>
    );
  }

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

      <Modal 
        isOpen={attemptingToLeave} 
        title="Leave Dashboard?" 
        desc="Are you sure you want to log out and go back to the home page?" 
        onConfirm={handleLogout} 
        onCancel={() => setAttemptingToLeave(false)} 
        confirmText="Yes, Log Out" 
        isDestructive={true} 
      />
      <Modal
        isOpen={!!pendingReservation}
        title="Confirm Table Booking"
        desc={`Do you want to confirm your table reservation request for ${pendingReservation?.date} at ${pendingReservation?.time}?`}
        onConfirm={handlePendingReservationConfirm}
        onCancel={() => setPendingReservation(null)}
        confirmText="Confirm Request"
      />
      <Modal isOpen={isLoggingOut} title="Sign Out" desc="Are you sure you want to sign out from your account?" onConfirm={handleLogout} onCancel={() => setIsLoggingOut(false)} confirmText="Yes, Sign Out" isDestructive={true} />
      
      {/* Fixed Top Header */}
      <header className="bg-white px-6 md:px-8 py-4 flex items-center justify-between border-b border-gray-100 shrink-0 z-50 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B2E624] flex items-center justify-center shadow-lg shadow-[#B2E624]/20">
            <span className="text-black font-black text-xl leading-none">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight">Crave</span>
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

        <div className="flex items-center gap-3 md:gap-4">
          <button onClick={() => setIsLoggingOut(true)} className="hidden md:flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
          {user.profileImage ? (
            <img src={user.profileImage.startsWith('http') ? user.profileImage : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${user.profileImage}`} alt="Profile" className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-white shadow-sm" />
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm"><User className="w-4 h-4 md:w-5 md:h-5 text-gray-400" /></div>
          )}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <MenuIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100] lg:hidden backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white z-[101] shadow-2xl flex flex-col lg:hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#B2E624] flex items-center justify-center shadow-lg shadow-[#B2E624]/20">
                    <span className="text-black font-black text-xl leading-none">S</span>
                  </div>
                  <span className="text-xl font-bold tracking-tight">Crave</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {tabs.map(t => {
                  const Icon = t.icon;
                  return (
                    <button 
                      key={t.id} 
                      onClick={() => { handleTabChange(t.id); setMobileMenuOpen(false); }} 
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold ${currentTab === t.id ? 'bg-[#F8F9FB] text-black shadow-sm' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
                    >
                      <Icon className="w-5 h-5" /> {t.id}
                    </button>
                  )
                })}
              </div>
              <div className="p-6 border-t border-gray-100 shrink-0">
                <button onClick={() => setIsLoggingOut(true)} className="w-full flex items-center justify-center gap-2 font-bold text-red-500 bg-red-50 hover:bg-red-100 px-4 py-4 rounded-2xl transition-colors">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Scrollable Content Layout */}
      <main className="flex-1 overflow-y-auto w-full px-4 md:px-8 pb-4 md:pb-8 pt-0 relative">
        <div className={`max-w-[1600px] mx-auto h-full grid grid-cols-1 gap-6 lg:gap-8`}>
          
          {/* Left Area - Active Tab Content */}
          <div className="h-full overflow-hidden">
            {currentTab === "Menu" && <MenuTab cart={cart} setCart={setCart} setShowCartPanel={setShowCartPanel} />}
            {currentTab === "Events" && <EventsTab />}
            {currentTab === "Reservations" && <ReservationsTab onPay={handlePayReservation} />}
            {currentTab === "Settings" && <SettingsTab user={user} onUpdate={fetchUserAndSettings} />}
            {currentTab === "Orders" && <OrdersTab setCart={setCart} handleTabChange={handleTabChange} />}
            {currentTab === "Checkout" && <CheckoutTab user={user} cart={cart} setCart={setCart} handleTabChange={handleTabChange} setReservationSuccessMsg={setReservationSuccessMsg} settings={settings} />}
          </div>
        </div>

        {/* Floating Cart Panel Overlay */}
        <AnimatePresence>
          {currentTab === "Menu" && showCartPanel && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowCartPanel(false);
              }}
            >
              <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)] flex flex-col w-full max-w-md h-[80vh] overflow-hidden relative">
                <button onClick={() => setShowCartPanel(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                  <X className="w-4 h-4" />
                </button>
                <div className="flex justify-between items-center mb-6 shrink-0 pr-10">
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
                        <img src={item.image.startsWith('http') ? item.image : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${item.image}`} className="w-16 h-16 rounded-xl object-cover" />
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
                <button onClick={() => { setShowCartPanel(false); handleTabChange("Checkout"); }} disabled={cart.length === 0} className={`w-full py-4 font-bold rounded-full transition-colors ${cart.length === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}>
                  Proceed
                </button>
              </div>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
