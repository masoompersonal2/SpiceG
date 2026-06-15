import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ContentContextType {
  siteData: any;
  chefData: any[];
  categoryData: any[];
  testimonialData: any[];
  loading: boolean;
}

const ContentContext = createContext<ContentContextType>({
  siteData: null,
  chefData: [],
  categoryData: [],
  testimonialData: [],
  loading: true
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [siteData, setSiteData] = useState<any>(null);
  const [chefData, setChefData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [testimonialData, setTestimonialData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [siteRes, chefRes, catRes, testRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/site`),
          fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/chef`),
          fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/category`),
          fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/content/testimonial`)
        ]);

        if (siteRes.ok) {
          const siteJson = await siteRes.json();
          setSiteData(siteJson);
          
          // Apply SEO Metadata
          if (siteJson.seo) {
            const seo = siteJson.seo;
            if (seo.title) document.title = seo.title;
            if (seo.description) {
              const metaDesc = document.querySelector('meta[name="description"]');
              if (metaDesc) metaDesc.setAttribute("content", seo.description);
            }
            if (seo.keywords) {
              const metaKeywords = document.querySelector('meta[name="keywords"]');
              if (metaKeywords) metaKeywords.setAttribute("content", seo.keywords);
            }
            if (seo.favicon) {
              let linkIcon = document.querySelector('link[rel="icon"]');
              if (!linkIcon) {
                linkIcon = document.createElement('link');
                linkIcon.setAttribute('rel', 'icon');
                document.head.appendChild(linkIcon);
              }
              const faviconUrl = seo.favicon.startsWith('http') ? seo.favicon : (seo.favicon.startsWith('/') && !seo.favicon.startsWith('/uploads') ? seo.favicon : `${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace('/api', '')}${seo.favicon}?v=2`);
              linkIcon.setAttribute('href', faviconUrl);
            }
          }
        }
        if (chefRes.ok) setChefData(await chefRes.json());
        if (catRes.ok) setCategoryData(await catRes.json());
        if (testRes.ok) setTestimonialData(await testRes.json());
      } catch (err) {
        console.error("Failed to load CMS content:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <ContentContext.Provider value={{ siteData, chefData, categoryData, testimonialData, loading }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
