import {Routes, Route} from "react-router-dom";
import React, { useState } from "react";
import Homepage from "./components/Homepage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import ServicePage from "./pages/ServicesPage.jsx";
import PricingPage from "./pages/PricingPage.jsx";
import AdminDashboard from "./Admin/pages/AdminDashboard.jsx"
import OverviewContent from "./Admin/components/OverviewContent.jsx";
import AppoinmentPage from "./Admin/pages/AppoinmentPage.jsx";
import ServicesPage from "./Admin/pages/ServicesPage.jsx";
import ProtectedPage from "./Firebase/ProtectedRoute.jsx";
import CustomerPage from "./Admin/pages/CustomerPage.jsx";
import TechnicialPage from "./Admin/pages/TechnicialPage.jsx";
import PricePage from "./Admin/pages/PricingPage.jsx";
import MessagePage from "./Admin/pages/MessagePage.jsx";
import SettingPage from "./Admin/pages/SettingPage.jsx";
import LogoutPage from "./Admin/pages/LogoutPage.jsx";
import AdminLogin from "./components/AdminLogin.jsx";



function App() {

  const [openAdminComponent, setOpenAdminComponent] = useState(false);
  const openAdmin = () =>{
    setOpenAdminComponent(true)
  }
  const closeAdmin = () =>{
    setOpenAdminComponent(false)
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage openAdminBtn={openAdmin}/>} />
        <Route path="contactpage" element={<ContactPage openAdminBtn={openAdmin}/>} />
        <Route path="servicepage" element={<ServicePage />}/>
        <Route path="pricingpage" element={<PricingPage />}/>
        
          <Route path="/adminboard" element={
            <ProtectedPage>
              <AdminDashboard />
            </ProtectedPage>}>
            <Route index element={<OverviewContent />} />
            <Route path="appoinmentpage" element={<AppoinmentPage />} />
            <Route path="servicespage" element={<ServicesPage />}/>
            <Route path="CustomerPage" element={<CustomerPage />} />
            <Route path="TechnicialPage" element={<TechnicialPage />}/>
            <Route path="pricepage" element={<PricePage />}/>
            <Route path="messagepage" element={<MessagePage />}/>
            <Route path="settingpage" element={<SettingPage />} />
          </Route>
        <Route path="/logout" element={<LogoutPage />}/>
    </Routes>

     <AdminLogin isActive={openAdminComponent} closeComponent={closeAdmin} />
    </>
  );
}

export default App;
