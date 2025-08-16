import Header from "../components/Header";
import { BsFillTelephoneFill } from "react-icons/bs";
import { MdOutlineWhatsapp,MdEmail } from "react-icons/md";
import { IoLogoInstagram, IoLocation } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import {Link} from "react-router-dom";
import { useState } from "react";
import {db} from "../Firebase/DB-configure";
import { doc, setDoc, serverTimestamp} from "firebase/firestore";
import { IoIosClose } from "react-icons/io";

function ContactContent({ openAdminBtn }){
      const faqData = [
        {
        question: "What is your return policy?",
        answer: "We accept returns within 30 days of purchase. Items must be in original condition."
        },
        {
        question: "How many hours are you open online and offline?",
        answer: "We are active both online and offline from monday to friday 8am - 5pm and sarturday 9am - 5:30pm."
        },
        {
        question: "Do you offer other services such has eye-lashes or hair-dressing?",
        answer: "Yes, we offer other services such as hair-dressing, eye-lashes, selling deoadurants view our services page for more info or email us at infoservice@gmail.com for more infomations."
        },
        {
        question: "How can I contact customer support?",
        answer: "You can email us at support@example.com or call +123 456 7890. Note customer support will only be avaliable during the working days 8am - 5pm"
        }
    ];

    const [firstname, setFirstname] = useState();
    const [lastname, setLastname] = useState();
    const [email, setEmail] = useState();
    const [phonenumber, setPhonenumber] = useState();
    const [messageBox, setMessageBox] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setIsLoading] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault()

        const trimedFirstName = firstname.trim();
        const trimedLastName = lastname.trim();
        const trimedEmail = email.trim();
        const trimedPhonenumber = phonenumber ? phonenumber.trim() : "";
        const trimedMessageBox = messageBox.trim();

        if(!trimedFirstName || !trimedLastName || !trimedEmail || !trimedMessageBox){
            setResponse("Input are required, only enter valid information");
            return;
        }

        setIsLoading(true);

        try{

            const now = new Date();
            const date = now.getDate().toString().padStart(2, "0");
            const month = (now.getMonth() + 1).toString().padStart(2, "0");
            const year = now.getFullYear();

            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, "0");
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12; // convert 0 to 12

            const formattedTime = `${hours}:${minutes} ${ampm}`;
            const formattedDateTime = `${date}-${month}-${year} | ${formattedTime}`;


            const id = `${trimedFirstName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
            await setDoc(doc(db, "messages-db", id), {
                firstname: trimedFirstName,
                lastname: trimedLastName,
                email: trimedEmail,
                phonenumber: trimedPhonenumber,
                messageBox: trimedMessageBox,
                createdAt: serverTimestamp(),
                status: "unread",
                dateTimeSent: formattedDateTime
            })
            setResponse("Message sent successfully, we'll get back to you within 24hrs.");
            setFirstname("");
            setLastname("");
            setEmail("");
            setPhonenumber("");
            setMessageBox("");
        }catch (error){
            console.error("Error occured while sending message", error.message);
            setResponse(`Error occured while sending message: ${error.message}`);
        }finally{
            setIsLoading(false);
        }
    }

    return(<>
        <Header openAdminBtn={openAdminBtn} />
        <section className="w-full h-[300px] mt-1 flex items-center justify-center">
            <h2 className="text-white text-center font-bold text-5xl tracking-wider uppercase font-[mulish]">contact us</h2>
        </section>

        <section className="bg-white w-full pb-2">
            <div className="w-[90%] mx-auto py-3 flex items-start justify-between gap-7 lg:flex-nowrap flex-wrap">
                <div className="border border-gray-300 rounded-xl lg:max-w-[40%] w-full px-2 py-4">
                    <h2 className="text-2xl font-bold text-blue-700 font-[mulish]">Our Address</h2>
                    <p className="text-gray-700 font-[mulish]">Feel free to visit us at our office or make a request online.</p>
                    
                    <ul className="mt-4">
                        <div className="flex items-start gap-1">
                            <span className="flex gap-1 items-center break-words lg:text-lg text-base font-semibold font-[mulish]"><IoLocation size={20} className="text-blue-600"/> Address:</span>
                            <li className="font-[mulish] break-words lg:text-lg text-base text-black">Ring-Road Oluyole Estate Ibadan Oyo State.</li>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                            <span className="flex gap-1 items-center break-words lg:text-lg text-base font-semibold font-[mulish]"><BsFillTelephoneFill size={20} className="text-blue-600"/> Contact Number:</span>
                            <li className="font-[mulish] lg:text-lg text-base break-words text-blue-600"><a href="tel:08113441673" target="_blank">0811-134-1673</a></li>
                        </div>
                        <div className="flex items-start gap-1 mt-2">
                            <span className="flex gap-1 items-center lg:text-lg text-base font-semibold font-[mulish]"><MdEmail size={20} className="text-blue-600"/>Email:</span>
                            <li className="font-[mulish] lg:text-lg text-base break-words text-blue-600"><a href="mailto:companyinquiery@gmail.com" target="_blank">companyinquiery@gmail.com</a></li>
                        </div>

                        <div className="mt-8 gap-4">
                            <p className="text-gray-700 font-[mulish]">You can also reach out to us on social media</p>
                            <div className="flex items-center gap-4 mt-4">
                                <li className="rounded px-2 py-1 relative overflow-hidden bg-white shadow-xl group">
                                    <span className="absolute inset-0 bg-blue-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-400 ease-in-out"></span>
                                    <a href="" className="relative text-blue-600 group-hover:text-white transition-colors duration-400 ease-in-out z-10"><MdOutlineWhatsapp size={30}/></a>
                                </li>
                                <li className="rounded px-2 py-1 relative overflow-hidden bg-white shadow-xl group">
                                    <span className="absolute inset-0 bg-blue-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-400 ease-in-out"></span>
                                    <a href="" className="relative text-blue-600 group-hover:text-white transition-colors duration-400 ease-in-out z-10"><IoLogoInstagram size={30}/></a>
                                </li>
                                <li className="rounded px-2 py-1 relative overflow-hidden bg-white shadow-xl group">
                                    <span className="absolute inset-0 bg-blue-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-400 ease-in-out"></span>
                                    <a href="" className="relative text-blue-600 group-hover:text-white transition-colors duration-400 ease-in-out z-10"><FaFacebookF size={30}/></a>
                                </li>
                                <li className="rounded px-2 py-1 relative overflow-hidden bg-white shadow-xl group">
                                    <span className="absolute inset-0 bg-blue-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-400 ease-in-out"></span>
                                    <a href="" className="relative text-blue-600 group-hover:text-white transition-colors duration-400 ease-in-out z-10"><FaLinkedinIn size={30}/></a>
                                </li>
                            </div>
                        </div>
                    </ul>
                </div>


                <div className="border border-gray-300 rounded-xl lg:max-w-[50%] w-full px-2 py-4 shadow-2xl">
                    <h2 className="text-2xl font-extrabold text-blue-700 mb-2 font-[mulish]">✉️ Get in Touch</h2>
                    <p className="text-gray-700 font-[mulish]">Send us a message — we’ll respond within 24 hours.</p>
                    <form onSubmit={handleSendMessage} className="mt-3 w-full">
                        <div className="w-full flex items-center gap-4 lg:flex-nowrap flex-wrap">
                            <div className="w-[100%] h-auto">
                                <label className="font-[mulish] text-md text-gray-600" htmlFor="firstname">First Name:</label><br />
                                <input required type="text" value={firstname} onChange={(e)=> setFirstname(e.target.value)} id="firstname" placeholder="Doe" className="border w-full h-[40px] px-2 rounded border-blue-400 outline-blue-600 font-[mulish] text-gray-600 text-lg capitalize"/>
                            </div>
                            <div className="w-[100%] h-auto">
                                <label className="font-[mulish] text-md text-gray-600" htmlFor="lastname">Last Name:</label><br />
                                <input required type="text" value={lastname} onChange={(e)=> setLastname(e.target.value)} id="lastname" placeholder="John" className="border w-full h-[40px] px-2 rounded border-blue-400 outline-blue-600 font-[mulish] text-gray-600 text-lg capitalize"/>
                            </div>
                        </div>
                        <div className="w-full mt-3 h-auto">
                            <label className="font-[mulish] text-md text-gray-600" htmlFor="email">Email:</label><br />
                            <input required type="email" value={email} onChange={(e)=> setEmail(e.target.value)} id="email" placeholder="your@gmail.com"  className="border w-full h-[40px] px-2 rounded border-blue-400 outline-blue-600 font-[mulish] text-gray-600 text-lg"/>
                        </div>
                        <div className="w-full mt-3 h-auto">
                            <label className="font-[mulish] text-md text-gray-600" htmlFor="contactnumber">Contact Number <span>(optional)</span>:</label><br />
                            <input type="tel" value={phonenumber} onChange={(e)=> setPhonenumber(e.target.value)} id="contactnumber" placeholder="0000-000-0000"  className="border w-full h-[40px] px-2 rounded border-blue-400 outline-blue-600 font-[mulish] text-gray-600 text-lg"/>
                        </div>
                        <div className="w-full mt-3 h-auto">
                            <label className="font-[mulish] text-md text-gray-600" htmlFor="message">Message:</label><br />
                            <textarea required value={messageBox} onChange={(e)=> setMessageBox(e.target.value)} id="message" placeholder="Hello,"  className="border w-full h-[140px] p-2 rounded border-blue-400 outline-blue-600 font-[mulish] text-gray-600 text-lg resize-none"></textarea>
                        </div>

                        {response && (<div className="shadow-md bg-white p-2 rounded font-[mulish] text-md text-green-600 flex items-start justify-between">
                            <p>
                                {response}
                            </p>
                            <IoIosClose size={30} className="text-black cursor-pointer" onClick={() => setResponse("")}/>
                        </div>)}

                        <button type="submit" disabled={loading} className="mt-3 relative overflow-hidden px-8 py-3 cursor-pointer bg-blue-300 rounded-full group">
                            <span className="absolute inset-0 bg-blue-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-400 ease-in-out"></span>

                            {loading ? (
                                <span className="flex items-center gap-2 font-[mulish] text-md tracking-wide relative group-hover:text-white transition-colors duration-400 ease-in-out">
                                Sending...
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 font-[mulish] text-md tracking-wide relative group-hover:text-white transition-colors duration-400 ease-in-out">
                                <RiSendPlaneFill size={25} className="group-hover:bg-white group-hover:text-blue-600 group-hover:w-7 group-hover:h-7 p-1 rounded-full transition-all duration-400 ease-in-out" />
                                Send Message
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>

        <section className="bg-cyan-50 w-full p-10">
            <div className="w-[90%] mx-auto py-4">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.9348887175697!2d3.865311373511102!3d7.361195812865332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10398db390820577%3A0x3830b062d54ef922!2sMKO%20Abiola%20Way%2C%20Ibadan%20200273%2C%20Oyo!5e0!3m2!1sen!2sng!4v1752283223638!5m2!1sen!2sng" width="600" height="450" style={{border:0}} loading="lazy"  className="w-full"></iframe>
            </div>
        </section>

        <section className="w-full bg-white py-8">
             <h2 className="text-2xl font-extrabold tracking-wide mb-4 text-center text-blue-600 font-[mulish] ">Frequently Asked Questions</h2>
            <div className="w-[90%] mx-auto">
                 {faqData.map((item, index) => (
                    <details key={index} className="bg-gray-100 rounded-md mb-2 shadow-sm group">
                        <summary className="font-semibold cursor-pointer w-full font-[mulish] flex items-center justify-between px-4 py-4">{item.question} <span className="after:content-['+'] group-open:after:content-['−'] text-lg transition-all duration-300"/></summary>
                        <p className=" text-gray-700 font-[mulish] px-4">{item.answer}</p>
                    </details>
                ))}
            </div>
        </section>

        <footer className="w-full bg-blue-700 py-5">
            <p className="text-center font-[mulish] text-lg text-white">Copyright &copy; {new Date().getFullYear()}. <span className="text-yellow-300 uppercase">NT-Hub</span></p>
            <div className="flex flex-wrap items-center justify-center gap-7">
                <Link className="font-[mulish] text-base text-white underline hover:text-yellow-300 transition-colors duration-300 ease-in-out tracking-wide" to="/">Home</Link>
                <Link className="font-[mulish] text-base text-white underline hover:text-yellow-300 transition-colors duration-300 ease-in-out tracking-wide" to="/pricingpage">Pricing</Link>
                <Link className="font-[mulish] text-base text-white underline hover:text-yellow-300 transition-colors duration-300 ease-in-out tracking-wide" to="/servicepage">Service</Link>
                <Link className="font-[mulish] text-base text-white underline hover:text-yellow-300 transition-colors duration-300 ease-in-out tracking-wide" to="/">Terms & Conditions</Link>
                <Link className="font-[mulish] text-base text-white underline hover:text-yellow-300 transition-colors duration-300 ease-in-out tracking-wide" to="/">Privacy Policy</Link>
            </div>
        </footer>
    </>)
}

export default ContactContent

