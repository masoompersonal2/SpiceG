import { useState, useEffect } from "react";

import { AdminEventsManager } from "./AdminEventsManager";

const TAGS = [
  { id: "aboutH", label: "About" },
  { id: "events", label: "Events" },
  { id: "contact", label: "Contact" },
  { id: "galleryH", label: "Gallery" },
];

interface Props {
  showToast: (msg: string) => void;
  onViewGallery?: () => void;
}

export function AdminHeaderPagesTab({ showToast, onViewGallery }: Props) {
  const [activeTag, setActiveTag] = useState("events");
  const [siteData, setSiteData] = useState<any>(null);
  const [isViewingEvents, setIsViewingEvents] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', subtitle: '', location: '', date: '', price: 0, totalSeats: 0, image: '' });
  const [newGalleryImage, setNewGalleryImage] = useState({ row: 1, title: '', image: '' });

  useEffect(() => {
    fetchSiteData();
  }, []);

  const fetchSiteData = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/site`);
    if (res.ok) {
      const data = await res.json();
      if (!data.aboutH) data.aboutH = {};
      if (!data.contact) data.contact = { instagram: [] };
      if (!data.eventsH) data.eventsH = { title: 'Exclusive Resort Experiences', subtitle: 'Discover curated moments of luxury...', bgImage: '' };
      if (!data.galleryH) data.galleryH = { title: 'Photo Gallery', subtitle: 'VISUAL JOURNEY', description: 'A glimpse into our vibrant ambiance, celebrations, and festive moments.' };
      setSiteData(data);
    }
  };

  const saveSection = async (section: string) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/site/${section}`, {
      method: "PUT",
      headers: {
        
        "Content-Type": "application/json"
      },
      body: JSON.stringify(siteData[section])
    });

    if (res.ok) {
      showToast(`${section} updated successfully!`);
      fetchSiteData();
    } else {
      showToast("Error updating section.");
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: string, field: string) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

        showToast("Uploading...");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/upload`, {
        method: "POST",
        headers: { },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        handleTextChange(section, field, data.url);
        showToast("Upload complete!");
      } else {
        showToast("Upload failed.");
      }
    } catch (err) {
      showToast("Upload error.");
    }
  };

  const handleInstaUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

        showToast("Uploading...");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/upload`, {
        method: "POST",
        headers: { },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        const newInsta = [...(siteData.contact.instagram || [])];
        newInsta[index] = data.url;
        handleTextChange('contact', 'instagram', newInsta as any);
        showToast("Image Uploaded!");
      } else {
        showToast("Upload failed.");
      }
    } catch (err) {
      showToast("Upload error.");
    }
  };

  const handleTicketUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
        showToast("Uploading...");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/upload`, {
        method: "POST",
        headers: { },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setNewTicket(prev => ({ ...prev, image: data.url }));
        showToast("Image Uploaded!");
      }
    } catch { showToast("Upload error."); }
  };

  const handleAddTicket = async () => {
    if (!newTicket.title || !newTicket.date || newTicket.price === undefined || newTicket.price === null || !newTicket.location || !newTicket.image || !newTicket.totalSeats) {
      showToast("Please fill all ticket fields, including the image upload and location.");
      return;
    }
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/events`, {
      method: "POST",
      credentials: "include",
      headers: {  
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTicket)
    });
    if (res.ok) {
      showToast("Ticket Added successfully!");
      setNewTicket({ title: '', subtitle: '', location: '', date: '', price: 0, totalSeats: 0, image: '' });
    } else {
      showToast("Failed to add ticket.");
    }
  };

  const resolveImageUrl = (url: string | undefined) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${url}?v=2`;
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
        showToast("Uploading image...");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/upload`, {
        method: "POST",
        headers: { },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setNewGalleryImage(prev => ({ ...prev, image: data.url }));
        showToast("Image Uploaded!");
      }
    } catch { showToast("Upload error."); }
  };

  const handleAddGalleryImage = async () => {
    if (!newGalleryImage.image) {
      showToast("Please select an image.");
      return;
    }
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/gallery-image`, {
      method: "POST",
      headers: {  "Content-Type": "application/json" },
      body: JSON.stringify(newGalleryImage)
    });
    if (res.ok) {
      showToast("Gallery image added!");
      setNewGalleryImage(prev => ({ row: prev.row, title: '', image: '' }));
    } else {
      showToast("Failed to add image.");
    }
  };

  if (!siteData) return <div className="p-10">Loading...</div>;

  if (isViewingEvents) {
    return <AdminEventsManager onBack={() => setIsViewingEvents(false)} showToast={showToast} />;
  }

  return (
    <div className="w-full flex-1 h-full min-h-0 bg-white rounded-3xl md:rounded-[2rem] shadow-sm flex flex-col md:flex-row overflow-hidden border border-gray-100">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-4 md:p-6 shrink-0">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Header Pages</h3>
        <div className="flex flex-wrap md:flex-col gap-2 pb-2 md:pb-0">
          {TAGS.map(tag => (
            <button 
              key={tag.id}
              onClick={() => setActiveTag(tag.id)}
              className={`whitespace-nowrap px-4 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base text-left transition-colors shrink-0 ${activeTag === tag.id ? 'bg-[#2D211F] text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Form Area */}
      <div className="p-4 md:p-8 flex-1 overflow-y-auto w-full">
        
        {/* About Header Section */}
        {activeTag === "aboutH" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2D211F] mb-6">About Page Content</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Our Story Paragraph 1</label>
                <textarea rows={3} value={siteData.aboutH.p1 || ''} onChange={(e) => handleTextChange('aboutH', 'p1', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Our Story Paragraph 2</label>
                <textarea rows={3} value={siteData.aboutH.p2 || ''} onChange={(e) => handleTextChange('aboutH', 'p2', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Our Story Paragraph 3</label>
                <textarea rows={3} value={siteData.aboutH.p3 || ''} onChange={(e) => handleTextChange('aboutH', 'p3', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
              </div>
            </div>

            <div className="space-y-6 border-t pt-6">
              <h4 className="text-lg font-bold text-gray-800">Mission & Values</h4>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Our Mission</label>
                <textarea rows={3} value={siteData.aboutH.mission || ''} onChange={(e) => handleTextChange('aboutH', 'mission', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Community & Sustainability</label>
                <textarea rows={3} value={siteData.aboutH.sustainability || ''} onChange={(e) => handleTextChange('aboutH', 'sustainability', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Our Values</label>
                <textarea rows={3} value={siteData.aboutH.values || ''} onChange={(e) => handleTextChange('aboutH', 'values', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
              </div>
            </div>

            <div className="space-y-6 border-t pt-6">
              <h4 className="text-lg font-bold text-gray-800">The Experience</h4>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Paragraph 1</label>
                <textarea rows={3} value={siteData.aboutH.exp1 || ''} onChange={(e) => handleTextChange('aboutH', 'exp1', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Paragraph 2</label>
                <textarea rows={3} value={siteData.aboutH.exp2 || ''} onChange={(e) => handleTextChange('aboutH', 'exp2', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
              </div>
            </div>
            
            <button onClick={() => saveSection('aboutH')} className="bg-[#E04D2D] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors w-full mt-6">
              Save About Content
            </button>
          </div>
        )}

        {/* Events Header Section */}
        {activeTag === "events" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#2D211F]">Events Page Configuration</h3>
              <button onClick={() => setIsViewingEvents(true)} className="bg-black text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">
                View All Events
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h4 className="text-lg font-bold text-gray-800">Events Hero Section</h4>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Title</label>
                <input type="text" value={siteData.eventsH.title || ''} onChange={(e) => handleTextChange('eventsH', 'title', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Subtitle</label>
                <textarea rows={2} value={siteData.eventsH.subtitle || ''} onChange={(e) => handleTextChange('eventsH', 'subtitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Background Image</label>
                <div className="flex gap-4 items-center">
                  {siteData.eventsH.bgImage && <img src={resolveImageUrl(siteData.eventsH.bgImage)} className="h-16 w-32 object-cover rounded bg-gray-100" />}
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'eventsH', 'bgImage')} />
                </div>
              </div>
              <button onClick={() => saveSection('eventsH')} className="bg-[#E04D2D] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors w-full mt-4">
                Save Hero Content
              </button>
            </div>

            {/* Add New Ticket Form */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mt-12">
              <h4 className="text-xl font-bold text-gray-800 mb-6">Add New Ticket</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket Title</label>
                  <input type="text" value={newTicket.title} onChange={e => setNewTicket({...newTicket, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white" placeholder="Gala Dinner" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle / Description</label>
                  <input type="text" value={newTicket.subtitle} onChange={e => setNewTicket({...newTicket, subtitle: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white" placeholder="Fun with Samay Raina" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input type="text" value={newTicket.location} onChange={e => setNewTicket({...newTicket, location: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white" placeholder="SPICE GARDEN" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <input type="date" value={newTicket.date} onChange={e => setNewTicket({...newTicket, date: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                  <input type="number" value={newTicket.price} onChange={e => setNewTicket({...newTicket, price: Number(e.target.value)})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white" placeholder="799" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Total Seats Available</label>
                  <input type="number" value={newTicket.totalSeats} onChange={e => setNewTicket({...newTicket, totalSeats: Number(e.target.value)})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white" placeholder="499" />
                </div>
                <div className="col-span-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ticket Image</label>
                  <div className="flex gap-4 items-center">
                    {newTicket.image && <img src={resolveImageUrl(newTicket.image)} className="h-16 w-16 object-cover rounded bg-gray-100" />}
                    <input type="file" accept="image/*" onChange={handleTicketUpload} />
                  </div>
                </div>
              </div>

              <button onClick={handleAddTicket} className="bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-colors w-full mt-8">
                Add Ticket
              </button>
            </div>
          </div>
        )}

        {/* Contact Header Section */}
        {activeTag === "contact" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-[#2D211F] mb-6">Contact Page Configuration</h3>
            
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-200 mb-6">
              <p><strong>Note:</strong> The contact details (Phone, Email, Socials) shown on the Contact page are synced from the <strong>Footer</strong> section in Content Management.</p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4">Instagram Grid Images (5 Required)</h4>
              <p className="text-sm text-gray-500 mb-6">Upload 5 images/videos to be displayed in the Instagram grid layout. The 3rd image is the large central image.</p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[0, 1, 2, 3, 4].map((idx) => {
                  const imgUrl = siteData.contact.instagram && siteData.contact.instagram[idx] ? resolveImageUrl(siteData.contact.instagram[idx]) : '';
                  const isVid = imgUrl.match(/\.(mp4|webm|ogg)/i) || imgUrl.includes('/video/upload/');
                  return (
                    <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col items-center">
                      <span className="text-xs font-bold text-gray-400 mb-2">Image {idx + 1} {idx === 2 && "(Center)"}</span>
                      <div className="w-full aspect-square bg-gray-200 rounded-lg overflow-hidden relative mb-4">
                        {imgUrl ? (
                          isVid ? (
                            <video src={imgUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                          ) : (
                            <img src={imgUrl} className="w-full h-full object-cover" />
                          )
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs text-center p-2">No Media</div>
                        )}
                      </div>
                      <input type="file" accept="image/*,video/*" onChange={(e) => handleInstaUpload(e, idx)} className="text-xs w-full" />
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={() => saveSection('contact')} className="bg-[#E04D2D] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors w-full mt-6">
              Save Contact Section
            </button>
          </div>
        )}

        {/* Gallery Header Section */}
        {activeTag === "galleryH" && (
          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="text-2xl font-bold text-[#2D211F]">Gallery Page Configuration</h3>
              <button onClick={() => onViewGallery ? onViewGallery() : window.location.href = '/admin/gallery-images'} className="bg-black text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform w-full md:w-auto text-center">
                View Images
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h4 className="text-lg font-bold text-gray-800">Gallery Header Text</h4>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input type="text" value={siteData.galleryH.title || ''} onChange={(e) => handleTextChange('galleryH', 'title', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" placeholder="Photo Gallery" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
                <input type="text" value={siteData.galleryH.subtitle || ''} onChange={(e) => handleTextChange('galleryH', 'subtitle', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" placeholder="VISUAL JOURNEY" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea rows={2} value={siteData.galleryH.description || ''} onChange={(e) => handleTextChange('galleryH', 'description', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50" />
              </div>
              
              <button onClick={() => saveSection('galleryH')} className="bg-[#E04D2D] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-colors w-full mt-4">
                Save Header Text
              </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mt-12">
              <h4 className="text-xl font-bold text-gray-800 mb-6">Add New Gallery Image</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Image Title (optional)</label>
                  <input type="text" value={newGalleryImage.title} onChange={e => setNewGalleryImage({...newGalleryImage, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white" placeholder="e.g. Our Ambience" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Assign to Row</label>
                  <select value={newGalleryImage.row} onChange={e => setNewGalleryImage({...newGalleryImage, row: Number(e.target.value)})} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white cursor-pointer">
                    <option value={1}>Row 1 (Scrolls Left)</option>
                    <option value={2}>Row 2 (Scrolls Right)</option>
                    <option value={3}>Row 3 (Scrolls Left)</option>
                  </select>
                </div>
                <div className="col-span-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
                  <div className="flex gap-4 items-center">
                    {newGalleryImage.image && <img src={resolveImageUrl(newGalleryImage.image)} className="h-16 w-32 object-cover rounded border border-gray-300" />}
                    <input type="file" accept="image/*" onChange={handleGalleryUpload} className="text-sm" />
                  </div>
                </div>
              </div>

              <button onClick={handleAddGalleryImage} className="bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-colors w-full mt-8">
                Add Image
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
