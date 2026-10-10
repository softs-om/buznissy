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
import ComingSoon from "./pages/ComingSoon";
import Security from "./pages/Security";
import ProfileInformation from "./pages/ProfileInformation";
import Subscription from "./pages/Subscription";
import HelpSupport from "./pages/HelpSupport";
import Legal from "./pages/Legal";
import DownloadData from "./pages/DownloadData";
import ChangePassword from "./pages/ChangePassword";
import EditProfile from "./pages/EditProfile";
import ChangeEmail from "./pages/ChangeEmail";
import ProductsServices from "./pages/ProductsServices";
import WebsiteManager from "./pages/WebsiteManager";
import ThemeManager from "./pages/ThemeManager";
import BusinessDetails from "./pages/BusinessDetails";
import ItemForm from "./pages/ItemForm";
import CategoryForm from "./pages/CategoryForm";
import CustomerOrder from "./pages/CustomerOrder.jsx";
import ContactInformation from "./pages/ContactInformation";
import CreateListing from "./pages/CreateListing";
import CreateEntrepreneurService from "./pages/CreateEntrepreneurService";
import CreateInfluencerService from "./pages/CreateInfluencerService";
import CreateProduct from "./pages/CreateProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/business/items/:id/edit" element={<ItemForm />} />
        <Route path="/business/categories/new" element={<CategoryForm />} />
        <Route
          path="/business/categories/:id/edit"
          element={<CategoryForm />}
        />
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
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/security" element={<Security />} />
          <Route path="/profile-information" element={<ProfileInformation />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/help-support" element={<HelpSupport />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/download-data" element={<DownloadData />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/change-email" element={<ChangeEmail />} />
        </Route>
        <Route path="/business/items" element={<ProductsServices />} />
        <Route path="/business/website" element={<WebsiteManager />} />
        <Route path="/business/theme" element={<ThemeManager />} />
        <Route path="/business/details" element={<BusinessDetails />} />
        <Route path="/order/:businessId" element={<CustomerOrder />} />
        <Route path="/contact-information" element={<ContactInformation />} />
        <Route path="/create" element={<CreateListing />} />

        <Route
          path="/create-entrepreneur-service"
          element={<CreateEntrepreneurService />}
        />

        <Route
          path="/create-influencer-service"
          element={<CreateInfluencerService />}
        />

        <Route path="/create-product" element={<CreateProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;