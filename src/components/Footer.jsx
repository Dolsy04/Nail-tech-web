import Logo from "../assets/favicon.png"
import { Link } from "react-router-dom";

function Footer({aboutClick, reviewsClick, howWeWorkClick, bookingClick}){
    return(<>
        <section className="bg-blue-950 w-full">
            <div className="footer-flex-container w-9/12 mx-auto flex items-start justify-around  py-10">
                <div className="footer-logo flex items-start flex-col gap-[10px]">
                    <img src={Logo} alt="logo" width={100} />
                    <h2 className="text-yellow-400 text-5xl font-bold font-[mulish]">NT-HUB</h2>
                </div>
                <div>
                    <ul className="flex items-start gap-[8px] flex-col py-6 px-4">
                        <li>
                            <Link to="" className="text-white font-medium tracking-wider text-base font-[mulish] transition-all duration-700 ease-in-out hover:text-yellow-300">Home</Link>
                        </li>
                        <li>
                            <Link onClick={aboutClick} className="text-white font-medium tracking-wider text-base font-[mulish] transition-all duration-700 ease-in-out hover:text-yellow-300">About</Link>
                        </li>
                        <li>
                            <Link onClick={reviewsClick} className="text-white font-medium tracking-wider text-base font-[mulish] transition-all duration-700 ease-in-out hover:text-yellow-300">Review</Link>
                        </li>
                        <li>
                            <Link to="/servicepage" className="text-white font-medium tracking-wider text-base font-[mulish] transition-all duration-700 ease-in-out hover:text-yellow-300">Services</Link>
                        </li>
                        <li>
                            <Link to="/pricingpage" className="text-white font-medium tracking-wider text-base font-[mulish] transition-all duration-700 ease-in-out hover:text-yellow-300">Pricing</Link>
                        </li>
                        <li>
                            <Link to="/contactpage" className="text-white font-medium tracking-wider text-base font-[mulish] transition-all duration-700 ease-in-out hover:text-yellow-300">Contact</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <ul className="flex items-start gap-[8px] flex-col py-6 px-4">
                        <li>
                            <Link onClick={bookingClick} className="text-white font-medium tracking-wider text-base font-[mulish] transition-all duration-700 ease-in-out hover:text-yellow-300">Booking</Link>
                        </li>
                        <li>
                            <Link className="text-white font-medium tracking-wider text-base font-[mulish] transition-all duration-700 ease-in-out hover:text-yellow-300">Policy</Link>
                        </li>
                        <li>
                            <Link to="" className="text-white font-medium tracking-wider text-base font-[mulish] transition-all duration-700 ease-in-out hover:text-yellow-300">Privacy</Link>
                        </li>
                        {/* <li>
                            <Link to="" className="text-white font-medium tracking-wider text-base font-[mulish] transition-all duration-700 ease-in-out hover:text-yellow-300">Admin</Link>
                        </li> */}
                        <li>
                            <Link to="" className="text-white font-medium tracking-wider text-base font-[mulish] transition-all duration-700 ease-in-out hover:text-yellow-300">Terms & Condition</Link>
                        </li>
                        <li>
                            <Link onClick={howWeWorkClick} className="text-white font-medium tracking-wider text-base font-[mulish] transition-all duration-700 ease-in-out hover:text-yellow-300">How we work</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <hr className="bg-white h-[2px] w-9/12 mx-auto" />
            <p className="text-sm text-center text-white py-3">&copy;{new Date().getFullYear()} - All right reserved</p>
        </section>
    </>);
}

export default Footer;