import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import "./styles/App.css";

// UI Components
import Footer from "./compoents/Footer.jsx";
import Header from "./compoents/Header.jsx";
import ScrollToTop from "./compoents/ScrollToTop.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import WelcomePage from "./pages/WelcomePage.jsx";
import Home from "./pages/Home.jsx";
import Signin from "./pages/SignIn.jsx";
import Signup from "./pages/SignUp.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ResetCode from "./pages/ResetCode.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import ShoppingCart from "./pages/ShoppingCart.jsx";
import UserPage from "./pages/UserPage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import PDpage from "./pages/PDpage.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Checkout from "./Pages/Checkout.jsx"
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";
// Admin Pages
import AdminSidebar from "./compoents/AdminSidebar.jsx";
import Admin from "./compoents/Admin.jsx";
import Dashboard from "./compoents/Dashboard.jsx";
import Products from "./compoents/Products.jsx";
import Users from "./compoents/Users.jsx";
import Orders from "./compoents/Orders.jsx";
import CreateCouponPage from "./compoents/CreateCoupon.jsx";

function AppWrapper() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const hideAllUIPaths = ["/"];
  const shouldHideUI = hideAllUIPaths.includes(location.pathname);

  return (
    <>
      {/* Conditionally show Header or AdminSidebar */}
      {!shouldHideUI && !isAdmin && (
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}
      {!shouldHideUI && isAdmin && <AdminSidebar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/homepage" element={<Home searchTerm={searchTerm} />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        <Route path="/ResetCode" element={<ResetCode />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/UserPage" element={<UserPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<ShoppingCart/>}/>
        <Route
          path="/products/category/:category"
          element={<ProductsPage searchTerm={searchTerm} />}
        />
        <Route path="/products/details/:id" element={<PDpage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        {/* Admin Routes (Protected) */}
        <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to="/homepage" />} />
        <Route path="/homepage" element={isAdmin ? <Dashboard /> : <Navigate to="/homepage" />} />
        <Route path="/products" element={isAdmin ? <Products /> : <Navigate to="/homepage" />} />
        <Route path="/users" element={isAdmin ? <Users /> : <Navigate to="/homepage" />} />
        <Route path="/orders" element={isAdmin ? <Orders /> : <Navigate to="/homepage" />} />
        <Route path="/create-coupon" element={isAdmin ? <CreateCouponPage /> : <Navigate to="/homepage" />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        {/* Logout route fallback */}
      </Routes>
      
      {/* Conditionally show footer for users only */}
      {!shouldHideUI && !isAdmin && <Footer />}

      {/* Toast notifications */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppWrapper />
    </Router>
  );
}

export default App;
