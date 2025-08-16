import { NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import {
  MdMiscellaneousServices,
  MdMessage,
  MdPriceChange,
  MdOutlineDesignServices,
} from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { GiFingernail } from "react-icons/gi";
import { BiNotepad } from "react-icons/bi";
import { CgLogOut } from "react-icons/cg";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { useState } from "react";

function ResponsiveNav() {
  const [toggleMenu, setToggleMenu] = useState(false);

  const handleToggle = () => {
    setToggleMenu(!toggleMenu);
  };

  const autoclose = () => {
    setToggleMenu(false);
  };

  return (
    <>
      <section className="responsive-nav">
        <nav>
          <ul>
            <li>
              <div onClick={() => autoclose()}>
                <NavLink
                  to="/adminboard"
                  end
                  className={({ isActive }) =>
                    `links-container-res ${isActive ? "active" : ""}`
                  }
                >
                  <RxDashboard size={20} color="blue" />
                  <span>Overview</span>
                </NavLink>
              </div>
            </li>
            <li>
              <div onClick={() => autoclose()}>
                <NavLink
                  to="messagepage"
                  end
                  className={({ isActive }) =>
                    `links-container-res ${isActive ? "active" : ""}`
                  }
                >
                  <MdMessage size={20} color="blue" />
                  <span>Message</span>
                </NavLink>
              </div>
            </li>

            <li onClick={handleToggle}>
              <div className="menu-link">
                <NavLink>
                  {toggleMenu ? (
                    <>
                      <FaArrowDown size={20} className="menu-icon" />
                      <span className="menu-text">Close</span>
                    </>
                  ) : (
                    <>
                      <FaArrowUp size={20} className="menu-icon" />
                      <span className="menu-text">Menu</span>
                    </>
                  )}
                </NavLink>
              </div>
            </li>

            <li>
              <div onClick={() => autoclose()}>
                <NavLink
                  to="settingpage"
                  end
                  className={({ isActive }) =>
                    `links-container-res ${isActive ? "active" : ""}`
                  }
                >
                  <MdMiscellaneousServices size={20} color="blue" />
                  <span>Setting</span>
                </NavLink>
              </div>
            </li>

            <li>
              <div onClick={() => autoclose()}>
                <NavLink to="/logout">
                  <CgLogOut size={20} color="red" />
                  <span>Logout</span>
                </NavLink>
              </div>
            </li>
          </ul>
        </nav>
      </section>

      <section className={`menu-content ${toggleMenu ? "isActive" : ""}`}>
        <nav>
          <ul>
            <li>
              <div onClick={() => autoclose()}>
                <NavLink
                  to="CustomerPage"
                  end
                  className={({ isActive }) =>
                    `links-container-res ${isActive ? "active" : ""}`
                  }
                >
                  <IoIosPeople size={20} color="blue" />
                  <span>Customers</span>
                </NavLink>
              </div>
            </li>

            <li>
              <div onClick={() => autoclose()}>
                <NavLink
                  to="TechnicialPage"
                  end
                  className={({ isActive }) =>
                    `links-container-res ${isActive ? "active" : ""}`
                  }
                >
                  <GiFingernail size={20} color="blue" />
                  <span>Technicians</span>
                </NavLink>
              </div>
            </li>

            <li>
              <div onClick={() => autoclose()}>
                <NavLink
                  to="appoinmentpage"
                  end
                  className={({ isActive }) =>
                    `links-container-res ${isActive ? "active" : ""}`
                  }
                >
                  <BiNotepad size={20} color="blue" />
                  <span>Appointment</span>
                </NavLink>
              </div>
            </li>

            <li>
              <div onClick={() => autoclose()}>
                <NavLink
                  to="servicespage"
                  end
                  className={({ isActive }) =>
                    `links-container-res ${isActive ? "active" : ""}`
                  }
                >
                  <MdOutlineDesignServices size={20} color="blue" />
                  <span>Services</span>
                </NavLink>
              </div>
            </li>

            <li>
              <div onClick={() => autoclose()}>
                <NavLink
                  to="pricepage"
                  end
                  className={({ isActive }) =>
                    `links-container-res ${isActive ? "active" : ""}`
                  }
                >
                  <MdPriceChange size={20} color="blue" />
                  <span>Pricing</span>
                </NavLink>
              </div>
            </li>
          </ul>
        </nav>
      </section>
    </>
  );
}

export default ResponsiveNav;
