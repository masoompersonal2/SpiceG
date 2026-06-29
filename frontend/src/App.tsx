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
import { AuthPage } from "./pages/AuthPage";
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { AdminQueries } from "./pages/admin/AdminQueries";
import { AdminGalleryImages } from "./pages/admin/AdminGalleryImages";
import { AdminDeliveryFriendsList } from "./pages/admin/AdminDeliveryFriendsList";
import { StaffDashboard } from "./pages/staff/StaffDashboard";
import { DeliveryFriendDashboard } from "./pages/delivery/DeliveryFriendDashboard";
import { ContentProvider } from './context/ContentContext';
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { DisclaimerPage } from "./pages/DisclaimerPage";

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
  
  if (path === "/admin/delivery-friends") {
    return <AdminDeliveryFriendsList />;
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

  if (path === "/terms") {
    return <TermsPage />;
  }

  if (path === "/privacy") {
    return <PrivacyPage />;
  }

  if (path === "/disclaimer") {
    return <DisclaimerPage />;
  }

  if (path === "/auth") {
    return <AuthPage />;
  }

  if (path === "/dashboard") {
    return <CustomerDashboard />;
  }

  if (path === "/staff/dashboard") {
    return <StaffDashboard />;
  }

  if (path === "/delivery-friend/dashboard") {
    return <DeliveryFriendDashboard />;
  }

  return <Home />;
}

export default App;
