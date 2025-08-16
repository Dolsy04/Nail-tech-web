import AdminLogin from "../components/AdminLogin";
import { useState } from "react";
import PricingContent from "../components/PricingContent.jsx"

function PricingPage(){
    const [openAdminComponent, setOpenAdminComponent] = useState(false);

  const openAdmin = () => {
    setOpenAdminComponent(true);
  };

  const closeAdmin = () => {
    setOpenAdminComponent(false);
  };
    return(<>
        <AdminLogin isActive={openAdminComponent} closeComponent={closeAdmin} />
        <PricingContent openAdminBtn={openAdmin}/>
    </>)
}

export default PricingPage;