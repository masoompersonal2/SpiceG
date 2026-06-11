import { Home } from "./pages/Home";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminMenuItems } from "./pages/admin/AdminMenuItems";
import { AdminApprovedReservations } from "./pages/admin/AdminApprovedReservations";
import { AdminRejectedReservations } from "./pages/admin/AdminRejectedReservations";
import { MenuPage } from "./pages/MenuPage";
import { AboutPage } from "./pages/AboutPage";
import { EventsPage } from "./pages/EventsPage";
import { ContactPage } from "./pages/ContactPage";
import { GalleryPage } from "./pages/GalleryPage";
import { AdminQueries } from "./pages/admin/AdminQueries";
import { AdminGalleryImages } from "./pages/admin/AdminGalleryImages";
import { ContentProvider } from './context/ContentContext';

function App() {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
}

function AppContent() {
  const path = window.location.pathname;
  
  if (path === "/admin/login") {
    return <AdminLogin />;
  }
  
  if (path === "/admin/dashboard") {
    return <AdminDashboard />;
  }

  if (path === "/admin/menu/items") {
    return <AdminMenuItems />;
  }

  if (path === "/admin/reservations/approved") {
    return <AdminApprovedReservations />;
  }

  if (path === "/admin/reservations/rejected") {
    return <AdminRejectedReservations />;
  }

  if (path === "/admin/queries") {
    return <AdminQueries />;
  }

  if (path === "/admin/gallery-images") {
    return <AdminGalleryImages />;
  }
  
  if (path === "/menu") {
    return <MenuPage />;
  }

  if (path === "/about") {
    return <AboutPage />;
  }

  if (path === "/gallery") {
    return <GalleryPage />;
  }

  if (path === "/events") {
    return <EventsPage />;
  }

  if (path === "/contact") {
    return <ContactPage />;
  }

  return <Home />;
}

export default App;
