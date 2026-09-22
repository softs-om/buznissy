import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Splash from "./pages/Splash";
import Welcome from "./pages/Welcome";
import BusinessSetup from "./pages/BusinessSetup";
import Plans from "./pages/Plans";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Business from "./pages/Business";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import ProductsServices from "./pages/ProductsServices";
import WebsiteManager from "./pages/WebsiteManager";
import ThemeManager from "./pages/ThemeManager";
import BusinessDetails from "./pages/BusinessDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/business-setup" element={<BusinessSetup />} />
        <Route path="/plans" element={<Plans />} />
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/business" element={<Business />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/business/items" element={<ProductsServices />} />
        <Route path="/business/website" element={<WebsiteManager />} />
        <Route path="/business/theme" element={<ThemeManager />} />
        <Route path="/business/details" element={<BusinessDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
