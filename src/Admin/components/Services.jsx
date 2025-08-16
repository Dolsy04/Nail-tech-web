import React, {useState, useEffect, useRef} from "react";
import { RiCloseLargeFill } from "react-icons/ri";
import { IoSearchSharp } from "react-icons/io5";
import { db } from "../../Firebase/DB-configure";
import { doc, setDoc, getDocs, orderBy, query, serverTimestamp, collection, deleteDoc } from "firebase/firestore";


function Services(){
    const [openAddSection, setOpenAddSection] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [serviceName, setServiceName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [Message, setMessage] = useState("");
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // for receving data --------------------

    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredPagination, setFilteredPagination] = useState([]);
    const pageLimit = 8;
    


    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    // --------for adding service-------------------
    const handleSubmitServices = async (e) =>{
        e.preventDefault();

        if(!serviceName || (!imageFile && !previewImage)){
            setMessage("All fields are required");
            return;
        }

        try{
            setLoading(true)
           
            const base64 = imageFile ?  await toBase64(imageFile) : previewImage;
            const id = isEditing ? editId : serviceName.toLowerCase().replace(/\s+/g, "-");
            await setDoc(doc(db, "Services-db", id),{
                name: serviceName,
                serviceImage: base64,
                createdAt: serverTimestamp()
            })
            setMessage(isEditing ? "Service updated successfully" :"Services Added Succefully");
            fecthService();

            setServiceName("");
            setImageFile(null);
            setPreviewImage(null);
            fileInputRef.current.value = null;
            setIsEditing(false);
            setEditId(null);
            setOpenAddSection(false);
        }catch (error){
            console.error("Upload error:", error);
            setMessage("Something went wrong, Try again later");
        }finally{
            setLoading(false);
        }
    } 

    // --------for fetching service-----------------
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

    // --------------for pagination & number of page------------------
    const paginatedPage = filteredPagination.slice((currentPage - 1) * pageLimit, currentPage * pageLimit);
    const totalPages = Math.ceil(filteredPagination.length / pageLimit);


    // ------------for edit service-----------------
    const handleEdit = (service)=>{
        setServiceName(service.name);
        setPreviewImage(service.serviceImage);
        setImageFile(null);
        setIsEditing(true);
        setEditId(service.id);
        setOpenAddSection(true);
        setMessage("");
    }

    // --------------for delete service-----------------
    const handleDelete = async (id)=>{
        const confirmDelete = window.confirm("Are you sure you want to delete this service?");
        if(!confirmDelete) return;

        try{
            await deleteDoc(doc(db, "Services-db", id));
            console.log("Deleted successfully");
            fecthService();
        }catch (error){
            console.error("fetch delete error", error.message);
            alert("Failed to delete. Check permissions.");
        }

    }

    return(<>
        <section>

            <div className="flex items-center justify-between mt-6 px-4 services-header">
                <div>
                    <h2 className="font-[mulish] text-3xl uppercase font-semibold text-blue-600 tracking-wide">Services Section</h2>
                    <p className="font-[mulish] text-base">Add, Edit, Remove Services and view avalible services.</p>
                    <p className="font-[mulish] tracking-wider uppercase text-red-600"><strong>Note: This Control the frontend of your website</strong></p>
                </div>
                <div className="search-bar-container max-w-[50%] w-full h-[40px] flex items-center rounded-full bg-white px-5">
                    <button className="border-none h-full text-gray-700 cursor-pointer">
                        <IoSearchSharp />
                    </button>
                    <input type="search" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search Service.."  className="w-[80%] h-full font-base font-[mulish] px-2 outline-hidden bg-white focus:border-none"/>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-5 ml-6">
                <div>
                    <button className="bg-blue-600 p-4 rounded text-md text-white font-[mulish] cursor-pointer hover:bg-blue-800 transition duration-300 ease-in-out" onClick={()=>{ setOpenAddSection(true),
                        setIsEditing(false);
                        setServiceName("");
                        setPreviewImage(null);
                        setImageFile(null);
                        fileInputRef.current.value = null;
                    }}>Add New Service</button>
                </div>
                <div className="bg-white p-4 transition-all duration-300 ease-in-out hover:bg-blue-700 hover:text-white rounded-md font-[mulish] capitalize tracking-wider text-base">
                    <p>To Services avalible: <span>{String(filteredPagination.length).padStart(2,"0")}</span></p>
                </div>
            </div>

            {/* -----------Adding services----------- */}
            {openAddSection && (<section className="w-full h-screen bg-[#000000a4] fixed top-0 left-0 flex items-center justify-center z-10 overflow-y-auto">
            <div className="bg-white rounded-md px-4 pt-4 pb-3 relative max-w-[800px] w-full max-h-[400px] h-full overflow-y-scroll inner-form-container">
                <RiCloseLargeFill size={30} className="absolute right-1 top-1 cursor-pointer" onClick={()=> setOpenAddSection(false)}/>

                <h2 className="font-[mulish] font-bold tracking-wider text-xl text-blue-600 uppercase pt-6 pb-3">{isEditing ? "Editing Services" : "Add New Services"}</h2> 

                <form onSubmit={handleSubmitServices} className="">
                    <div className="w-full h-auto">
                        <label className="font-[mulish] text-sm text-gray-700 tracking-wide ">Servces Name:</label><br />
                        <input type="text" value={serviceName} onChange={(e) => setServiceName(e.target.value)} className="w-full h-[45px] px-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base font-[mulish]"  placeholder="Predicure, Manicure"/>
                    </div>
                    <div className="mt-4 w-full h-auto">
                        <label className="font-[mulish] text-sm text-gray-700 tracking-wide mb-0">Servces Image:</label><br />

                        <input type="file"  ref={fileInputRef} onChange={(e)=> {
                                const file = e.target.files[0];
                                    if (file) {
                                        setImageFile(file)
                                        setPreviewImage(URL.createObjectURL(file))
                                    }
                                }
                            } className="w-full h-[45px] font-[mulish] px-3 pt-2 mt-2 border border-gray-300 rounded-lg file:mr-4  file:py-1 file:px-4 file:border-0 file:rounded-lg file:bg-purple-600 file:text-white file:font-[mulish] file:cursor-pointer focus:outline-none" accept="image/*"/>
                    </div>
                    {/* ----image-preview */}
                    <div className="w-32 h-32 rounded-sm border my-2">
                        {previewImage && (<img src={previewImage} alt="preview uploaded image" className="w-full h-full object-cover rounded-sm"/>)}
                    </div>

                    <p className="text-red-600 text-md font-[mulish] my-2">{Message}</p>
                    
                    <div>
                        <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-semibold tracking-wide cursor-pointer">
                            {loading ? (<div className="flex items-center justify-center gap-3">Loading... please wait <svg
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
                                </svg></div>) : isEditing ? "Update Service" : "+ Add Service"}
                            </button>
                    </div>
                </form>
            </div>
            </section>)}


            
            {/* -----------Show services added-------- */}

            <div className="mt-5">
                 {loading ? (<p className="text-blue-600 text-2xl font-semibold font-[mulish] text-center">Loading Services....</p>) : paginatedPage.length === 0 ? (<p className="text-red-500 text-2xl font-semibold font-[mulish] text-center">No service item found. Add a service to display</p>) : (<>
                    <div className="flex flex-wrap gap-2 items-center justify-center lg:justify-start lg:gap-6 lg:w-[90%] sm:w-full md:gap-3 md:w-full mx-auto my-2">
                        {paginatedPage.map((service) => (
                            <div key={service.id} className="bg-white p-2 rounded-md">
                                <div className="w-40 h-30">
                                    <img src={service.serviceImage} alt={service.name} className="w-full h-full object-cover rounded-md"/>
                                </div>
                                <div className="w-40">
                                    <p className="text-center text-lg font-[mulish] font-medium tracking-wider text-blue-600 capitalize">{service.name}</p>
                                </div>
                                <div className="flex items-center justify-center gap-3 mt-1">
                                    <button onClick={() => handleEdit(service)} className="bg-blue-600 text-white py-1 px-3 cursor-pointer rounded-md font-[mulish] text-base tracking-wide hover:bg-blue-800 transition-all duration-300 ease-in-out">Edit</button>
                                    <button onClick={() => handleDelete(service.id)} className="bg-red-600 text-white py-1 px-3 cursor-pointer rounded-md font-[mulish] text-base tracking-wide hover:bg-red-800 transition-all duration-300 ease-in-out">Delete</button>

                              </div>
                            </div>
                        ))}
                    </div>
                 </>)}
            </div>


            {/* -----------pagination buttons--------- */}
            <div className="flex justify-center items-center gap-3 my-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded cursor-pointer"
            >
              Previous
            </button>
            <span className="font-[mulish] text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer"
            >
              Next
            </button>
          </div>
        </section>
    </>);
}

export default Services