import { RiCloseLargeFill } from "react-icons/ri";
import { useState } from "react";
import {db} from "../Firebase/DB-configure.js";
import { collection, addDoc, Timestamp } from "firebase/firestore"; 

function AppointmentComponent({closeComponent, isActive}){
    const [firstName, setFirstName] = useState("")
    const [otherName, setOtherName] = useState("")
    const [email, setEmail] = useState("")
    const [contactNumber, setContactNumber] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [servicesType, setServicesType] = useState("")
    const [preferedNailTech, setprefferedNailTech] = useState("")
    const [specialNote, setSpecialNote] = useState("")
    const [isChecked, setIsChecked] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("pending")

    const handleAppointment = async (e) => {
        e.preventDefault();

        const trimfirstName = firstName.trim();
        const trimotherName = otherName.trim();
        const trimemail = email.trim();
        const trimcontactNumber = contactNumber.trim();
        const trimdate = date.trim();
        const trimtime = time.trim();
        const trimservicesType = servicesType.trim();
        const trimpreferedNailTech = preferedNailTech.trim();
        const trimspecialNote = specialNote.trim();


        if(!trimfirstName || !trimotherName || !trimemail || !trimcontactNumber || !trimdate || !trimtime || !trimservicesType || !isChecked) {
            setErrorMessage("All field are required and ensure confirmation of appointment info by clicking the box");
            return;
        }
        

        setIsLoading(true);
        const [hour, minute] = time.split(":").map(Number);
        const [year, month, day] = date.split("-").map(Number);
        const combinedDateTime = new Date(year, month - 1, day, hour, minute);

        try{
            await addDoc(collection(db, "appointment-booked"), {
                firstname: trimfirstName,
                othername: trimotherName,
                email: trimemail,
                contactNumber: trimcontactNumber,
                date: trimdate,
                time: trimtime,
                servicesTypes: trimservicesType,
                preferredNailTech: trimpreferedNailTech,
                specialNote: trimspecialNote,
                status: "pending",
                timestamp: Timestamp.fromDate(combinedDateTime),
            })
            setSuccessMessage("Appointment booked successfully");
            setErrorMessage("");

            setFirstName("");
            setOtherName("");
            setEmail("");
            setContactNumber("");
            setDate("");
            setTime("");
            setServicesType("");
            setprefferedNailTech("");
            setSpecialNote("");
            setIsChecked(false);
            setStatus("");

            setIsLoading(false);

            setTimeout(()=>{
                closeComponent();
                setSuccessMessage("");
                setIsChecked(false);
            }, 5000)
        }catch (err){
            setErrorMessage(err.message);
            setSuccessMessage("");
            setIsLoading(false);
        }
    }



    return (<>
        <section className={`w-full h-screen bg-[#161615ba] fixed bottom-0 left-0 z-50 pb-[80px] flex items-center justify-center transition-all duration-500 overflow-hidden ${isActive ? "top-0" : "top-full"}`}>
            <div className="w-full max-w-full bg-white rounded-t-xl h-[85vh] overflow-y-auto absolute bottom-0 pb-10 px-6">
                <RiCloseLargeFill size={35} className="text-black cursor-pointer absolute right-0 mt-2 mr-2" onClick={closeComponent}/>
                <div>
                    <h3 className="text-center py-7 font-bold text-blue-800 text-4xl font-[mulish]  tracking-wide">Book an Appoinment</h3>
                    <form onSubmit={handleAppointment} className="w-full lg:w-3/4  mx-auto">
                        <div className="flex items-center justify-around lg:flex-nowrap flex-wrap">
                            <div className=" w-md h-auto">
                                <label className="font-[mulish] text-base ml-1">First Name</label><br />
                                <input type="text" value={firstName} onChange={(e)=> setFirstName(e.target.value)} placeholder="Joe Doe" className="border-gray-400 border w-full h-[40px] mt-2 px-2 font-[mulish] rounded focus:outline-hidden text-lg text-black"/>
                            </div>
                            <div className=" w-md h-auto">
                                <label className="font-[mulish] text-base ml-1">Other Name</label><br />
                                <input type="text"  value={otherName} onChange={(e)=> setOtherName(e.target.value)} placeholder="Joe Doe" className="border-gray-400 border w-full h-[40px] mt-2 px-2 font-[mulish] rounded focus:outline-hidden text-lg text-black"/>
                            </div>
                        </div>
                        <div className="mt-7 flex items-center justify-around lg:flex-nowrap flex-wrap">
                            <div className=" w-md h-auto">
                                <label className="font-[mulish] text-base ml-1">Email</label><br />
                                <input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder="your@gmail.com" className="border-gray-400 border w-full h-[40px] mt-2 px-2 font-[mulish] rounded focus:outline-hidden text-lg text-black"/>
                            </div>
                            <div className=" w-md h-auto">
                                <label className="font-[mulish] text-base ml-1">Contact Number <small className="text-sm text-gray-500">(preferred whatsapp or calling Number)</small></label><br />
                                <input type="tel" value={contactNumber} onChange={(e)=> setContactNumber(e.target.value)} placeholder="+234 000 000 000" className="border-gray-400 border w-full h-[40px] mt-2 px-2 font-[mulish] rounded focus:outline-hidden text-lg text-black"/>
                            </div>
                        </div>
                        <div className="mt-7 flex items-center justify-around lg:flex-nowrap flex-wrap">
                            <div className=" w-md h-auto">
                                <label className="font-[mulish] text-base ml-1">Preferred Date</label>
                                <input type="date" value={date} onChange={(e)=> setDate(e.target.value)} className="border-gray-400 border w-full h-[40px] mt-2 px-2 font-[mulish] rounded focus:outline-hidden text-medium text-black" />
                            </div>
                            <div className=" w-md h-auto">
                               <label className="font-[mulish] text-base ml-1">Preferred Time</label>
                               <input type="time" value={time} onChange={(e)=> setTime(e.target.value)} className="border-gray-400 border w-full h-[40px] mt-2 px-2 font-[mulish] rounded focus:outline-hidden text-medium text-black" />
                            </div>
                        </div>
                        <div className="mt-7 flex items-center justify-around lg:flex-nowrap flex-wrap">
                            <div className=" w-md h-auto">
                                <label className="font-[mulish] text-base ml-1">Service Type</label>
                                <select value={servicesType} onChange={(e)=> setServicesType(e.target.value)} className="border-gray-400 border w-full h-[40px] mt-2 px-2 font-[mulish] rounded focus:outline-hidden text-medium text-black">
                                    <option value="">Select Service</option>
                                    <option value="Acrylic Nails">Acrylic Nails</option>
                                    <option value="Gel Polish">Gel Polish</option>
                                    <option value="Nail Art">Nail Art</option>
                                    <option value="Pedicure">Pedicure</option>
                                    <option value="Manicure">Manicure</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <div className=" w-md h-auto">
                              <label className="font-[mulish] text-base ml-1">Preferred Nail Tech <small className="text-gray-500 text-sm font-[mulish]">(optional)</small></label>
                                <input type="text" value={preferedNailTech} onChange={(e)=> setprefferedNailTech(e.target.value)} placeholder="e.g. Jane A" className="border-gray-400 border w-full h-[40px] mt-2 px-2 font-[mulish] rounded focus:outline-hidden text-medium text-black" />
                            </div>
                        </div>

                        <div className="mt-7 flex items-start w-full">
                            <div className="w-full h-auto">
                                <label className="font-[mulish] text-base ml-1">Special Notes <small className="text-sm text-gray-500 font-[mulish]">(optional)</small></label><br />

                                <textarea rows={8} value={specialNote} onChange={(e)=> setSpecialNote(e.target.value)} placeholder="e.g. I want nude color with gold tips..." className="border-gray-400 border w-full mt-2 px-2 font-[mulish] rounded focus:outline-hidden text-medium text-black resize-y"></textarea>
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center mt-4">
                            <input type="checkbox" value={isChecked} onChange={(e)=> setIsChecked(e.target.checked)} className="mr-2" />
                            I confirm my appointment details are correct.
                            </label>
                        </div>
                        {successMessage && <p className="text-green-600 text-center my-4 font-[mulish] font-bold text-lg">{successMessage}</p>}

                        {errorMessage && <p className="text-red-600 text-center my-4 font-[mulish] font-bold text-lg">{errorMessage}</p>}
                        
                        <div className="w-full flex items-center justify-center mb-20">
                            <button type="submit" className="bg-blue-800 py-3 px-8 cursor-pointer mt-10 rounded-3xl text-lg text-white transition-all duration-700 ease-in-out hover:bg-blue-950" disabled={loading}>
                                {loading ? (
                                     <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        ></path>
                                        </svg>
                                ) : ("Book Appointment")}
                                </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </>);
}

export default AppointmentComponent;

