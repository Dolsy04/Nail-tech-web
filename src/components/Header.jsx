import { Link } from "react-router-dom";
import React, {useState} from "react";
import Logo from "../assets/favicon.png";
import { RxHamburgerMenu } from "react-icons/rx";
import { RiCloseLargeFill } from "react-icons/ri";

function Header({aboutClick, reviewsClick, openAdminBtn}) {
  const [openNav, setOpenNav] = useState(false);

  const openNavbar = () => {
    setOpenNav(true);
  }
  const closeNavbar = () => {
    setOpenNav(false);
  }
  return (
    <>
      <header className="flex items-center justify-between bg-gray-100 p-2 w-5/6 mt-4 mb-0 mx-auto rounded-4xl sticky top-2 z-90">
        <div className="logo-container ml-2 flex items-center gap-[10px]">
          <img src={Logo} width={30} alt="logo image" />
          <h3 className="text-2xl tracking-wide font-extrabold text-blue-900 font-[mulish]">NT-HUB</h3>
        </div>

        <div className={`nav-container ${openNav ? "active" : ""}`}>
          <div className="nav-logo-container">
            <div>
              <img src={Logo} width={30} alt="logo image" className="hidden logo-image" />
              <h3 className="text-2xl tracking-wide font-extrabold text-blue-900 font-[mulish] hidden logo-text">NT-HUB</h3>
            </div>
            <RiCloseLargeFill size={30} className="closeIcon hidden mr-10 cursor-pointer font-bold" onClick={closeNavbar}/>
          </div>
          
          <nav>
            <ul className="flex items-center gap-[20px]  font-normal">
              <li>
                <Link className="text-lg text-blue-900 font-[mulish] " to="/">Home</Link>
              </li>
              <li>
                <Link className="text-lg text-blue-900 font-[mulish]" to="/#about" onClick={() => {aboutClick(); closeNavbar();}}>About</Link>
              </li>
              <li>
                <Link className="text-lg text-blue-900 font-[mulish]" to="/#reviews" onClick={() => {reviewsClick(); closeNavbar();}}>Reviews</Link>
              </li>
              <li>
                <Link className="text-lg text-blue-900 font-[mulish] " to="/servicepage" onClick={() => closeNavbar()}>Services</Link>
              </li>
              <li>
                <Link className="text-lg text-blue-900 font-[mulish] " to="/pricingpage" onClick={() => closeNavbar()}>Pricing</Link>
              </li>
              <li>
                <Link className="text-lg text-blue-900 font-[mulish] " to="/contactpage" onClick={() => closeNavbar()}>Contact</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="button-hambuger-container ">
          <div>
            <Link onClick={openAdminBtn} className="admin-btn py-2 px-5 rounded-4xl bg-blue-950 text-white mr-2 font-[mulish] text-base cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-300 hover:text-black">Admin</Link>
          </div>

          <div className="hidden hamburger-container">
            <RxHamburgerMenu size={25} onClick={openNavbar}/>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
