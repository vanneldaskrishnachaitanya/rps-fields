import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme, TK } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Header from "./components/Header";
import Footer from "./components/Footer";

// ── Public ────────────────────────────────────────────────────────────────────
import HomePage           from "./pages/HomePage";
import CatalogPage        from "./pages/CatalogPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import WeatherPage        from "./pages/WeatherPage";
import FaqPage            from "./pages/FaqPage";
import { AboutPage, ContactPage, PrivacyPage, TermsPage, NotFoundPage } from "./pages/StaticPages";

// ── Auth ──────────────────────────────────────────────────────────────────────
import LoginPage    from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { CustomerRegPage, FarmerRegPage, AgentRegPage } from "./pages/RegistrationPages";

// ── Customer ──────────────────────────────────────────────────────────────────
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CartPage          from "./pages/CartPage";
import CheckoutPage      from "./pages/customer/CheckoutPage";
import OrdersPage        from "./pages/OrdersPage";
import ProfilePage       from "./pages/customer/ProfilePage";
import ProfileEditPage   from "./pages/customer/ProfileEditPage";
import AddressPage       from "./pages/customer/AddressPage";

// ── Farmer ────────────────────────────────────────────────────────────────────
import FarmerDashboard    from "./pages/FarmerDashboard";
import FarmerProductsPage from "./pages/farmer/FarmerProductsPage";
import FarmerOrdersPage   from "./pages/farmer/FarmerOrdersPage";
import FarmerProfilePage  from "./pages/farmer/FarmerProfilePage";
import { FindAgentsPage, PartneredAgentsPage } from "./pages/farmer/FarmerAgentPages";
import FarmerRevenuePage  from "./pages/farmer/FarmerRevenuePage";

// ── Agent ─────────────────────────────────────────────────────────────────────
import AgentDashboard       from "./pages/agent/AgentDashboard";
import AgentAddProductPage  from "./pages/agent/AgentAddProductPage";
import { AgentProductsPage, AgentOrdersPage, AgentFarmersPage, AgentRequestsPage, AgentEditProductPage } from "./pages/agent/AgentPages";

// ── Admin ─────────────────────────────────────────────────────────────────────
import {
  AdminLoginPage, AdminDashboard,
  AdminUsersPage, AdminFarmersPage, AdminAgentsPage,
  AdminProductsPage, AdminOrdersPage,
} from "./pages/admin/AdminLoginPage";

// ─────────────────────────────────────────────────────────────────────────────
function LoadingScreen() {
  const { dark } = useTheme(); const tk = TK(dark);
  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:tk.bg }}>
      <div style={{ textAlign:"center", color:tk.textLt, fontFamily:"'Nunito',sans-serif" }}>
        <div style={{ fontSize:64, marginBottom:12 }}>🌿</div>
        <p style={{ fontSize:16 }}>Loading RPS Fields...</p>
      </div>
    </div>
  );
}

function RequireGuest({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) {
    const dest = { farmer:"/farmer/dashboard", agent:"/agent/dashboard", customer:"/customer/dashboard", admin:"/admin/dashboard" };
    return <Navigate to={dest[user.role]||"/"} replace />;
  }
  return children;
}

function RequireAuth({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && (Array.isArray(role) ? !role.includes(user.role) : user.role !== role))
    return <Navigate to="/" replace />;
  return children;
}

