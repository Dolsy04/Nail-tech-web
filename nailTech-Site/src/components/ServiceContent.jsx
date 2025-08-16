import Header from "../components/Header.jsx";
import React, {useState, useEffect} from "react";
import { db } from "../Firebase/DB-configure.js";
import { getDocs, orderBy, query, collection } from "firebase/firestore";
import {Link} from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";

function ServiceContent({openAdminBtn}){
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredPagination, setFilteredPagination] = useState([]);
    const pageLimit = 8;


    const fecthService = async () =>{
        setLoading(true);

        try{
            const querySnapShot = query(collection(db, "Services-db"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(querySnapShot);
            const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

            setServices(data);
        }catch (error){
            console.error("Error Fetch:", error)
        }finally{
            setLoading(false);
        }
    }
    
     useEffect(()=>{
            fecthService();
    },[]);
    
    // ----------for search and paginated display by search------------
    useEffect(()=>{
        if(searchTerm.trim()){
            const filtered = services.filter((item)=> item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPagination(filtered);
        setCurrentPage(1);
        }else{
            setFilteredPagination(services);
        }
    },[searchTerm, services]);
    
    const paginatedPage = filteredPagination.slice((currentPage - 1) * pageLimit, currentPage * pageLimit);
    const totalPages = Math.ceil(filteredPagination.length / pageLimit);

    return (<>
        <Header  openAdminBtn={openAdminBtn}/>
        <section className="w-full h-[300px] mt-1 flex items-center justify-center">
             <h2 className="text-white text-center font-bold text-5xl tracking-wider uppercase font-[mulish]">Our Services</h2>
        </section>

        <section className="bg-white w-full p-2">
           <div className="w-[80%] mx-auto">
                <div className="flex items-center flex-wrap md:flex-wrap sm:flex-wrap justify-between mt-4 mb-8">
                    <div>
                        <h3 className="text-3xl font-bold font-[mulish] tracking-wide text-blue-600">Avaliable Services</h3>
                    </div>
                    <div className="lg:max-w-[50%] w-full h-[40px] sm:max-w-full md:max-w-full bg-gray-200 flex items-center px-2 rounded-full">
                        <IoSearchSharp size={25}/>
                        <input type="search" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search Service by name....."  className="w-full h-full font-base font-[mulish] px-2 outline-hidden border-none"/>
                    </div>
                </div>

                <div className="mt-5">
                    {loading ? (<p className="text-blue-600 text-2xl font-semibold font-[mulish] text-center">Loading Services....</p>) : paginatedPage.length === 0 ? (<p className="text-red-500 text-2xl font-semibold font-[mulish] text-center">No service item found. Add a service to display</p>) : (<>
                        <div className="flex items-center flex-wrap justify-center gap-6 max-w-[90%] w-full mx-auto">
                            {paginatedPage.map((service) => (
                                <div key={service.id} className="bg-[#f8eeee] p-2 rounded-md">
                                    <div className="w-40 h-30">
                                        <img src={service.serviceImage} alt={service.name} className="w-full h-full object-cover rounded-md"/>
                                    </div>
                                    <div className="w-40">
                                        <p className="text-center text-lg font-[mulish] font-medium tracking-wider text-blue-600 capitalize pt-2">{service.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>)}
                </div>
                <div className="flex justify-center items-center gap-3 my-6">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded cursor-pointer">Previous</button>
                    <span className="font-[mulish] text-sm text-gray-700">  Page {currentPage} of {totalPages}</span>
                    <button
                    disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer">Next</button>
                </div>
           </div>
        </section>

        <footer className="w-full bg-blue-700 py-5">
            <p className="text-center font-[mulish] text-lg text-white">Copyright &copy; {new Date().getFullYear()}. <span className="text-yellow-300 uppercase">NT-Hub</span></p>
            <div className="flex items-center flex-wrap justify-center gap-7">
                <Link className="font-[mulish] text-base text-white underline hover:text-yellow-300 transition-colors duration-300 ease-in-out tracking-wide" to="/">Home</Link>
                <Link className="font-[mulish] text-base text-white underline hover:text-yellow-300 transition-colors duration-300 ease-in-out tracking-wide" to="/pricingpage">Pricing</Link>
                <Link className="font-[mulish] text-base text-white underline hover:text-yellow-300 transition-colors duration-300 ease-in-out tracking-wide" to="/contactpage">Contact</Link>
                <Link className="font-[mulish] text-base text-white underline hover:text-yellow-300 transition-colors duration-300 ease-in-out tracking-wide" to="/">Terms & Conditions</Link>
                <Link className="font-[mulish] text-base text-white underline hover:text-yellow-300 transition-colors duration-300 ease-in-out tracking-wide" to="/">Privacy Policy</Link>
            </div>
        </footer>
    </>)
}

export default ServiceContent