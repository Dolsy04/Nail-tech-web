import {useState, useEffect} from "react";
import { useAuth } from "../../Firebase/authContext.jsx";
import profileImage from "../../assets/profile-image.png";
import { IoClose, IoSearchSharp } from "react-icons/io5";
import {db, auth} from "../../Firebase/DB-configure.js";
import { secondaryAuth } from "../../Firebase/DB-configure";
import { collection, doc, getDoc, getDocs, setDoc, query, deleteDoc } from "firebase/firestore";
import {createUserWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";



function SettingContent(){
    const [profile, setProfile] = useState(false);
    const [addUser, setAddUser] = useState(false)
    const [fullname, setFullName] = useState("");
    const [othername, setOtherName] = useState("");
    const [email, setEmail] = useState("");
    const [position, setPosition] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setIsLoading] = useState(false);
    const { authUser, loadingAuth } = useAuth();
    const [imageUrl, setImageUrl] = useState(profileImage);
    const [userInfo, setUserInfo] = useState([]);
    const [viewAdmins, setViewAdmins] = useState(false)
    const [adminUser, setAdminUser] = useState([])
    const [editView, setEditView] = useState(false)
    const [filteredPagination, setFilteredPagination] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [resetEmail, setResetEmail] = useState("");
    const [resetSuccess, setResetSuccess] = useState("");
    const [resetError, setResetError] = useState("");
    const [resetLoading, setResetLoading] = useState(false);


    const pageLimit = 2

    if(loadingAuth) return <p className="text-3xl font-extrabold font-[mulish] flex items-center justify-between w-full h-screen text-white">Loading Profile....</p>


     const handleSignUp = async (e) => {
        e.preventDefault();

        const trimedEmail = email.trim();
        const trimedPassword = password.trim();
        const trimedName = fullname.trim();
        const trimedOtherName = othername.trim();
        const trimedPosition = position.trim();


        if(!trimedEmail || !trimedPassword || !trimedName || !trimedPosition || !trimedOtherName){
            setErrorMessage("Input are required")
            return;
        }
        setIsLoading(true);
        try{
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, trimedEmail, trimedPassword);
            const newUser = userCredential.user;
        
            await setDoc(doc(db, "admin-users", newUser.uid), {
                uid: newUser.uid,
                fullname: trimedName,
                othername: trimedOtherName,
                email: trimedEmail,
                position: trimedPosition,
                createdAt: new Date().toISOString(),
                profileImage: "",
                role: "Admin",
            });

            setSuccessMessage("Account Created Sucessfully");
            setErrorMessage("");
            setFullName("");
            setOtherName("");
            setPosition("");
            setEmail("");
            setPassword("");

             setTimeout(() => {
                setAddUser(false);
            }, 1000);
        }catch (error){
            setErrorMessage(`Error occured: ${error.message}`)
            setSuccessMessage("");
        } finally {
            setIsLoading(false);
            setSuccessMessage("");
        }
    }
    
    const fetchProfile = async () => {
         if (!authUser) {
            console.warn("No authenticated user");
            return;
        }

        const dbDocRef = doc(db, "admin-users", authUser.uid);
        const docSnap = await getDoc(dbDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setUserInfo(data);
        }
    };

    useEffect(() => {
        const fetchProfileImage = async () => {
            const dbDocRef = doc(db, "users", authUser.uid);
            const docSnap = await getDoc(dbDocRef);
            if(docSnap.exists()) {
                const data = docSnap.data();
                if(data.profileImage){
                    setImageUrl(data.profileImage);
                }
            }
        }
        fetchProfileImage();
    },[authUser])

    useEffect(() => {
        fetchProfile();
    }, [authUser]);


    useEffect(() => {
        setIsLoading(true);
        const fetchAdmins = async () => {
            if(!authUser) return;
            try{
                const dbDocRef = query(collection(db, "admin-users"));
                const docSnap = await getDocs(dbDocRef);
                const data = docSnap.docs.map(doc => ({id: doc.id, ...doc.data()}))
                setAdminUser(data);
                setFilteredPagination(data);
            }catch(error){
                setErrorMessage(`An error occurred when fetch customer: ${error.message}`);
                console.log("Fetch Error:", error.message);
            }finally{
                setIsLoading(false);
            }
        }
        fetchAdmins();
    },[authUser]);

    useEffect(()=>{
        if(searchTerm.trim()){
            const filtered = adminUser.filter((item)=> item.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||  item.othername.toLowerCase().includes(searchTerm.toLowerCase()) || item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||  item.position.toLowerCase().includes(searchTerm.toLowerCase())
        );
            setFilteredPagination(filtered);
            setCurrentPage(1)
        }else{
            setFilteredPagination(adminUser);
        }
    },[searchTerm, addUser])

    const handleDelete = async (id) => {
        if (!authUser) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this Admin?, This action cannot be undone");
        if(!confirmDelete) return;

        try{
            await deleteDoc(doc(db, "admin-users", authUser.uid));
            console.log("Deleted successfully");
            fetchProfile();
        }catch (error){
            console.error("fetch delete error", error.message);
            alert("Failed to delete. Check permissions.");
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        const trimmedName = fullname.trim();
        const trimmedOtherName = othername.trim();
        const trimmedEmail = email.trim();
        const trimmedPosition = position.trim();

        if (!trimmedName || !trimmedOtherName || !trimmedEmail || !trimmedPosition) {
            setErrorMessage("All fields are required.");
            return;
        }

        setIsLoading(true);
        try {
            const userDocRef = doc(db, "admin-users", authUser.uid);
            await setDoc(userDocRef, {
                ...userInfo,
                fullname: trimmedName,
                othername: trimmedOtherName,
                email: trimmedEmail,
                position: trimmedPosition,
            }, { merge: true });

            setSuccessMessage("Profile updated successfully.");
            setErrorMessage("");
            fetchProfile();
            setTimeout(() => {
                setEditView(false);
            }, 1500);
        } catch (error) {
            console.error("Update error:", error.message);
            setErrorMessage(`Failed to update profile: ${error.message}`);
            setSuccessMessage("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResetLoading(true);
        setResetSuccess("");
        setResetError("");

        try {
            await sendPasswordResetEmail(auth, resetEmail.trim());
            setResetSuccess("Password reset email sent successfully.");
            setResetError("");
            setTimeout(() => {
                setResetEmail("");
                setResetSuccess("");
            }, 2000);
        } catch (error) {
            console.error("Password reset error:", error.message);
            setResetError("Failed to send reset email. " + error.message);
            setResetSuccess("");
        } finally {
            setResetLoading(false);
        }
    };

    const paginatedPage = filteredPagination.slice((currentPage - 1) * pageLimit, currentPage * pageLimit)
    const totalPages = Math.ceil(filteredPagination.length / pageLimit);

    return(<>
       <section>
            <div className="flex items-center justify-between mt-6 px-4">
                <div>
                    <h2 className="font-[mulish] text-3xl uppercase font-semibold text-blue-600 tracking-wide">App Settings</h2>
                    <p className="font-[mulish] text-base">Update App Settings and Manage Preferences.</p>
                </div>
            </div>
        </section>

        <section className="w-[95%] h-auto mx-auto my-5 border border-gray-400 rounded-md p-2">
            <div onClick={()=> setProfile(true)} className="border border-gray-400 p-2 cursor-pointer rounded-md hover:bg-[#ffffff] transition-all ease-in-out">
                <p className="font-[mulish] text-lg font-medium tracking-wide text-blue-600">Profile</p>
            </div>

            <div onClick={()=> {
                setFullName(userInfo.fullname || "");
                setOtherName(userInfo.othername || "");
                setEmail(userInfo.email || "");
                setPosition(userInfo.position || "");
                setSuccessMessage("");
                setErrorMessage("");
                setEditView(true);
            }} className="border border-gray-400 p-2 cursor-pointer rounded-md hover:bg-[#ffffff] transition-all ease-in-out mt-2">
                <p className="font-[mulish] text-lg font-medium tracking-wide text-blue-600">Edit Profile</p>
            </div>

            <div onClick={()=> {setAddUser(true);
                    setErrorMessage("");
                    setSuccessMessage("");
                    setFullName("");
                    setOtherName("");
                    setPosition("");
                    setEmail("");
                    setPassword("");
            }} className="border border-gray-400 p-2 cursor-pointer rounded-md hover:bg-[#ffffff] transition-all ease-in-out mt-2">
                <p className="font-[mulish] text-lg font-medium tracking-wide text-blue-600">Add Admin</p>
            </div>

            <div onClick={()=> setViewAdmins(true)} className="border border-gray-400 p-2 cursor-pointer rounded-md hover:bg-[#ffffff] transition-all ease-in-out mt-2">
                <p className="font-[mulish] text-lg font-medium tracking-wide text-blue-600">View Admin Users</p>
            </div>
        </section>

        {profile && (<section className="w-full h-screen fixed top-0 left-0 bg-[#000000c8] z-10 overflow-hidden flex items-center justify-center">
            <div className="bg-[#f3eaea] max-w-[850px] w-full rounded-md relative">
                <div className="sticky top-0 z-30">
                    <IoClose onClick={()=> setProfile(false)}  size={25} className="absolute top-1 cursor-pointer right-1"/>
                    <h2 className="text-2xl text-blue-800 font-bold font-[mulish] tracking-wider text-center bg-white uppercase p-2">My Profile</h2>
                </div>
                {authUser && userInfo && (<section className="overflow-auto max-h-screen">
                    <div className="mt-3 flex items-start gap-16 p-2 profile-flex">
                        <div>
                            <div className="h-[450px] max-w-[350px] w-full profile-image">
                                <img src={imageUrl ? imageUrl : profileImage} alt=""  className="h-full w-full object-cover rounded-2xl"/>
                            </div>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-2xl uppercase font-bold font-[mulish] tracking-wider mb-3 text-red-600">User Details:</h3>
                            <p className="text-blue-700 text-lg font-[mulish] font-bold tracking-wide uppercase mb-2">{userInfo.fullname} {userInfo.othername}</p>
                            <p className="text-blue-700 text-lg font-[mulish] font-bold tracking-wide uppercase mb-2">{userInfo.position}</p>
                              <p className="text-blue-700 text-lg font-[mulish] font-bold tracking-wide uppercase mb-2">{userInfo.role}</p>
                            <p className="text-blue-700  text-lg font-[mulish] font-bold tracking-wide">{userInfo.email}</p>
                        </div>
                    </div>
                </section>)}
            </div>
        </section>)}

        {addUser && (<section className="w-full h-screen fixed top-0 left-0 bg-[#000000c8] z-10 flex items-center justify-center overflow-hidden">
            <div className="bg-[#ffffff] p-2 rounded-md max-w-[500px] w-full max-h-[500px] h-full overflow-y-scroll relative inner-adduser-container">
                <IoClose onClick={()=> {
                    setAddUser(false);
                    setErrorMessage("");
                    setSuccessMessage("");
                    setFullName("");
                    setOtherName("");
                    setPosition("");
                    setEmail("");
                    setPassword("");
                    }}  size={30} className="absolute top-2 cursor-pointer right-2"/>

                <form onSubmit={handleSignUp}>
                    <h2 className="text-xl font-bold text-blue-600 font-[mulish] text-center">Add Admin Users</h2>
                    <p className="text-center font-[mulish] text-lg text-green-600"><strong>NOTE: This user will have access to the dashboard</strong></p>
                    <p className="font-[mulish] font-bold text-lg my-2 text-blue-700">{successMessage}</p>
                    <p className="font-[mulish] font-bold text-lg my-2 text-red-600">{errorMessage}</p>
                    <div className="mt-2 w-full h-auto">
                        <label className="font-[mulish] text-md" htmlFor="fullname">First-Name</label><br />
                        <input className="border border-blue-600 font-[mulish] text-lg capitalize px-2 w-full h-[40px] rounded-md outline-0" type="text" id="fullname" placeholder="Rahman" value={fullname} onChange={(e)=>setFullName(e.target.value)}/>
                    </div>

                    <div className="mt-2 w-full h-auto">
                        <label className="font-[mulish] text-md" htmlFor="othername">Other-Name</label><br />
                        <input className="border border-blue-600 font-[mulish] text-lg capitalize px-2 w-full h-[40px] rounded-md outline-0" type="text" id="othername" placeholder="Lamidi" value={othername} onChange={(e)=>setOtherName(e.target.value)}/>
                    </div>

                    <div className="mt-2 w-full h-auto">
                        <label className="font-[mulish] text-md" htmlFor="email">email</label><br />
                        <input className="border border-blue-600 font-[mulish] text-lg px-2 w-full h-[40px] rounded-md outline-0" type="email" id="email" placeholder="your@gmail.com" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    </div>

                    <div className="mt-2 w-full h-auto">
                        <label className="font-[mulish] text-md" htmlFor="position">Position</label><br />
                        <input className="border border-blue-600 font-[mulish] text-lg capitalize px-2 w-full h-[40px] rounded-md outline-0" type="text" id="position" placeholder="Gen. Secetary" value={position} onChange={(e)=> setPosition(e.target.value)}/>
                    </div>

                    <div className="mt-2 w-full h-auto">
                        <label className="font-[mulish] text-md" htmlFor="password">Password</label><br />
                        <input className="border border-blue-600 font-[mulish] text-lg px-2 w-full h-[40px] rounded-md outline-0" type="password" id="password" placeholder="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                    </div>

                    <div className="mt-3 w-full h-auto">
                        <button type="submit" className="bg-blue-600 w-full h-[40px] rounded-md text-white font-[mulish] text-md cursor-pointer hover:bg-blue-700 transition-all ease-in-out">{loading ? (<p className="flex items-center justify-center gap-3">Loading..Please Wait <svg
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
                        </svg></p>) : (<p>+ Add Users</p>)}</button>
                    </div>
                </form>
            </div>
        </section>)}

        {viewAdmins && (<section className="w-full h-screen fixed top-0 left-0 bg-[#000000c8] z-10 flex items-center justify-center overflow-hidden">
            <div className="bg-[#ffffff] p-2 rounded-md relative max-w-[1200px] w-full h-full overflow-y-scroll inner-view-container">
                <IoClose onClick={()=> {
                   setViewAdmins(false)
                }}  size={30} className="absolute top-2 cursor-pointer right-2"/>

                <div className="mt-4">
                    <h3 className="text-2xl font-bold text-blue-800 font-[mulish] mb-1">Admins users</h3>
                    <p className="text-sm text-gray-600 mb-4 font-[mulish]">Reset password, Delete Admins</p>
                    <div className="border-gray-300 rounded-md shadow-sm flex items-center gap-2 mb-4 min-w-[40%] max-w-md h-[40px]">
                         <button className="border-none h-full text-gray-700 cursor-pointer ml-3">
                            <IoSearchSharp />
                        </button>
                        <input type="search" value={searchTerm}  onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search Service.."  className="w-full  px-4 py-2 border-none focus:outline-none"/>
                        
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
                    <table className="min-w-full divide-y divide-gray-200 bg-white">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <td className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wide">S/N</td>
                                <td className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wide">Name</td>
                                <td className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wide">Email</td>
                                <td className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wide">Position</td>
                                <td className="px-4 py-2 text-left text-sm font-semibold uppercase tracking-wide">Role</td>
                                <td className="px-4 py-2 text-center text-sm font-semibold uppercase tracking-wide">Actions</td>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center px-4 py-4 text-gray-600">Loading Admins...</td></tr>
                            ) : paginatedPage.length === 0 ? (
                                <tr><td colSpan="5" className="text-center px-4 py-4 text-gray-500">No Admins or connection Error.</td></tr>
                            ) : (
                                paginatedPage.map((adminUsers, index) => (
                                <tr key={adminUsers.id} className="hover:bg-gray-50 transition-all">
                                    <td className="px-4 py-2 text-sm text-gray-700">{(currentPage - 1) * pageLimit + index + 1}</td>
                                    <td className="px-4 py-2 text-sm font-medium capitalize text-gray-800">{adminUsers.fullname} {adminUsers.othername}</td>
                                    <td className="px-4 py-2 text-sm text-blue-700">{adminUsers.email}</td>
                                    <td className="px-4 py-2 text-sm capitalize text-gray-700">{adminUsers.position}</td>
                                    <td className="px-4 py-2 text-sm text-green-700">{adminUsers.role}</td>
                                    <td className="px-4 py-2 flex items-center gap-5">
                                        <button onClick={() => handleDelete(adminUsers.id)} className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded-md shadow font-[mulish] transition duration-200 cursor-pointer">Delete</button>
                                        <button onClick={() => setResetEmail(adminUsers.email)} className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-1.5 rounded-md shadow font-[mulish] transition duration-200 cursor-pointer">Reset Password</button>
                                    </td>
                                </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                 </div>
                 
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
            </div>

            
            
        </section>)}
      
        {editView && (<section className="w-full h-screen fixed top-0 left-0 bg-[#000000c8] overflow-hidden z-10 flex items-center justify-center editing-profile-container">
            <div className="bg-[#ffffff] max-w-[500px] w-full max-h-[400px] h-full overflow-y-scroll p-2 rounded-md relative inner-editing-container">
                <IoClose onClick={()=> {
                    setEditView(false);
                    setErrorMessage("");
                    setSuccessMessage("");
                    setFullName("");
                    setOtherName("");
                    setPosition("");
                    setEmail("");
                    setPassword("");
                    }}  size={30} className="absolute top-2 cursor-pointer right-2"/>

                <form onSubmit={handleProfileUpdate}>
                    <h2 className="text-xl font-bold text-blue-600 font-[mulish] text-center">Edit Profile</h2>
                    <p className="font-[mulish] font-bold text-lg my-2 text-blue-700">{successMessage}</p>
                    <p className="font-[mulish] font-bold text-lg my-2 text-red-600">{errorMessage}</p>
                    <div className="mt-2 w-full h-auto">
                        <label className="font-[mulish] text-md" htmlFor="fullname">First-Name</label><br />
                        <input className="border border-blue-600 font-[mulish] text-lg capitalize px-2 w-full h-[40px] rounded-md outline-0" type="text" id="fullname" placeholder="Rahman" value={fullname} onChange={(e)=>setFullName(e.target.value)}/>
                    </div>

                    <div className="mt-2 w-full h-auto">
                        <label className="font-[mulish] text-md" htmlFor="othername">Other-Name</label><br />
                        <input className="border border-blue-600 font-[mulish] text-lg capitalize px-2 w-full h-[40px] rounded-md outline-0" type="text" id="othername" placeholder="Lamidi" value={othername} onChange={(e)=>setOtherName(e.target.value)}/>
                    </div>

                    <div className="mt-2 w-full h-auto">
                        <label className="font-[mulish] text-md" htmlFor="email">email</label><br />
                        <input className="border border-blue-600 font-[mulish] text-lg px-2 w-full h-[40px] rounded-md outline-0" type="email" id="email" placeholder="your@gmail.com" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    </div>

                    <div className="mt-2 w-full h-auto">
                        <label className="font-[mulish] text-md" htmlFor="position">Position</label><br />
                        <input className="border border-blue-600 font-[mulish] text-lg capitalize px-2 w-full h-[40px] rounded-md outline-0" type="text" id="position" placeholder="Gen. Secetary" value={position} onChange={(e)=> setPosition(e.target.value)}/>
                    </div>
                    <div className="mt-3 w-full h-auto">
                        <button type="submit" className="bg-blue-600 w-full h-[40px] rounded-md text-white font-[mulish] text-md cursor-pointer hover:bg-blue-700 transition-all ease-in-out">{loading ? (<p className="flex items-center justify-center gap-3">Loading..Please Wait <svg
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
                        </svg></p>) : (<p>+ Updating profile</p>)}</button>
                    </div>
                </form>
            </div>
        </section>)}

        {resetEmail && (
            <section className="w-full h-screen fixed top-0 left-0 bg-[#000000c8] z-10 flex items-center justify-center">
                <div className="bg-white p-4 rounded-md w-[95%] max-w-md relative">
                    <IoClose
                        onClick={() => {
                        setResetEmail("");
                        setResetError("");
                        setResetSuccess("");
                        }}
                        size={25}
                        className="absolute top-2 right-2 cursor-pointer"
                    />
                    <h2 className="text-xl font-bold text-blue-700 font-[mulish] mb-2 text-center">
                        Reset Admin Password
                    </h2>
                    <p className="text-green-600 text-md text-center font-[mulish] mb-2">{resetSuccess}</p>
                    <p className="text-red-600 text-md text-center font-[mulish] mb-2">{resetError}</p>
                    <form onSubmit={handleResetPassword}>
                        <div className="mt-2">
                        <label className="font-[mulish] text-md" htmlFor="resetEmail">Admin Email</label>
                        <input
                            className="border border-blue-600 font-[mulish] text-lg px-2 w-full h-[40px] rounded-md outline-0 mt-1"
                            type="email"
                            id="resetEmail"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="admin@example.com"
                        />
                        </div>
                        <div className="mt-4">
                        <button
                            type="submit"
                            disabled={resetLoading}
                            className="bg-blue-600 w-full h-[40px] rounded-md text-white font-[mulish] text-md cursor-pointer hover:bg-blue-700 transition-all ease-in-out"
                        >
                            {resetLoading ? (
                            <p className="flex items-center justify-center gap-3">
                                Sending...
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
                            </p>
                            ) : (
                            "Send Reset Link"
                            )}
                        </button>
                        </div>
                    </form>
                </div>
        </section>
        )}
    </>);
}

export default SettingContent;