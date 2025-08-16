import Header from "../components/Header.jsx"
import React, {useState, useEffect, useRef} from "react";
import { db } from "../Firebase/DB-configure.js";
import { getDocs, orderBy, query, collection } from "firebase/firestore";
import {Link} from "react-router-dom";
import { TbCurrencyNaira } from "react-icons/tb";
import { IoSearchSharp } from "react-icons/io5";

function PricingContent({openAdminBtn}){
    const [loading, setLoading] = useState(false);
    const [pricing, setPricing] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredPagination, setFilteredPagination] = useState([]);
    const pageLimit = 8;

    const fetchPricing = async () => {
            setLoading(true);
            try{
                const querySnapShot = query(collection(db, "pricing-db"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(querySnapShot);
                const data = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setPricing(data);
            }catch (error){
                console.error("Error Fetch:", error)
                setMessage("Error occured while fetching", error.message);
            }finally{
                setLoading(false)
            }
    }
    
    useEffect(()=>{fetchPricing()},[])

    useEffect(()=>{
        if(searchTerm.trim()){
            const filtered = pricing.filter((item)=>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.price.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPagination(filtered);
            setCurrentPage(1)
        }else{
            setFilteredPagination(pricing)
        }
    },[pricing, searchTerm])

    const paginatedPage = filteredPagination.slice((currentPage - 1) * pageLimit, currentPage * pageLimit);
    const totalPages = Math.ceil(filteredPagination.length / pageLimit);

    return (<>
        <Header  openAdminBtn={openAdminBtn}/>
        <section className="w-full h-[300px] mt-1 flex items-center justify-center">
             <h2 className="text-white text-center font-bold text-5xl tracking-wider uppercase font-[mulish]">Our Price</h2>
        </section>

        
        <section className="bg-white w-full p-2">
           <div className="w-[80%] mx-auto">
                <div className="flex items-center flex-wrap justify-between mt-4 mb-8">
                    <div>
                        <h3 className="text-3xl font-bold font-[mulish] tracking-wide text-blue-600">Avaliable Price for each services</h3>
                    </div>
                    <div className="lg:max-w-[40%] w-full h-[40px] sm:max-w-full md:max-w-full bg-gray-200 flex items-center lg:justify-between px-2 rounded-full">
                        <IoSearchSharp size={25}/>
                        <input type="search" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search Pricing by name or price.."  className="w-full h-full font-base font-[mulish] px-2 outline-hidden border-none"/>
                    </div>
                </div>

                <div className="mt-5">
                    <div>
                        {loading ? (<p className="text-blue-600 text-2xl font-semibold font-[mulish] text-center">Loading Pricing....</p>) : paginatedPage.length === 0 ? (<p className="text-red-500 text-2xl font-semibold font-[mulish] text-center">No service item found. Add a service to display</p>) : (<>
                            <div className="flex items-center justify-center flex-wrap gap-6 w-[90%] mx-auto my-2">
                                {paginatedPage.map((price)=>(
                                    <div key={price.id} className="bg-[#f0e7e7] p-2 rounded-md">
                                        <div className="w-40 h-30">
                                            <img src={price.image} alt={price.name} className="w-full h-full object-cover rounded-md"/>
                                        </div>
                                        <div className="w-40">
                                            <p className="text-center text-lg font-[mulish] font-medium tracking-wider text-blue-600 capitalize">{price.name}</p>
                                            <p className="text-center text-md font-[mulish] tracking-wider text-gray-700 flex items-center justify-center"><TbCurrencyNaira size={25} className="text-gray-700"/>{price.price}</p>
                                        </div>
                                        
                                    </div>
                                ))}
                            </div>
                        </>)}
                    </div>
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
                <Link className="font-[mulish] text-base text-white underline hover:text-yellow-300 transition-colors duration-300 ease-in-out tracking-wide" to="/servicepage">Service</Link>
                <Link className="font-[mulish] text-base text-white underline hover:text-yellow-300 transition-colors duration-300 ease-in-out tracking-wide" to="/contactpage">Contact</Link>
                <Link className="font-[mulish] text-base text-white underline hover:text-yellow-300 transition-colors duration-300 ease-in-out tracking-wide" to="/">Terms & Conditions</Link>
                <Link className="font-[mulish] text-base text-white underline hover:text-yellow-300 transition-colors duration-300 ease-in-out tracking-wide" to="/">Privacy Policy</Link>
            </div>
        </footer>
    </>)
}

export default PricingContent