function Layout() {
  const { dark } = useTheme(); const tk = TK(dark);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div style={{ fontFamily:"'Nunito','Segoe UI',sans-serif", background:tk.bg, minHeight:"100vh", color:tk.text, transition:"background 0.3s,color 0.3s" }}>
      {!isAdmin && <Header />}
      <main style={{ paddingTop:isAdmin?0:68, paddingBottom:isAdmin?0:52, minHeight:"100vh" }}>
        <Routes>
          {/* Public */}
          <Route path="/"            element={<HomePage />} />
          <Route path="/catalog"     element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/weather"     element={<WeatherPage />} />
          <Route path="/about"       element={<AboutPage />} />
          <Route path="/contact"     element={<ContactPage />} />
          <Route path="/faq"         element={<FaqPage />} />
          <Route path="/privacy"     element={<PrivacyPage />} />
          <Route path="/terms"       element={<TermsPage />} />

          {/* Auth */}
          <Route path="/login"             element={<RequireGuest><LoginPage /></RequireGuest>} />
          <Route path="/register"          element={<RequireGuest><RegisterPage /></RequireGuest>} />
          <Route path="/register/customer" element={<RequireGuest><CustomerRegPage /></RequireGuest>} />
          <Route path="/register/farmer"   element={<RequireGuest><FarmerRegPage /></RequireGuest>} />
          <Route path="/register/agent"    element={<RequireGuest><AgentRegPage /></RequireGuest>} />
          <Route path="/register-customer" element={<Navigate to="/register/customer" replace />} />
          <Route path="/farmer-register"   element={<Navigate to="/register/farmer"   replace />} />

          {/* Cart */}
          <Route path="/cart" element={<CartPage />} />

          {/* Customer */}
          <Route path="/customer/dashboard" element={<RequireAuth role="customer"><CustomerDashboard /></RequireAuth>} />
          <Route path="/checkout"           element={<RequireAuth role="customer"><CheckoutPage /></RequireAuth>} />
          <Route path="/orders"             element={<RequireAuth role="customer"><OrdersPage /></RequireAuth>} />
          <Route path="/profile"            element={<RequireAuth role="customer"><ProfilePage /></RequireAuth>} />
          <Route path="/profile/edit"       element={<RequireAuth role="customer"><ProfileEditPage /></RequireAuth>} />
          <Route path="/address"            element={<RequireAuth role="customer"><AddressPage /></RequireAuth>} />

          {/* Farmer */}
          <Route path="/farmer"                  element={<Navigate to="/farmer/dashboard" replace />} />
          <Route path="/farmer/dashboard"        element={<RequireAuth role="farmer"><FarmerDashboard /></RequireAuth>} />
          <Route path="/farmer/products"         element={<RequireAuth role="farmer"><FarmerProductsPage /></RequireAuth>} />
          <Route path="/farmer/orders"           element={<RequireAuth role="farmer"><FarmerOrdersPage /></RequireAuth>} />
          <Route path="/farmer/profile"          element={<RequireAuth role="farmer"><FarmerProfilePage /></RequireAuth>} />
          <Route path="/farmer/find-agents"      element={<RequireAuth role="farmer"><FindAgentsPage /></RequireAuth>} />
          <Route path="/farmer/my-agents"        element={<RequireAuth role="farmer"><PartneredAgentsPage /></RequireAuth>} />
          <Route path="/farmer/revenue"          element={<RequireAuth role="farmer"><FarmerRevenuePage /></RequireAuth>} />

          {/* Agent */}
          <Route path="/agent"                        element={<Navigate to="/agent/dashboard" replace />} />
          <Route path="/agent/dashboard"              element={<RequireAuth role="agent"><AgentDashboard /></RequireAuth>} />
          <Route path="/agent/add-product"            element={<RequireAuth role="agent"><AgentAddProductPage /></RequireAuth>} />
          <Route path="/agent/products"               element={<RequireAuth role="agent"><AgentProductsPage /></RequireAuth>} />
          <Route path="/agent/edit-product/:id"       element={<RequireAuth role="agent"><AgentEditProductPage /></RequireAuth>} />
          <Route path="/agent/orders"                 element={<RequireAuth role="agent"><AgentOrdersPage /></RequireAuth>} />
          <Route path="/agent/farmers"                element={<RequireAuth role="agent"><AgentFarmersPage /></RequireAuth>} />
          <Route path="/agent/requests"               element={<RequireAuth role="agent"><AgentRequestsPage /></RequireAuth>} />

          {/* Admin */}
          <Route path="/admin"           element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login"     element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users"     element={<AdminUsersPage />} />
          <Route path="/admin/farmers"   element={<AdminFarmersPage />} />
          <Route path="/admin/agents"    element={<AdminAgentsPage />} />
          <Route path="/admin/products"  element={<AdminProductsPage />} />
          <Route path="/admin/orders"    element={<AdminOrdersPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Layout />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
