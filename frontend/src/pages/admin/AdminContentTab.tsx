import { useState, useEffect } from "react";

const TAGS = [
  { id: "seo", label: "SEO / Meta" },
  { id: "hero", label: "Hero" },
  { id: "AboutL", label: "AboutL" },
  { id: "ChefL", label: "ChefL" },
  { id: "recipes", label: "Recipes" },
  { id: "online", label: "Online" },
  { id: "call", label: "Call" },
  { id: "eventL", label: "EventL" },
  { id: "promise", label: "Promise" },
  { id: "customers", label: "Customers" },
  { id: "footer", label: "Footer" }
];

export function AdminContentTab({ showToast }: { showToast: (msg: string) => void }) {
  const [activeTag, setActiveTag] = useState("seo");
  const [siteData, setSiteData] = useState<any>(null);
  const [chefData, setChefData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [testimonialData, setTestimonialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const resolveImageUrl = (url: string | undefined) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/") && !url.startsWith("/uploads")) return url;
    return `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${url}?v=2`;
  };

  const fetchContent = async () => {
    try {
      const [siteRes, chefRes, catRes, testRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/site`),
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/chef`),
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/category`),
        fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/testimonial`)
      ]);

      if (siteRes.ok) {
        const d = await siteRes.json();
        if (!d.seo) d.seo = {};
        setSiteData(d);
      }
      if (chefRes.ok) setChefData(await chefRes.json());
      if (catRes.ok) setCategoryData(await catRes.json());
      if (testRes.ok) setTestimonialData(await testRes.json());

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (section: string, field: string, value: string) => {
    setSiteData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const saveSection = async (section: string) => {
    if (!siteData || !siteData[section]) return;
    try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/site/${section}`, {
        method: "PUT",
        headers: { 
          
          "Content-Type": "application/json"
        },
        body: JSON.stringify(siteData[section])
      });
      if (res.ok) {
        showToast(`${section.toUpperCase()} updated successfully!`);
      } else {
        showToast(`Failed to update ${section}`);
      }
    } catch (err) {
      showToast(`Error updating ${section}`);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
        const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/upload`, {
        method: "POST",
        headers: { },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, field: string) => {
    if (e.target.files && e.target.files[0]) {
      const url = await uploadFile(e.target.files[0]);
      if (url) {
        handleTextChange(section, field, url);
        showToast("File uploaded! Click save to commit.");
      }
    }
  };

  // Helper for arrays
  const saveArrayItem = async (endpoint: string, id: number, data: any) => {
    try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/${endpoint}/${id}`, {
        method: "PUT",
        headers: {  "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        showToast("Item saved!");
      }
    } catch (err) {
      showToast("Error saving item.");
    }
  };

  const createArrayItem = async (endpoint: string, data: any, setter: any) => {
    try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/${endpoint}`, {
        method: "POST",
        headers: {  "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const newItem = await res.json();
        setter((prev: any[]) => [...prev, newItem]);
        showToast("Added successfully!");
      }
    } catch (err) {
      showToast("Error adding item.");
    }
  };

  const deleteArrayItem = async (endpoint: string, id: number, setter: any) => {
    try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/${endpoint}/${id}`, {
        method: "DELETE",
        headers: { }
      });
      if (res.ok) {
        setter((prev: any[]) => prev.filter(i => i.id !== id));
        showToast("Deleted successfully!");
      }
    } catch (err) {
      showToast("Error deleting item.");
    }
  };

  if (loading || !siteData) {
    return <div className="p-8 text-center text-gray-500">Loading Content Data...</div>;
  }

  return (
    <div className="w-full min-h-[60vh] bg-white rounded-3xl md:rounded-[2rem] shadow-sm flex flex-col overflow-hidden">
      
      {/* Top Layer Tags Navigation */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex flex-wrap gap-2 sticky top-0 z-10 shadow-sm">
        {TAGS.map(tag => (
          <button 
            key={tag.id}
            onClick={() => setActiveTag(tag.id)}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-colors whitespace-nowrap shrink-0 ${activeTag === tag.id ? 'bg-[#E04D2D] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-200 border border-gray-200'}`}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Content Form Area */}
      <div className="p-4 md:p-8 flex-1 overflow-y-auto">
        
        {/* SEO SECTION */}
        {activeTag === "seo" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2D211F] mb-6">SEO & Metadata Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Favicon</label>
                <div className="flex items-center gap-4">
                  <img src={resolveImageUrl(siteData.seo.favicon) || 'https://via.placeholder.com/64'} alt="Favicon" className="w-16 h-16 object-contain bg-gray-200 rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <input type="file" onChange={(e) => handleFileUpload(e, 'seo', 'favicon')} className="w-full text-xs md:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FFE5E0] file:text-[#E04D2D] hover:file:bg-[#FFD1C8]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Website Title</label>
                <input type="text" value={siteData.seo.title || ''} onChange={(e) => handleTextChange('seo', 'title', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" placeholder="Crave | Authentic Indian..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
                <textarea rows={3} value={siteData.seo.description || ''} onChange={(e) => handleTextChange('seo', 'description', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" placeholder="Welcome to Crave. Experience the finest..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Keywords (comma separated)</label>
                <input type="text" value={siteData.seo.keywords || ''} onChange={(e) => handleTextChange('seo', 'keywords', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" placeholder="Crave, restaurant, indian food..." />
              </div>
            </div>
            
            <button onClick={() => saveSection('seo')} className="bg-[#E04D2D] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors w-full">
              Save SEO Section
            </button>
          </div>
        )}

        {/* HERO SECTION */}
        {activeTag === "hero" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2D211F] mb-6">Hero Section Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Logo Image</label>
                <div className="flex items-center gap-4">
                  <img src={resolveImageUrl(siteData.hero.logoImage)} alt="Logo" className="w-16 h-16 object-contain bg-gray-200 rounded-lg shrink-0" />
                  <div className="flex-1 min-w-0">
                    <input type="file" onChange={(e) => handleFileUpload(e, 'hero', 'logoImage')} className="w-full text-xs md:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FFE5E0] file:text-[#E04D2D] hover:file:bg-[#FFD1C8]" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Video</label>
                <div className="flex flex-col gap-4">
                  <span className="text-xs text-gray-500 truncate block w-full">{siteData.hero.heroVideo}</span>
                  <div className="min-w-0">
                    <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'hero', 'heroVideo')} className="w-full text-xs md:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FFE5E0] file:text-[#E04D2D] hover:file:bg-[#FFD1C8]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Title</label>
                <input type="text" value={siteData.hero.heroTitle} onChange={(e) => handleTextChange('hero', 'heroTitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Subtitle</label>
                <input type="text" value={siteData.hero.heroSubtitle} onChange={(e) => handleTextChange('hero', 'heroSubtitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Description</label>
                <textarea rows={3} value={siteData.hero.heroDescription} onChange={(e) => handleTextChange('hero', 'heroDescription', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location Text</label>
                  <input type="text" value={siteData.hero.heroLocation} onChange={(e) => handleTextChange('hero', 'heroLocation', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location Link</label>
                  <input type="text" value={siteData.hero.heroLocationLink} onChange={(e) => handleTextChange('hero', 'heroLocationLink', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Address</label>
                <input type="text" value={siteData.hero.heroAddress} onChange={(e) => handleTextChange('hero', 'heroAddress', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Happy Diners Stat</label>
                  <input type="text" value={siteData.hero.heroStatsHappyDiners} onChange={(e) => handleTextChange('hero', 'heroStatsHappyDiners', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Menu Items Stat</label>
                  <input type="text" value={siteData.hero.heroStatsMenuItems} onChange={(e) => handleTextChange('hero', 'heroStatsMenuItems', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
              </div>
            </div>
            
            <button onClick={() => saveSection('hero')} className="bg-[#E04D2D] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors w-full">
              Save Hero Section
            </button>
          </div>
        )}

        {/* ABOUTL SECTION */}
        {activeTag === "AboutL" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2D211F] mb-6">About Section Configuration</h3>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Right Side Image</label>
              <div className="flex items-center gap-4">
                <img src={resolveImageUrl(siteData.about.aboutImage)} alt="About" className="w-32 h-20 object-cover bg-gray-200 rounded-lg shadow-sm shrink-0" />
                <div className="flex-1 min-w-0">
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'about', 'aboutImage')} className="w-full text-xs md:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FFE5E0] file:text-[#E04D2D] hover:file:bg-[#FFD1C8]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2">Left Card</h4>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Badge</label>
                  <input type="text" value={siteData.about.aboutBadge} onChange={(e) => handleTextChange('about', 'aboutBadge', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Large Title (use \n for breaks)</label>
                  <textarea rows={3} value={siteData.about.aboutTitle} onChange={(e) => handleTextChange('about', 'aboutTitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Button Text</label>
                  <input type="text" value={siteData.about.aboutButtonText} onChange={(e) => handleTextChange('about', 'aboutButtonText', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Button Link</label>
                  <input type="text" value={siteData.about.aboutButtonLink} onChange={(e) => handleTextChange('about', 'aboutButtonLink', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2">Bottom Card</h4>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Right Title</label>
                  <input type="text" value={siteData.about.aboutRightTitle} onChange={(e) => handleTextChange('about', 'aboutRightTitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Right Subtitle</label>
                  <input type="text" value={siteData.about.aboutRightSubtitle} onChange={(e) => handleTextChange('about', 'aboutRightSubtitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Paragraph 1</label>
                  <textarea rows={3} value={siteData.about.aboutRightDesc1} onChange={(e) => handleTextChange('about', 'aboutRightDesc1', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Paragraph 2</label>
                  <textarea rows={3} value={siteData.about.aboutRightDesc2} onChange={(e) => handleTextChange('about', 'aboutRightDesc2', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
              </div>
            </div>

            <button onClick={() => saveSection('about')} className="bg-[#E04D2D] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors w-full">
              Save About Section
            </button>
          </div>
        )}

        {/* ONLINE SECTION */}
        {activeTag === "online" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2D211F] mb-6">Online Reservation Section Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                  <input type="text" value={siteData.online.onlineTitle} onChange={(e) => handleTextChange('online', 'onlineTitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea rows={4} value={siteData.online.onlineDescription} onChange={(e) => handleTextChange('online', 'onlineDescription', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Media Type</label>
                  <select value={siteData.online.mediaType} onChange={(e) => handleTextChange('online', 'mediaType', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white">
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload {siteData.online.mediaType === 'video' ? 'Video' : 'Image'}</label>
                  <div className="flex flex-col gap-2 w-full min-w-0">
                    <span className="text-xs text-gray-500 truncate block w-full">{siteData.online.mediaUrl}</span>
                    <input type="file" accept={siteData.online.mediaType === 'video' ? 'video/*' : 'image/*'} onChange={(e) => handleFileUpload(e, 'online', 'mediaUrl')} className="w-full text-xs md:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FFE5E0] file:text-[#E04D2D] hover:file:bg-[#FFD1C8]" />
                  </div>
                </div>
              </div>
            </div>

            <button onClick={() => saveSection('online')} className="bg-[#E04D2D] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors w-full">
              Save Online Section
            </button>
          </div>
        )}

        {/* CALL SECTION */}
        {activeTag === "call" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2D211F] mb-6">Call To Order Configuration</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input type="text" value={siteData.call.callPhone} onChange={(e) => handleTextChange('call', 'callPhone', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input type="text" value={siteData.call.callTitle} onChange={(e) => handleTextChange('call', 'callTitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea rows={3} value={siteData.call.callDescription} onChange={(e) => handleTextChange('call', 'callDescription', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <button onClick={() => saveSection('call')} className="bg-[#E04D2D] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors w-full">
              Save Call Section
            </button>
          </div>
        )}

        {/* EVENTL SECTION */}
        {activeTag === "eventL" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2D211F] mb-6">Events Configuration</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
              <input type="text" value={siteData.event.eventSubtitle} onChange={(e) => handleTextChange('event', 'eventSubtitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input type="text" value={siteData.event.eventTitle} onChange={(e) => handleTextChange('event', 'eventTitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea rows={3} value={siteData.event.eventDescription} onChange={(e) => handleTextChange('event', 'eventDescription', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <button onClick={() => saveSection('event')} className="bg-[#E04D2D] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors w-full">
              Save Events Section
            </button>
          </div>
        )}

        {/* PROMISE SECTION */}
        {activeTag === "promise" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2D211F] mb-6">Our Promise Configuration</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input type="text" value={siteData.promise.promiseTitle} onChange={(e) => handleTextChange('promise', 'promiseTitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
              <input type="text" value={siteData.promise.promiseSubtitle} onChange={(e) => handleTextChange('promise', 'promiseSubtitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Description</label>
              <textarea rows={10} value={siteData.promise.promiseDescription} onChange={(e) => handleTextChange('promise', 'promiseDescription', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
            </div>
            <button onClick={() => saveSection('promise')} className="bg-[#E04D2D] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors w-full">
              Save Promise Section
            </button>
          </div>
        )}

        {/* FOOTER SECTION */}
        {activeTag === "footer" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2D211F] mb-6">Footer Configuration</h3>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h4 className="font-bold text-gray-800 border-b pb-2">Background & Aesthetics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Background Type</label>
                  <select value={siteData.footer.footerBackgroundType} onChange={(e) => handleTextChange('footer', 'footerBackgroundType', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white">
                    <option value="video">Video</option>
                    <option value="image">Custom Image / Plain Color Image</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload {siteData.footer.footerBackgroundType === 'video' ? 'Video' : 'Image'}</label>
                  <div className="min-w-0">
                    <input type="file" accept={siteData.footer.footerBackgroundType === 'video' ? 'video/*' : 'image/*'} onChange={(e) => handleFileUpload(e, 'footer', 'footerBackgroundMedia')} className="w-full text-xs md:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FFE5E0] file:text-[#E04D2D] hover:file:bg-[#FFD1C8]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Text Color Overlay</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={siteData.footer.footerTextColor} onChange={(e) => handleTextChange('footer', 'footerTextColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
                    <span className="text-sm text-gray-500 uppercase">{siteData.footer.footerTextColor}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2">Business Details</h4>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea rows={2} value={siteData.footer.footerDescription} onChange={(e) => handleTextChange('footer', 'footerDescription', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input type="text" value={siteData.footer.footerPhone} onChange={(e) => handleTextChange('footer', 'footerPhone', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <input type="text" value={siteData.footer.footerAddress} onChange={(e) => handleTextChange('footer', 'footerAddress', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address Map Link</label>
                  <input type="text" value={siteData.footer.footerAddressLink} onChange={(e) => handleTextChange('footer', 'footerAddressLink', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input type="text" value={siteData.footer.footerEmail} onChange={(e) => handleTextChange('footer', 'footerEmail', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2">Social Links</h4>
                {(siteData.footer.footerSocials || []).map((social: any, idx: number) => (
                  <div key={idx} className="flex flex-col gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold capitalize text-gray-700">{social.platform}</span>
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" checked={social.isEnabled} onChange={(e) => {
                          const newSocials = [...siteData.footer.footerSocials];
                          newSocials[idx].isEnabled = e.target.checked;
                          handleTextChange('footer', 'footerSocials', newSocials as any);
                        }} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500 relative"></div>
                      </label>
                    </div>
                    <input type="text" value={social.url} onChange={(e) => {
                      const newSocials = [...siteData.footer.footerSocials];
                      newSocials[idx].url = e.target.value;
                      handleTextChange('footer', 'footerSocials', newSocials as any);
                    }} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => saveSection('footer')} className="bg-[#E04D2D] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors w-full">
              Save Footer Section
            </button>
          </div>
        )}

        {/* CHEFL SECTION */}
        {activeTag === "ChefL" && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2D211F] mb-6">Chef's Special Section</h3>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 mb-8">
              <h4 className="font-bold text-gray-800 text-lg">Section Headers</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subheading (e.g., CHEF'S SPECIAL)</label>
                  <input type="text" value={siteData?.popular?.subtitle || ""} onChange={(e) => handleTextChange('popular', 'subtitle', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Main Heading (e.g., POPULAR DISHES)</label>
                  <input type="text" value={siteData?.popular?.title || ""} onChange={(e) => handleTextChange('popular', 'title', e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white" />
                </div>
              </div>
              <button onClick={() => saveSection('popular')} className="bg-[#E04D2D] text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-[#C84022] mt-4">
                Save Headers
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold text-[#2D211F]">Dish Cards (4 Max)</h4>
              <button 
                onClick={() => {
                  if (chefData.length >= 4) return showToast("Maximum 4 cards allowed");
                  createArrayItem('chef', { title: "New Dish", hoverText: "Delicious dish", image: "" }, setChefData)
                }} 
                className="bg-[#E04D2D] text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-[#C84022]"
              >
                + Add Dish Card
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {chefData.map((chef, idx) => (
                <div key={chef.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 relative group">
                  <h4 className="font-bold text-gray-800 absolute top-4 right-6 opacity-30 text-2xl">0{idx + 1}</h4>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dish Image</label>
                    <div className="flex items-center gap-4">
                      <img src={resolveImageUrl(chef.image)} alt={chef.title} className="w-24 h-16 object-cover rounded-lg shadow-sm border border-gray-200" />
                      <input type="file" accept="image/*" onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const url = await uploadFile(e.target.files[0]);
                          if (url) {
                            const newData = [...chefData];
                            newData[idx].image = url;
                            setChefData(newData);
                          }
                        }
                      }} className="text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dish Name</label>
                    <input type="text" value={chef.title} onChange={(e) => {
                      const newData = [...chefData];
                      newData[idx].title = e.target.value;
                      setChefData(newData);
                    }} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hover Description</label>
                    <textarea rows={2} value={chef.hoverText} onChange={(e) => {
                      const newData = [...chefData];
                      newData[idx].hoverText = e.target.value;
                      setChefData(newData);
                    }} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white" />
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => saveArrayItem('chef', chef.id, chef)} className="bg-[#2D211F] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-black w-full">
                      Update Card
                    </button>
                    <button onClick={() => deleteArrayItem('chef', chef.id, setChefData)} className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-200 border border-red-200">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECIPES SECTION (Categories) */}
        {activeTag === "recipes" && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#2D211F]">Menu Categories (Buttons)</h3>
              <button 
                onClick={() => {
                  if (categoryData.length >= 10) return showToast("Maximum 10 buttons allowed");
                  createArrayItem('category', { name: "New Category", isEnabled: true, image1: "", image2: "", image3: "" }, setCategoryData)
                }} 
                className="bg-[#E04D2D] text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-[#C84022]"
              >
                + Add Button
              </button>
            </div>
            
            <div className="space-y-4">
              {categoryData.map((cat, idx) => (
                <div key={cat.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col md:flex-row gap-6 shadow-sm">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-gray-700">Button Name</label>
                      <label className="flex items-center cursor-pointer gap-2">
                        <span className="text-xs font-bold text-gray-500">Enabled</span>
                        <input type="checkbox" checked={cat.isEnabled} onChange={(e) => {
                          const newData = [...categoryData];
                          newData[idx].isEnabled = e.target.checked;
                          setCategoryData(newData);
                        }} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500 relative"></div>
                      </label>
                    </div>
                    <input type="text" value={cat.name} onChange={(e) => {
                      const newData = [...categoryData];
                      newData[idx].name = e.target.value;
                      setCategoryData(newData);
                    }} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white font-bold" />
                    
                    <div className="flex gap-2">
                      <button onClick={() => saveArrayItem('category', cat.id, cat)} className="flex-1 bg-[#2D211F] text-white py-2 rounded-xl text-sm font-bold hover:bg-black">Save</button>
                      <button onClick={() => deleteArrayItem('category', cat.id, setCategoryData)} className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-200 border border-red-200">Delete</button>
                    </div>
                  </div>

                  <div className="flex-1 border-l border-gray-200 pl-6 space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Category Images (3 Required)</label>
                    
                    {[1, 2, 3].map(num => (
                      <div key={num} className="flex items-center gap-3">
                        <img src={resolveImageUrl(cat[`image${num}`]) || 'https://via.placeholder.com/150'} alt="Cat" className="w-16 h-10 object-cover rounded bg-gray-200" />
                        <input type="file" accept="image/*" onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            const url = await uploadFile(e.target.files[0]);
                            if (url) {
                              const newData = [...categoryData];
                              newData[idx][`image${num}`] = url;
                              setCategoryData(newData);
                            }
                          }
                        }} className="text-xs w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOMERS SECTION (Testimonials) */}
        {activeTag === "customers" && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#2D211F]">Testimonials</h3>
              <button 
                onClick={() => createArrayItem('testimonial', { name: "New User", text: "Amazing food!", image: "https://i.pravatar.cc/150" }, setTestimonialData)} 
                className="bg-[#E04D2D] text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-[#C84022]"
              >
                + Add
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonialData.map((test, idx) => (
                <div key={test.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <img src={resolveImageUrl(test.image)} alt={test.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                    <input type="file" accept="image/*" onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const url = await uploadFile(e.target.files[0]);
                        if (url) {
                          const newData = [...testimonialData];
                          newData[idx].image = url;
                          setTestimonialData(newData);
                        }
                      }
                    }} className="text-xs w-full" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
                    <input type="text" value={test.name} onChange={(e) => {
                      const newData = [...testimonialData];
                      newData[idx].name = e.target.value;
                      setTestimonialData(newData);
                    }} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Review</label>
                    <textarea rows={3} value={test.text} onChange={(e) => {
                      const newData = [...testimonialData];
                      newData[idx].text = e.target.value;
                      setTestimonialData(newData);
                    }} className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => saveArrayItem('testimonial', test.id, test)} className="flex-1 bg-[#2D211F] text-white py-2 rounded-xl text-xs font-bold hover:bg-black">Save</button>
                    <button onClick={() => deleteArrayItem('testimonial', test.id, setTestimonialData)} className="bg-red-100 text-red-600 px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-200">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CATCH ALL */}
        {activeTag !== "seo" && activeTag !== "hero" && activeTag !== "AboutL" && activeTag !== "online" && activeTag !== "call" && activeTag !== "eventL" && activeTag !== "promise" && activeTag !== "footer" && activeTag !== "ChefL" && activeTag !== "recipes" && activeTag !== "customers" && (
          <div className="p-8 text-center text-gray-500">
            UI for {activeTag} is under construction...
          </div>
        )}
      </div>

    </div>
  );
}
