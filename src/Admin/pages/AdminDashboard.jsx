import {Outlet} from "react-router-dom";
import "../../Admin/styles/adminboard.css";
import SideNav from "../components/SideNav.jsx";
import ResponsiveNav from "../components/ResponsiveNav.jsx"

function AdminDashboard(){
    return(<>
        <div className="flex-container">
            <SideNav/>
            <ResponsiveNav/>
            <div className="main-content">
              <Outlet />
            </div>
        </div>
    </>);
}


export default AdminDashboard;