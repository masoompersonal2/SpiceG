import { ArrowLeft, Sprout, Globe, Gem, Leaf, BookOpen, Users, Camera } from "lucide-react";
import { useContent } from "../context/ContentContext";

export function AboutPage() {
  const { siteData } = useContent();
  const aboutH = siteData?.aboutH || {};
  
  return (
    <main className="min-h-screen flex flex-col w-full bg-[#2D1B10] text-[#E8E6E1] pb-24 relative">
      <a 
        href="/" 
        className="absolute md:fixed top-8 left-8 flex items-center gap-2 text-[#C4A464] hover:text-white transition-colors z-[100] font-bold"
      >
        <ArrowLeft className="w-6 h-6" />
        Back
      </a>
      
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32">
        {/* Top Header */}
        <div className="mb-24">
          <span className="text-[#C4A464] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#E8E6E1] leading-tight">
            About Crave
          </h1>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          {/* Left Text */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#E8E6E1]">Welcome to Crave</h2>
            <div className="space-y-6 text-[#EBE6DD]/80 leading-relaxed text-lg">
              <p>{aboutH.p1 || "Welcome to Crave, a vibrant and aromatic destination where nature, flavors, and beauty come together in perfect harmony. Nestled in a serene and lush environment, Crave is designed to offer visitors an immersive experience that celebrates the richness of nature and the charm of spices."}</p>
              <p>{aboutH.p2 || "Whether you are a family seeking a peaceful outing, a nature enthusiast, or someone passionate about plants and greenery, Crave provides a refreshing escape from the daily hustle."}</p>
              <p>{aboutH.p3 || "We take pride in curating a diverse and thoughtfully designed environment that showcases a wide variety of plants, herbs, and spices. Visitors can explore beautifully landscaped pathways, vibrant flowerbeds, and thematic sections dedicated to various aromatic and medicinal plants."}</p>
            </div>
          </div>

          {/* Right Cards */}
          <div className="space-y-6">
            {/* Card 1 */}
            <div className="relative rounded-2xl bg-[#3A2417] p-8 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.03),inset_0_0_5px_rgba(255,255,255,0.05)] hover:bg-[#452D1C] transition-colors">
              <h3 className="text-2xl font-serif text-[#C4A464] mb-4 flex items-center gap-3">
                <Sprout className="w-8 h-8" /> Our Mission
              </h3>
              <p className="text-[#EBE6DD]/80 leading-relaxed">{aboutH.mission || "To create a green sanctuary that promotes environmental awareness, wellness, and education while providing an enjoyable and tranquil experience."}</p>
            </div>

            {/* Card 2 */}
            <div className="relative rounded-2xl bg-[#3A2417] p-8 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.03),inset_0_0_5px_rgba(255,255,255,0.05)] hover:bg-[#452D1C] transition-colors">
              <h3 className="text-2xl font-serif text-[#C4A464] mb-4 flex items-center gap-3">
                <Globe className="w-8 h-8" /> Community & Sustainability
              </h3>
              <p className="text-[#EBE6DD]/80 leading-relaxed">{aboutH.sustainability || "Crave is committed to eco-friendly practices and environmental stewardship."}</p>
            </div>

            {/* Card 3 */}
            <div className="relative rounded-2xl bg-[#3A2417] p-8 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.03),inset_0_0_5px_rgba(255,255,255,0.05)] hover:bg-[#452D1C] transition-colors">
              <h3 className="text-2xl font-serif text-[#C4A464] mb-4 flex items-center gap-3">
                <Gem className="w-8 h-8" /> Our Values
              </h3>
              <p className="text-[#EBE6DD]/80 leading-relaxed">{aboutH.values || "Integrity, sustainability, and community engagement are our guiding principles."}</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <span className="text-[#C4A464] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#E8E6E1]">The Crave Difference</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative rounded-2xl bg-[#3A2417] p-8 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.03),inset_0_0_5px_rgba(255,255,255,0.05)] hover:bg-[#452D1C] transition-colors text-center flex flex-col items-center">
              <Leaf className="w-10 h-10 mb-6 text-[#C4A464]" />
              <h4 className="text-xl font-serif text-[#E8E6E1] mb-3">Natural Beauty</h4>
              <p className="text-[#EBE6DD]/70 text-sm leading-relaxed">Lush spice plantations with a fragrant ambiance</p>
            </div>
            <div className="relative rounded-2xl bg-[#3A2417] p-8 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.03),inset_0_0_5px_rgba(255,255,255,0.05)] hover:bg-[#452D1C] transition-colors text-center flex flex-col items-center">
              <BookOpen className="w-10 h-10 mb-6 text-[#C4A464]" />
              <h4 className="text-xl font-serif text-[#E8E6E1] mb-3">Educational Value</h4>
              <p className="text-[#EBE6DD]/70 text-sm leading-relaxed">Learn cultivation, uses, and history of spices</p>
            </div>
            <div className="relative rounded-2xl bg-[#3A2417] p-8 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.03),inset_0_0_5px_rgba(255,255,255,0.05)] hover:bg-[#452D1C] transition-colors text-center flex flex-col items-center">
              <Users className="w-10 h-10 mb-6 text-[#C4A464]" />
              <h4 className="text-xl font-serif text-[#E8E6E1] mb-3">Family-Friendly</h4>
              <p className="text-[#EBE6DD]/70 text-sm leading-relaxed">Quality time together in nature for all ages</p>
            </div>
            <div className="relative rounded-2xl bg-[#3A2417] p-8 border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.03),inset_0_0_5px_rgba(255,255,255,0.05)] hover:bg-[#452D1C] transition-colors text-center flex flex-col items-center">
              <Camera className="w-10 h-10 mb-6 text-[#C4A464]" />
              <h4 className="text-xl font-serif text-[#E8E6E1] mb-3">Photography</h4>
              <p className="text-[#EBE6DD]/70 text-sm leading-relaxed">Stunning natural landscapes to capture</p>
            </div>
          </div>
        </div>

        {/* The Experience */}
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#C4A464] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">The Experience</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#E8E6E1] mb-10">Join the Crave Experience</h2>
          <div className="space-y-6 text-[#EBE6DD]/80 leading-relaxed text-lg">
            <p>{aboutH.exp1 || "Whether you are visiting for relaxation, education, or exploration, Crave invites you to immerse yourself in a world of natural beauty, aroma, and tranquility."}</p>
            <p>{aboutH.exp2 || "At Crave, we don't just offer a garden — we provide an enriching experience that nourishes the mind, body, and soul while fostering a lasting connection with nature."}</p>
          </div>
        </div>

      </div>
    </main>
  );
}
