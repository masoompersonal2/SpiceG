import { useState } from "react";
import { Search, Filter, Bell, Heart, Check, Trash2, Minus, Plus } from "lucide-react";

export function CustomerDashboard() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSize, setActiveSize] = useState("500g");
  const [extras, setExtras] = useState({ tomato: true, parsley: true, cheese: true });

  const categories = ["All", "Pizza", "Burger", "Pasta", "Biryani", "Salad", "Drinks", "Dessert", "Rice"];

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-[#1A1A1A]">
      {/* Top Header */}
      <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#B2E624] flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none">D</span>
          </div>
          <span className="text-xl font-bold tracking-tight">DishDash</span>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-gray-500">
          <a href="#" className="flex items-center gap-2 hover:text-black transition-colors"><div className="w-4 h-4 grid grid-cols-2 gap-[2px]"><div className="bg-current rounded-[2px]" /><div className="bg-current rounded-[2px]" /><div className="bg-current rounded-[2px]" /><div className="bg-current rounded-[2px]" /></div> Dashboard</a>
          <a href="#" className="flex items-center gap-2 hover:text-black transition-colors"><div className="w-4 h-4 border-2 border-current rounded-[4px]" /> Products</a>
          <a href="#" className="flex items-center gap-2 text-black bg-gray-50 px-4 py-2 rounded-full"><div className="w-4 h-4 border-2 border-current rounded-[4px]" /> My Orders</a>
          <a href="#" className="flex items-center gap-2 hover:text-black transition-colors"><Heart className="w-4 h-4" /> Wishlist</a>
          <a href="#" className="flex items-center gap-2 hover:text-black transition-colors"><div className="w-4 h-4 border-2 border-current rounded-[4px]" /> Cart</a>
          <a href="#" className="flex items-center gap-2 hover:text-black transition-colors"><div className="w-4 h-4 border-2 border-current rounded-[4px]" /> Settings</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-[1600px] mx-auto p-8 grid lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Left Area - Cart Details */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] flex flex-col h-full">
          
          {/* Header & Search */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Cart Details</h1>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[#B2E624]"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                Filter <Filter className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat ? 'bg-[#B2E624] text-black shadow-sm' : 'bg-transparent text-gray-500 hover:bg-gray-50 border border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Product */}
          <div className="flex-1 flex flex-col xl:flex-row items-center gap-12 mb-12 relative">
            <div className="w-full max-w-[400px] aspect-square relative z-10 shrink-0">
              {/* Note: I'm using placeholder image logic here, real image would be a pasta plate */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-50 to-yellow-50 rounded-full opacity-50 blur-2xl" />
              <img src="/assets/food/pasta.png" alt="Creamy Pasta" className="w-full h-full object-contain drop-shadow-2xl" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80" }} />
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold">Time</span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold text-gray-600">20 min</span>
              </div>
              
              <h2 className="text-4xl font-extrabold tracking-tight mb-3">Creamy Pasta</h2>
              <p className="text-gray-500 mb-8 max-w-md">Creamy pasta with fresh herbs, and parmesan cheese.</p>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Size</h3>
                <div className="flex gap-3">
                  {['500g', '750g', '1000g'].map(size => (
                    <button
                      key={size}
                      onClick={() => setActiveSize(size)}
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                        activeSize === size ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h3 className="font-semibold mb-3">Extras</h3>
                <div className="flex gap-4">
                  {[
                    { id: 'tomato', name: 'Tomato', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=100&q=80' },
                    { id: 'parsley', name: 'Parsley', img: 'https://images.unsplash.com/photo-1616035824838-8fa1b98816c8?auto=format&fit=crop&w=100&q=80' },
                    { id: 'cheese', name: 'Cheese', img: 'https://images.unsplash.com/photo-1631379578550-7038263db699?auto=format&fit=crop&w=100&q=80' }
                  ].map(extra => (
                    <div key={extra.id} className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl p-2 relative flex items-center justify-center cursor-pointer" onClick={() => setExtras(prev => ({...prev, [extra.id]: !prev[extra.id as keyof typeof prev]}))}>
                        <img src={extra.img} alt={extra.name} className="w-full h-full object-cover rounded-xl" />
                        {extras[extra.id as keyof typeof extras] && (
                          <div className="absolute -bottom-2 w-5 h-5 bg-[#B2E624] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                            <Check className="w-3 h-3 text-black" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-500">{extra.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                  <div className="text-3xl font-extrabold">$30.00</div>
                </div>
                <button className="bg-[#B2E624] text-black px-12 py-4 rounded-full font-bold text-lg hover:bg-[#a0d21d] transition-colors shadow-lg shadow-[#B2E624]/30">
                  Add to cart
                </button>
              </div>
            </div>
          </div>

          {/* Recommended */}
          <div>
            <h3 className="font-bold mb-4">Recommended</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {/* Card 1 */}
              <div className="bg-white border border-gray-100 rounded-3xl p-3 flex items-center gap-4 min-w-[300px] shadow-sm hover:shadow-md transition-shadow">
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=80" alt="Pizza" className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm">BBQ Pizza</h4>
                    <div className="bg-orange-50 w-6 h-6 rounded-full flex items-center justify-center"><Heart className="w-3 h-3 text-orange-500 fill-orange-500" /></div>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">7-8 inci</div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">$80</span>
                    <button className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-gray-100 rounded-3xl p-3 flex items-center gap-4 min-w-[300px] shadow-sm hover:shadow-md transition-shadow">
                <img src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=200&q=80" alt="Noodles" className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm">Noodles</h4>
                    <div className="bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center"><Heart className="w-3 h-3 text-gray-400 fill-gray-400" /></div>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">100-150g</div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">$25</span>
                    <button className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar - My Order */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)] flex flex-col h-full">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">My Order</h2>
            <button className="text-xs font-semibold text-orange-500 px-3 py-1 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors">Delete All</button>
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide">
            
            {/* Cart Item 1 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-4 shadow-sm relative group">
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=80" alt="Pizza" className="w-16 h-16 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm">BBQ Pizza</h4>
                  <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="text-xs text-gray-500 mb-3">7-8 inci</div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 font-medium">Total <span className="text-black font-bold text-sm ml-1">$120</span></div>
                  <div className="flex items-center gap-3">
                    <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><Minus className="w-3 h-3" /></button>
                    <span className="text-sm font-semibold">2</span>
                    <button className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Item 2 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-4 shadow-sm relative group">
              <img src="https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=200&q=80" alt="Biryani" className="w-16 h-16 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm">Biryani</h4>
                  <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="text-xs text-gray-500 mb-3">380-500g</div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 font-medium">Total <span className="text-black font-bold text-sm ml-1">$100</span></div>
                  <div className="flex items-center gap-3">
                    <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><Minus className="w-3 h-3" /></button>
                    <span className="text-sm font-semibold">2</span>
                    <button className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Item 3 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-4 shadow-sm relative group">
              <img src="https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=200&q=80" alt="Pasta" className="w-16 h-16 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-sm">Pasta</h4>
                  <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="text-xs text-gray-500 mb-3">80-100g</div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 font-medium">Total <span className="text-black font-bold text-sm ml-1">$30</span></div>
                  <div className="flex items-center gap-3">
                    <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"><Minus className="w-3 h-3" /></button>
                    <span className="text-sm font-semibold">2</span>
                    <button className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Checkout Section */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center"><Check className="w-3 h-3" /></div> Discount
              </div>
              <button className="px-3 py-1.5 bg-[#B2E624] text-black text-xs font-semibold rounded-full">Change Promo</button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-500">Total Product Price</span>
                <span>$250</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-500">Discount</span>
                <span className="text-red-500">-$25</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-100">
                <span>Total Payment</span>
                <span>$225</span>
              </div>
            </div>

            <button className="w-full py-4 bg-[#B2E624] text-black font-bold rounded-full hover:bg-[#a0d21d] transition-colors shadow-lg shadow-[#B2E624]/30">
              Proceed to Order
            </button>
          </div>

        </div>

      </main>
    </div>
  );
}
