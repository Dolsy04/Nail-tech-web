import AdminLogin from "../components/AdminLogin";
import { useState } from "react";
import ServiceContent from "../components/ServiceContent.jsx"

function ServicePage(){
    const [openAdminComponent, setOpenAdminComponent] = useState(false);

  const openAdmin = () => {
    setOpenAdminComponent(true);
  };

  const closeAdmin = () => {
    setOpenAdminComponent(false);
  };

    return(<>
        <AdminLogin isActive={openAdminComponent} closeComponent={closeAdmin} />
        <ServiceContent openAdminBtn={openAdmin}/>
    </>)
}

export default ServicePage;