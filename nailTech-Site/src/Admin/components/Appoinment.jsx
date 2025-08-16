import React, {useState, useEffect} from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import { IoFilterOutline, IoSearchSharp } from "react-icons/io5";
import {db} from "../../Firebase/DB-configure.js";
import { collection, getDocs, orderBy, query, updateDoc, doc, } from "firebase/firestore";



function Appoinment(){
    const [appoinment, setAppoinment] = useState([]);
    const [fliterValue, setFliterValue] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageLimit = 5;
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showModal, setShowModal] = useState(false);


   
    const handleFecthAppoinment = async () =>{
        setLoading(true);
        try{
            const querySnapShot = query(collection(db, "appointment-booked"), orderBy("timestamp", "desc"));
            const snapShot = await getDocs(querySnapShot);
            let data = snapShot.docs.map(doc => ({id: doc.id, ...doc.data()}));

            data = data.sort((a, b) => {    
                const dateA = new Date(`${a.date} ${a.time}`);
                const dateB = new Date(`${b.date} ${b.time}`);
                return dateB - dateA;
            });

            setAppoinment(data);
        } catch (err){
             console.error("Fetch error:", err.message);
        }finally {
            setLoading(false);
        }
    }
    
    const handleCompleteAppoinment = async (id) => {
        await updateDoc(doc(db, "appointment-booked", id), { status: "complete" });
        handleFecthAppoinment();

         if (selectedAppointment?.id === id) {
                setSelectedAppointment((prev) => ({
                ...prev,
                status: "complete"
            }));
        }
    }

    const handleRejectAppoinment = async (id) => {
        await updateDoc(doc(db, "appointment-booked", id), { status: "reject" });
        handleFecthAppoinment();

        if (selectedAppointment?.id === id) {
                setSelectedAppointment((prev) => ({
                ...prev,
                status: "reject"
            }));
        }
    }

    const getFliterAppoinment = () => {
        const lowerSearch = searchTerm.toLowerCase();

        return appoinment.filter((appt) => {
            const matchSearch =
            (appt.firstname?.toLowerCase() || "").includes(lowerSearch) ||
            (appt.othername?.toLowerCase() || "").includes(lowerSearch) ||
            (appt.email?.toLowerCase() || "").includes(lowerSearch) ||
            (appt.date?.toLowerCase() || "").includes(lowerSearch) ||
            (appt.time?.toLowerCase() || "").includes(lowerSearch) ||
            (appt.preferredNailTech?.toLowerCase() || "").includes(lowerSearch) ||
            (appt.contactNumber?.toString().toLowerCase()).includes(lowerSearch);

            if (fliterValue === "complete") {
                return appt.status === "complete" && matchSearch;
            }
            if (fliterValue === "pending") {
                return (appt.status === "" || appt.status === "pending") && matchSearch;
            }
            if (fliterValue === "reject") {
                return appt.status === "reject" && matchSearch;
            }
            return matchSearch;
        });
    };

    useEffect(() => {
        handleFecthAppoinment();
    }, []);

    useEffect(()=>{
        const filtered = getFliterAppoinment();
        setFilteredAppointments(filtered);
        // setCurrentPage(1)
    },[appoinment, searchTerm, fliterValue]);

    const paginatedAppointments = filteredAppointments.slice(
        (currentPage - 1) * pageLimit, 
        currentPage * pageLimit
    );

    const totalPages = Math.ceil(filteredAppointments.length / pageLimit);


    return(<>
        <section>
            <div className="flex items-center justify-between mt-6 px-4 appoinment-header">
                <div>
                    <h2 className="font-[mulish] text-3xl uppercase font-semibold text-blue-600 tracking-wide">Booked Appoinment</h2>
                    <p className="font-[mulish] text-base">View booked appoinment from customers.</p>
                </div>
                <div className="search-bar-container max-w-[50%] w-full h-[40px] flex items-center rounded-full bg-white px-5">
                    <button className="border-none h-full text-gray-700 cursor-pointer">
                        <IoSearchSharp />
                    </button>
                    <input type="search" placeholder="Search by name, email, contact, date&time..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-full font-base font-[mulish] px-2 outline-hidden bg-white focus:border-none"/>
                </div>
            </div>

            <div className="border-amber-50 flex items-center justify-between mt-[50px] px-4 py-2 box-status-container">
                <div className="flex items-center flex-wrap gap-4 status-container">
                    <div className="bg-white p-6 rounded-md transition-all duration-300 ease-in-out hover:bg-blue-700 group appt-status">
                        <p className="text-sm font-[mulish] tracking-wide group-hover:text-white">Pending Appoinment</p>
                        <p className="text-md mt-1 font-[mulish] group-hover:text-white group-hover:italic">{String(appoinment.filter(appt=> appt.status === "" || appt.status === "pending").length).padStart(2,"0")}</p>
                    </div>
                    <div className="bg-white p-6 rounded-md transition-all duration-300 ease-in-out hover:bg-blue-700 group appt-status">
                        <p className="text-sm font-[mulish] tracking-wide group-hover:text-white">Accept Appoinment</p>
                        <p className="text-md mt-1 font-[mulish] group-hover:text-white group-hover:italic">{String(appoinment.filter(appt=>appt.status === "complete").length).padStart(2,"0")}</p>
                    </div>
                    <div className="bg-white p-6 rounded-md transition-all duration-300 ease-in-out hover:bg-blue-700 group appt-status">
                        <p className="text-sm font-[mulish] tracking-wide group-hover:text-white">Reject Appoinment</p>
                        <p className="text-md mt-1 font-[mulish] group-hover:text-white group-hover:italic">{String(appoinment.filter(appt=> appt.status === "reject").length).padStart(2,"0")}</p>
                    </div>
                </div>
                <div className="bg-white p-1 rounded-md  flex items-center gap-3">
                    <p className="font-[mulish] text-md tracking-wide rounded-sm px-2 py-1 flex items-center gap-[3px]"><IoFilterOutline size={20} className="text-blue-700"/> Filter: </p>
                    <select value={fliterValue} onChange={(e)=> setFliterValue(e.target.value)} className="border-1 border-gray-300  p-2 rounded-sm font-[mulish] text-md tracking-wide mt-1">
                        <option className="font-[mulish] text-md tracking-wide" onClick={()=> setFliterValue("all")} value="all">All</option>
                        <option className="font-[mulish] text-md tracking-wide" onClick={()=> setFliterValue("pending")} value="pending">Pending</option>
                        <option className="font-[mulish] text-md tracking-wide" onClick={()=> setFliterValue("complete")} value="complete">Accept</option>
                        <option className="font-[mulish] text-md tracking-wide" onClick={()=> setFliterValue("reject")} value="reject">Reject</option>
                    </select>
                </div>
            </div>

        <div className="overflow-x-auto w-full">
           <table className="w-full min-w-[700px] table-auto border-collapse border border-gray-300 rounded-md shadow-md mt-0">
            <thead className="bg-blue-700 text-white font-semibold font-[mulish] text-left table-head">
                <tr>
                    <th className="p-2 border border-gray-300 table-head-dt">S/N</th>
                    <th className="p-2 border border-gray-300 table-head-dt">Name</th>
                    <th className="p-2 border border-gray-300 table-head-dt">Email</th>
                    <th className="p-2 border border-gray-300 table-head-dt">Contact</th>
                    <th className="p-2 border border-gray-300 table-head-dt">Date & Time</th>
                    <th className="p-2 border border-gray-300 table-head-dt">Details</th>
                    <th className="p-2 border border-gray-300 table-head-dt">Status</th>
                </tr>
            </thead>

            {/* ----------table body to show each rows from db----------- */}

            <tbody className="text-sm font-[mulish] text-gray-800 table-body">
                {loading ? (
                     <tr>
                        <td className="text-center py-5 text-2xl font-semibold text-blue-600 font-[mulish] tracking-wide" colSpan="6">
                        Loading appointments...
                        </td>
                    </tr>
                ) : paginatedAppointments.length === 0 ? (<tr>
                     <td className="text-center text-2xl text-red-700 font-[mulish] tracking-wide font-bold py-5" colSpan="6">
                        {appoinment.length === 0  ? "Appoinment not available / connection lost" : "No matching result for your search or Filter."}
                    </td>
                </tr>) : (
                    paginatedAppointments.map((appt, index)=> (
                        <tr key={appt.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                            <td className="py-4 px-4">{(currentPage - 1) * pageLimit + index + 1}</td>
                            <td className="py-4 px-4">{appt.firstname} {appt.othername}</td>
                            <td className="py-4 px-4">{appt.email}</td>
                            <td className="py-4 px-4">{appt.contactNumber}</td>
                            <td className="py-4 px-4">{appt.date} @ {appt.time}</td>

                            <td className="py-4 px-4">
                                <button className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-sm cursor-pointer" onClick={()=>{setSelectedAppointment(appt); setShowModal(true)}}>Detail</button>
                            </td>

                            <td className="py-4 px-4">
                                {appt.status === "complete" ? (<span className="text-green-600 font-semibold">Accept</span>) : appt.status === "reject" ? (<span className="text-red-600 font-semibold">Rejected</span>) :(<div className="flex space-x-2">
                                    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm cursor-pointer"  onClick={() => handleCompleteAppoinment(appt.id)}>Accept</button>
                                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm cursor-pointer" onClick={() => handleRejectAppoinment(appt.id)}>Reject</button>
                                </div>)}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
           </table>
        </div>
           {/* -----------next and prev btn-------------- */}
           <div className="flex items-center justify-end gap-2 my-4 px-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded cursor-pointer"
                >
                    Previous
                </button>
                <span className="text-gray-500 font-medium text-sm">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer"
                >
                Next
                </button>
           </div>
        </section>
        
        {/* --------To show details-------- */}
            
        {showModal && selectedAppointment && (
            <section className="bg-[#0000008e] w-full h-screen fixed top-0 left-0 z-10 flex items-center justify-center overflow-hidden">
                <div className="bg-white rounded-md py-5 px-4 relative max-w-[600px] w-full max-h-[600px] overflow-y-scroll">
                    <RiCloseLargeFill size={30} className="absolute right-1 top-1 cursor-pointer" onClick={()=>setShowModal(false)}/>
                    <h2 className="font-[mulish] font-bold tracking-wider text-xl text-blue-600 uppercase pt-6 pb-3">Appointment Details</h2>
                    <div className="max-h-[70vh] overflow-y-auto pr-2">
                        <p className="mb-5 font-[mulish] text-md tracking-wide">Name: <span className="ml-1 font-[mulish] text-lg font-semibold tracking-wider">{selectedAppointment.firstname} {selectedAppointment.othername}</span></p>
                        <p className="mb-5 font-[mulish] text-md tracking-wide">Email: <span className="ml-1 font-[mulish] text-lg font-semibold tracking-wider">{selectedAppointment.email}</span></p>
                        <p className="mb-5 font-[mulish] text-md tracking-wide">Contact Number: <span className="ml-1 font-[mulish] text-lg font-semibold tracking-wider">{selectedAppointment.contactNumber}</span></p>
                        <p className="mb-5 font-[mulish] text-md tracking-wide">Date: <span className="ml-1 font-[mulish] text-lg font-semibold tracking-wider">{selectedAppointment.date}</span></p>
                        <p className="mb-5 font-[mulish] text-md tracking-wide">Time: <span className="ml-1 font-[mulish] text-lg font-semibold tracking-wider">{selectedAppointment.time}</span></p>
                        <p className="mb-5 font-[mulish] text-md tracking-wide">Service Type: <span className="ml-1 font-[mulish] text-lg font-semibold tracking-wider">{selectedAppointment.servicesTypes}</span></p>
                        <p className="mb-5 font-[mulish] text-md tracking-wide flex items-center gap-3">Preferred Nail Tech: <span className="ml-1 font-[mulish] text-lg font-semibold tracking-wider">{selectedAppointment.preferredNailTech ? selectedAppointment.preferredNailTech : (<p className="text-red-600 font-[mulish] text-lg">Empty</p>)}</span></p>
                        <p className="mb-5 font-[mulish] text-md tracking-wide flex items-start gap-3">Special Notes: <span className="ml-1 font-[mulish] text-lg font-semibold tracking-wider w-[70%]">{selectedAppointment.specialNote ? selectedAppointment.specialNote : (<p className="text-red-600 font-[mulish] text-lg">Empty</p>)}</span></p>
                    </div>
                    <div className="flex items-center justify-end">
                        <div className="py-3 px-4">
                            {selectedAppointment.status === "complete" ? (<div className="flex items-center gap-2 border p-2">
                            <p className="font-[mulish] text-lg font-semibold tracking-wide">Status:</p><span className="text-green-600 font-semibold tracking-wide font-[mulish] text-lg">Accept</span> </div>) : selectedAppointment.status === "reject" ? (<div className="flex items-center gap-2 border p-2">
                            <p className="font-[mulish] text-lg font-semibold tracking-wide">Status:</p> <span className="text-red-600 tracking-wide font-[mulish] text-lg font-semibold">Rejected</span>
                            </div>) :(<div className="flex space-x-2">
                                <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm cursor-pointer"  onClick={() => handleCompleteAppoinment(selectedAppointment.id)}>Accept</button>
                                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm cursor-pointer" onClick={() => handleRejectAppoinment(selectedAppointment.id)}>Reject</button>
                            </div>)}
                        </div>
                    </div>
                </div>
            </section>)
        }
    </>)
}

export default Appoinment;

