import { RxHamburgerMenu, RxDashboard } from "react-icons/rx";
import {  BiNotepad } from "react-icons/bi";
import { CgLogOut } from "react-icons/cg";
import { MdMiscellaneousServices, MdMessage, MdPriceChange, MdOutlineDesignServices } from "react-icons/md";
import { GiFingernail } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function SideNav() {
  const [toggleNav, setToggleNav] = useState(false);

  const handleToggle = () => {
    setToggleNav(!toggleNav);
  };

  return (
    <>
      <section className={`sidenav ${toggleNav ? "active" : ""}`}>
        <div className="hamburgercontainer">
          <h2>NAIL-TECH-HUB</h2>
          <RxHamburgerMenu
            size={30}
            className="hamburgerBtn"
            onClick={handleToggle}
          />
        </div>

        <div className="sidenavlinks-container">
          <nav>
            <ul>
              <li>
                <div className="link-wrapper">
                  <NavLink
                    to="/adminboard"
                    end
                    className={({ isActive }) =>
                      `links-container ${isActive ? "active" : ""}`
                    }>
                    <RxDashboard size={24} className="icon" />
                    <span className="links">Overview</span>
                  </NavLink>
                  <p className="tootip">Overview</p>
                </div>
              </li>

              <li>
                <div className="link-wrapper">
                  <NavLink
                    to="CustomerPage"
                    className={({ isActive }) =>
                      `links-container ${isActive ? "active" : ""}`
                    }
                  >
                    <IoIosPeople size={25} className="icon" />
                    <span className="links">Customers</span>
                  </NavLink>
                  <p className="tootip">Customers</p>
                </div>
              </li>

              <li>
                <div className="link-wrapper">
                  <NavLink
                    to="TechnicialPage"
                    className={({ isActive }) =>
                      `links-container ${isActive ? "active" : ""}`
                    }
                  >
                    <GiFingernail size={25} className="icon" />
                    <span className="links">Technicians</span>
                  </NavLink>
                  <p className="tootip">Technicians</p>
                </div>
              </li>

              <li>
                <div className="link-wrapper">
                  <NavLink
                    to="appoinmentpage"
                    className={({ isActive }) =>
                      `links-container ${isActive ? "active" : ""}`
                    }
                  >
                    <BiNotepad size={25} className="icon" />
                    <span className="links">Appointment</span>
                  </NavLink>
                  <p className="tootip">Appointment</p>
                </div>
              </li>
              
              <li>
                <div className="link-wrapper">
                  <NavLink
                    to="servicespage"
                    className={({ isActive }) =>
                      `links-container ${isActive ? "active" : ""}`
                    }
                  >
                    <MdOutlineDesignServices size={25} className="icon" />
                    <span className="links">Services</span>
                  </NavLink>
                  <p className="tootip">Services</p>
                </div>
              </li>

              <li>
                <div className="link-wrapper">
                  <NavLink
                    to="messagepage"
                    className={({ isActive }) =>
                      `links-container ${isActive ? "active" : ""}`
                    }
                  >
                    <MdMessage size={25} className="icon" />
                    <span className="links">Message</span>
                  </NavLink>
                  <p className="tootip">Message</p>
                </div>
              </li>

               <li>
                <div className="link-wrapper">
                  <NavLink
                    to="pricepage"
                    className={({ isActive }) =>
                      `links-container ${isActive ? "active" : ""}`
                    }
                  >
                    <MdPriceChange size={25} className="icon" />
                    <span className="links">Pricing</span>
                  </NavLink>
                  <p className="tootip">Pricing</p>
                </div>
              </li>


              <li>
                <div className="link-wrapper">
                  <NavLink
                    to="settingpage"
                    className={({ isActive }) =>
                      `links-container ${isActive ? "active" : ""}`
                    }
                  >
                    <MdMiscellaneousServices size={25} className="icon" />
                    <span className="links">Setting</span>
                  </NavLink>
                  <p className="tootip">Setting</p>
                </div>
              </li>

              <li>
                <div className="link-wrapper">
                  <NavLink
                    to="/logout"
                    className={({ isActive }) =>
                      `links-container ${isActive ? "active" : ""}`
                    }
                  >
                    <CgLogOut size={25} className="icon" />
                    <span className="links">Logout</span>
                  </NavLink>
                  <p className="tootip">Logout</p>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </>
  );
}

export default SideNav;