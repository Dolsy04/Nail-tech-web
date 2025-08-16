import ContactContent from "../components/ContactContent";
import AdminLogin from "../components/AdminLogin";
import { useState } from "react";
function ContactPage(){

    const [openAdminComponent, setOpenAdminComponent] = useState(false);

  const openAdmin = () => {
    setOpenAdminComponent(true);
  };

  const closeAdmin = () => {
    setOpenAdminComponent(false);
  };


    return(<>
        <ContactContent openAdminBtn={openAdmin}/>
        <AdminLogin isActive={openAdminComponent} closeComponent={closeAdmin} />
    </>)
}

export default ContactPage