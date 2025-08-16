import React, {useEffect, useState} from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import { collection, doc, orderBy, serverTimestamp, setDoc, query, getDocs, deleteDoc} from "firebase/firestore";
import { db } from "../../Firebase/DB-configure";
import { TbCurrencyNaira } from "react-icons/tb";
import { IoSearchSharp } from "react-icons/io5";

function Customer(){
    const [searchTerm, setSearchTerm] = useState("");
    const [openAddSection, setOpenAddSection] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerNumber, setCustomerNumber] = useState("");
    const [customerService, setCustomerService] = useState("");
    const [customerServicePrice, setCustomerServicePrice] = useState("");
    const [customerNailTech, setCustomerNailTech] = useState("");
    const [response, setResponse] = useState("");
    const [customersData, setCustomersData] = useState([]);
    const [filteredPagination, setFilteredPagination] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const pageLimit = 2;


    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!customerName || !customerEmail || !customerNumber || !customerService || !customerServicePrice || !customerNailTech){
            setResponse("All field are required");
            return;
        }

        setLoading(true);
        const id = isEditing ? editId : customerName.toLowerCase().replace(/\s+/g, "-");

        try{
            await setDoc(doc(db, "customer-db", id),{
                name: customerName,
                email: customerEmail,
                number: customerNumber,
                service: customerService,
                servicePrice: customerServicePrice,
                nailTech: customerNailTech,
                createdAt: serverTimestamp()
            })
            setResponse(isEditing ? "Customer updated successfully" : "Customer added successfully");
            await fetchCustomers(); 

            setCustomerName("");
            setCustomerEmail("");
            setCustomerNumber("");
            setCustomerService("");
            setCustomerServicePrice("");
            setCustomerNailTech("");
            setEditId(null);
            setIsEditing(false);
        }catch(error){
            setResponse(`An error occurred when adding customer : ${error.message}`);
            console.log("Fetch Error:",error);
        } finally{
            setLoading(false);
        }
    };


    const fetchCustomers = async () => {
        setLoading(true);
        try{
            const getCustomerdb = query(collection(db, "customer-db"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(getCustomerdb);
            const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            console.log(data)
            setCustomersData(data);
            setFilteredPagination(data);
            setSelectedAppointment(data)
        }catch(error){
            setResponse(`An error occurred when fetch customer: ${error.message}`);
            console.log("Fetch Error:", error.message);
        }
        setLoading(false);
    }

    useEffect(()=>{
        fetchCustomers();
    },[])

    useEffect(()=>{
        if(searchTerm.trim()){
            const filtered = customersData.filter((item)=> item.name.toLowerCase().includes(searchTerm.toLowerCase()));
            setFilteredPagination(filtered);
            setCurrentPage(1);
        }else{
            setFilteredPagination(customersData);
        }
    },[searchTerm, customersData]);


    const paginatedPage = filteredPagination.slice((currentPage - 1) * pageLimit, currentPage * pageLimit);
    const numberPage = Math.ceil(filteredPagination.length / pageLimit);

    const handleEdit = (customer) =>{
        setCustomerName(customer.name);
        setCustomerEmail(customer.email);
        setCustomerNumber(customer.number);
        setCustomerService(customer.service);
        setCustomerServicePrice(customer.servicePrice);
        setCustomerNailTech(customer.nailTech);
        setIsEditing(true);
        setEditId(customer.id);
        setOpenAddSection(true);
        setResponse("");
    }

    const handleDelete =  async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this customer?, This can't be undone");

        if(!confirmDelete) return;

        try{
            await deleteDoc(doc(db, "customer-db", id));
            console.log("deleted successfully");
            window.alert("deleted successfully")
            fetchCustomers();   
        }catch (error){
            console.error("fetch delete error", error.message);
            alert("Failed to delete. Check permissions.");
        }
    }

    const resetForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setCustomerNumber("");
    setCustomerService("");
    setCustomerServicePrice("");
    setCustomerNailTech("");
    setIsEditing(false);
    setEditId(null);
    setResponse("");
    setOpenAddSection(false);
    };




    return(<>
        <section>
             <div className="flex items-center justify-between mt-6 px-4 customer-header">
                <div>
                    <h2 className="font-[mulish] text-3xl uppercase font-semibold text-blue-600 tracking-wide">Customer Page</h2>
                    <p className="font-[mulish] text-base">Add, Edit, Remove Customer and view avalible customers.</p>
                </div>
                <div className="search-bar-container max-w-[50%] w-full h-[40px] flex items-center rounded-full bg-white px-5">
                    <button className="border-none h-full text-gray-700 cursor-pointer">
                        <IoSearchSharp />
                    </button>
                    <input type="search" value={searchTerm}  onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search Service.."  className="w-[80%] h-full font-base font-[mulish] px-2 outline-hidden bg-white focus:border-none"/>
                </div>
            </div>
        </section>

        <div className="flex flex-wrap items-center gap-4 mt-5 ml-6">
            <div>
                <button
                className="bg-blue-600 p-4 rounded text-white hover:bg-blue-800 cursor-pointer"
                onClick={() => {
                    setResponse("");
                    setOpenAddSection(true);
                }}
                >
                Add New Customer
                </button>
            </div>
            <div className="bg-white p-4 hover:bg-blue-700 hover:text-white rounded">
                <p>To Services Available: <span>{String(filteredPagination.length).padStart(2,"0")}</span></p>
            </div>
        </div>

        <>
            {openAddSection && (
                <section className="w-full h-screen bg-[#000000a4] fixed top-0 left-0 flex justify-center sm:items-start lg:items-center md:items-start z-50">
                    <div className="bg-white rounded-md p-4 relative max-w-[800px] w-full max-h-[400px] h-full overflow-y-scroll inner-form-container">
                        <RiCloseLargeFill
                            size={30}
                            className="absolute right-1 top-1 cursor-pointer"
                            onClick={() => {setOpenAddSection(false); resetForm()}}
                        />
                        <h2 className="font-bold text-xl text-blue-600 uppercase pt-6 pb-0">{isEditing ? "Updating Customer Details":"Add New Customer"}</h2>

                        <p className="text-red-600 text-2xl font-semibold font-[mulish] my-2">{response}</p>
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center gap-6 form-flex-conainer">
                                <div className="w-full h-auto">
                                    <label className="text-sm text-gray-700">Customer Name:</label><br />
                                    <input type="text" className="w-full h-[45px] px-3 mt-2 border rounded-lg focus:outline-none" placeholder="John Doe" value={customerName} onChange={(e) => setCustomerName(e.target.value)}/>
                                </div>
                                <div className="w-full h-auto">
                                    <label className="text-sm text-gray-700">Customer Email:</label><br />
                                    <input type="email" className="w-full h-[45px] px-3 mt-2 border rounded-lg focus:outline-none" placeholder="your@gmail.com" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}/>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 form-flex-conainer">
                                <div className="w-full h-auto">
                                    <label className="text-sm text-gray-700">Customer Contact Number:</label><br />
                                    <input type="tel" className="w-full h-[45px] px-3 mt-2 border rounded-lg focus:outline-none" placeholder="011-1111-1111" value={customerNumber} onChange={(e) => setCustomerNumber(e.target.value)}/>
                                </div>
                                <div className="w-full h-auto">
                                    <label className="text-sm text-gray-700">Service Type:</label><br />
                                    <input type="text" className="w-full h-[45px] px-3 mt-2 border rounded-lg focus:outline-none" placeholder="Manicure, predicure" value={customerService} onChange={(e) => setCustomerService(e.target.value)}/>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 form-flex-conainer">
                                <div className="w-full h-auto">
                                    <label className="text-sm text-gray-700">Service Amount:</label><br />
                                    <input type="number" className="w-full h-[45px] px-3 mt-2 border rounded-lg focus:outline-none" placeholder="40,000" value={customerServicePrice} onChange={(e) => setCustomerServicePrice(e.target.value)}/>
                                </div>
                                <div className="w-full h-auto">
                                    <label className="text-sm text-gray-700">Nail Technician:</label><br />
                                    <input type="text" className="w-full h-[45px] px-3 mt-2 border rounded-lg focus:outline-none" placeholder="Tech Titi" value={customerNailTech} onChange={(e) => setCustomerNailTech(e.target.value)}/>
                                </div>
                            </div>
                            
                            <button disabled={loading} type="submit" className="mt-5 cursor-pointer w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">{loading ? (<div className="flex items-center justify-center gap-4">
                                <h3 className="font-[mulish] text-lg text-white font-semibold">Loading...Please wait</h3>
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
                            </div>) : isEditing ? "+ Update Service" : "+ Add Customer"}</button>
                        </form>
                    </div>
                </section>
            )}
        </>


        <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[700px] table-auto border-collapse border border-gray-300 rounded-md shadow-md mt-5">
                <thead className="bg-blue-700 text-white font-semibold font-[mulish] text-left table-head">
                    <tr>
                        <th className="p-2 border border-gray-300 table-head-dt">S/N</th>
                        <th className="p-2 border border-gray-300 table-head-dt">Name</th>
                        <th className="p-2 border border-gray-300 table-head-dt">Email</th>
                        <th className="p-2 border border-gray-300 table-head-dt">Contact No</th>
                        <th className="p-2 border border-gray-300 table-head-dt text-center" colSpan="3">Action</th>
                    </tr>
                </thead>
                <tbody className="text-sm font-[mulish] text-gray-800 table-body">
                    {loading ? (<tr>
                        <td colSpan="5" className="text-blue-600 text-2xl font-semibold font-[mulish] text-center py-6">Loading Customers Data</td>
                        </tr>) : paginatedPage.length === 0 ? (<tr>
                                <td className="text-center text-2xl text-red-700 font-[mulish] tracking-wide font-bold py-5" colSpan="5">
                                    {customersData.length === 0 ? "No Customers item found. Add a service to display / connection Lost" : "No matching result for your search or Filter."}
                                </td>
                            </tr>) : (
                                paginatedPage.map((customer, index)=> (
                                    <tr key={customer.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                                        <td className="py-4 px-4">{(currentPage - 1) * pageLimit + index + 1}</td>
                                        <td className="py-4 px-4">{customer.name}</td>
                                        <td className="py-4 px-4">{customer.email}</td>
                                        <td className="py-4 px-4">{customer.number}</td>
                                        <td className="py-4 px-4 flex gap-5 items-center" colSpan="3">
                                            <button className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-sm cursor-pointer" onClick={()=> {setShowModal(true); setSelectedAppointment(customer)}}>Details</button>
                                            <button className="bg-blue-700 hover:bg-green-600 text-white px-3 py-1 rounded text-sm cursor-pointer" onClick={() => handleEdit(customer)}>Edit</button>
                                            <button className="bg-red-700 hover:bg-green-600 text-white px-3 py-1 rounded text-sm cursor-pointer" onClick={()=> handleDelete(customer.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                    )}
                </tbody>
            </table>
        </div>

        <div className="flex items-center justify-end gap-2 my-4 px-4">
                <button className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded cursor-pointer" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</button>

                <span className="text-gray-500 font-medium text-sm">Page {currentPage} of {numberPage}</span>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer" onClick={() => setCurrentPage(prev => Math.min(prev + 1, numberPage))} disabled={currentPage === numberPage}
                >Next </button>
        </div>


        {showModal && selectedAppointment &&(
            <section className="bg-[#0000008e] w-full h-screen fixed top-0 left-0 z-10 flex items-center justify-center">
            <div className="bg-white rounded-md py-5 px-4 relative max-w-[600px] w-full max-h-[500px] h-full overflow-y-scroll">
                <RiCloseLargeFill size={30} className="absolute right-1 top-1 cursor-pointer" onClick={()=>setShowModal(false)}/>

                <h2 className="font-[mulish] font-bold tracking-wider text-xl text-blue-600 uppercase pt-6 pb-3">Customer Details</h2>

                <div>
                    <p className="mb-5 font-[mulish] text-md tracking-wide">Name: <span className="ml-1 font-[mulish] text-lg font-semibold tracking-wider">{selectedAppointment.name}</span></p>
                    <p className="mb-5 font-[mulish] text-md tracking-wide">Email: <span className="ml-1 font-[mulish] text-lg font-semibold tracking-wider">{selectedAppointment.email}</span></p>
                    <p className="mb-5 font-[mulish] text-md tracking-wide">Contact Number: <span className="ml-1 font-[mulish] text-lg font-semibold tracking-wider">{selectedAppointment.number}</span></p>
                    <p className="mb-5 font-[mulish] text-md tracking-wide">Servie: <span className="ml-1 font-[mulish] text-lg font-semibold tracking-wider">{selectedAppointment.service}</span></p>
                    <p className="mb-5 font-[mulish] text-md tracking-wide  flex items-center">Service price: <span className="ml-1 font-[mulish] text-lg font-semibold tracking-wider flex items-center"><TbCurrencyNaira /> {selectedAppointment.servicePrice}</span></p>
                    <p className="mb-5 font-[mulish] text-md tracking-wide">Nail Technicial: <span className="ml-1 font-[mulish] text-lg font-semibold tracking-wider">{selectedAppointment.nailTech}</span></p>
                </div>
{/* 
                <div className="flex items-center justify-end gap-6">
                    <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:bg-blue-700 transition-all duration-300 ease-in-out cursor-pointer"> Print</button>
                </div> */}
            </div>
            </section>
        )}
    </>);
}

export default Customer;
