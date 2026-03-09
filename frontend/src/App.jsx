import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme, TK } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Header from "./components/Header";
import Footer from "./components/Footer";

// ── Public Pages ──────────────────────────────────────────────────────────────
import HomePage           from "./pages/HomePage";
import CatalogPage        from "./pages/CatalogPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import WeatherPage        from "./pages/WeatherPage";
import FaqPage            from "./pages/FaqPage";
import { AboutPage, ContactPage, PrivacyPage, TermsPage, NotFoundPage } from "./pages/StaticPages";

// ── Auth Pages ────────────────────────────────────────────────────────────────
import LoginPage       from "./pages/LoginPage";
import RegisterPage    from "./pages/RegisterPage";
import { CustomerRegPage, FarmerRegPage } from "./pages/RegistrationPages";

// ── Customer Pages ────────────────────────────────────────────────────────────
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CartPage          from "./pages/CartPage";
import CheckoutPage      from "./pages/customer/CheckoutPage";
import OrdersPage        from "./pages/OrdersPage";
import ProfilePage       from "./pages/customer/ProfilePage";
import ProfileEditPage   from "./pages/customer/ProfileEditPage";
import AddressPage       from "./pages/customer/AddressPage";

// ── Farmer Pages ──────────────────────────────────────────────────────────────
import FarmerDashboard   from "./pages/FarmerDashboard";
import FarmerProductsPage from "./pages/farmer/FarmerProductsPage";
import AddProductPage    from "./pages/farmer/AddProductPage";
import EditProductPage   from "./pages/farmer/EditProductPage";
import FarmerOrdersPage  from "./pages/farmer/FarmerOrdersPage";
import FarmerProfilePage from "./pages/farmer/FarmerProfilePage";

// ── Admin Pages — all live in one file, imported as named exports ─────────────
import {
  AdminLoginPage,
  AdminDashboard,
  AdminProductsPage,
  AdminUsersPage,
  AdminOrdersPage,
} from "./pages/admin/AdminLoginPage";

// ─────────────────────────────────────────────────────────────────────────────
// Route Guards
// ─────────────────────────────────────────────────────────────────────────────
function LoadingScreen() {
  const { dark } = useTheme();
  const tk = TK(dark);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: tk.bg }}>
      <div style={{ textAlign: "center", color: tk.textLt, fontFamily: "'Nunito',sans-serif" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🌿</div>
        <p style={{ fontSize: 16 }}>Loading RPS Fields...</p>
      </div>
    </div>
  );
}

/** Redirect already-logged-in users away from auth pages */
function RequireGuest({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) {
    return <Navigate to={user.role === "farmer" ? "/farmer/dashboard" : "/customer/dashboard"} replace />;
  }
  return children;
}

/** Require a logged-in user; optionally restrict by role */
function RequireAuth({ children, role }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout — Header + main content + Footer
// Admin pages skip the public Header/Footer and render their own sidebar.
// ─────────────────────────────────────────────────────────────────────────────
function Layout() {
  const { dark } = useTheme();
  const tk = TK(dark);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div style={{
      fontFamily: "'Nunito','Segoe UI',sans-serif",
      background: tk.bg,
      minHeight: "100vh",
      color: tk.text,
      transition: "background 0.3s, color 0.3s",
    }}>
      {!isAdmin && <Header />}

      <main style={{
        paddingTop:    isAdmin ? 0 : 68,
        paddingBottom: isAdmin ? 0 : 52,
        minHeight: "100vh",
      }}>
        <Routes>
          {/* ── Public ─────────────────────────────────────────────────────── */}
          <Route path="/"            element={<HomePage />} />
          <Route path="/catalog"     element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/weather"     element={<WeatherPage />} />
          <Route path="/about"       element={<AboutPage />} />
          <Route path="/contact"     element={<ContactPage />} />
          <Route path="/faq"         element={<FaqPage />} />
          <Route path="/privacy"     element={<PrivacyPage />} />
          <Route path="/terms"       element={<TermsPage />} />

          {/* ── Auth (guests only) ─────────────────────────────────────────── */}
          <Route path="/login"             element={<RequireGuest><LoginPage /></RequireGuest>} />
          <Route path="/register"          element={<RequireGuest><RegisterPage /></RequireGuest>} />
          <Route path="/register/customer" element={<RequireGuest><CustomerRegPage /></RequireGuest>} />
          <Route path="/register/farmer"   element={<RequireGuest><FarmerRegPage /></RequireGuest>} />

          {/* Legacy URL redirects */}
          <Route path="/register-customer" element={<Navigate to="/register/customer" replace />} />
          <Route path="/farmer-register"   element={<Navigate to="/register/farmer"   replace />} />

          {/* ── Cart — open to all ─────────────────────────────────────────── */}
          <Route path="/cart" element={<CartPage />} />

          {/* ── Customer ───────────────────────────────────────────────────── */}
          <Route path="/customer/dashboard" element={<RequireAuth role="customer"><CustomerDashboard /></RequireAuth>} />
          <Route path="/checkout"           element={<RequireAuth role="customer"><CheckoutPage /></RequireAuth>} />
          <Route path="/orders"             element={<RequireAuth role="customer"><OrdersPage /></RequireAuth>} />
          <Route path="/profile"            element={<RequireAuth role="customer"><ProfilePage /></RequireAuth>} />
          <Route path="/profile/edit"       element={<RequireAuth role="customer"><ProfileEditPage /></RequireAuth>} />
          <Route path="/address"            element={<RequireAuth role="customer"><AddressPage /></RequireAuth>} />

          {/* ── Farmer ─────────────────────────────────────────────────────── */}
          <Route path="/farmer"                  element={<Navigate to="/farmer/dashboard" replace />} />
          <Route path="/farmer/dashboard"        element={<RequireAuth role="farmer"><FarmerDashboard /></RequireAuth>} />
          <Route path="/farmer/products"         element={<RequireAuth role="farmer"><FarmerProductsPage /></RequireAuth>} />
          <Route path="/farmer/add-product"      element={<RequireAuth role="farmer"><AddProductPage /></RequireAuth>} />
          <Route path="/farmer/edit-product/:id" element={<RequireAuth role="farmer"><EditProductPage /></RequireAuth>} />
          <Route path="/farmer/orders"           element={<RequireAuth role="farmer"><FarmerOrdersPage /></RequireAuth>} />
          <Route path="/farmer/profile"          element={<RequireAuth role="farmer"><FarmerProfilePage /></RequireAuth>} />

          {/* ── Admin ──────────────────────────────────────────────────────── */}
          <Route path="/admin"           element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login"     element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products"  element={<AdminProductsPage />} />
          <Route path="/admin/users"     element={<AdminUsersPage />} />
          <Route path="/admin/orders"    element={<AdminOrdersPage />} />

          {/* ── 404 ────────────────────────────────────────────────────────── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
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
