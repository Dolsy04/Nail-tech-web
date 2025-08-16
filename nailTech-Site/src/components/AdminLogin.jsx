import { RiCloseLargeFill } from "react-icons/ri";
import React, {useState} from "react";
import {auth} from "../Firebase/DB-configure.js";
import {signInWithEmailAndPassword} from "firebase/auth";
import { useNavigate } from "react-router-dom";


function AdminLogin({closeComponent, isActive}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setIsLoading] = useState(false);
    const navigate = useNavigate();    

    const handleSignIn = async (e) => {
        e.preventDefault();

        const trimedEmail = email.trim();
        const trimedPassword = password.trim();

        if(!trimedEmail || !trimedPassword){
            setErrorMessage("Input are required")
            return;
        }
        setIsLoading(true);

        try{
            await signInWithEmailAndPassword(auth, trimedEmail, trimedPassword)
            setSuccessMessage("Login Successfull");
            setErrorMessage("");
            setEmail("");
            setPassword("");

            setTimeout(() => {
                closeComponent();
            },1000)

            navigate("/adminboard")
        }catch (err){
            console.log(err.message);
            setErrorMessage("Invalid Email or Password");
            setSuccessMessage("");
        } finally {
            setIsLoading(false);
            setSuccessMessage("");
        }
    } 

    return(<>
        <section className={`w-full h-screen bg-[#161615ba] fixed bottom-0 left-0 z-80 flex items-center justify-center transition-all duration-500 overflow-hidden ${isActive ? "top-0" : "top-full"}`}>
            <div className="w-full lg:max-w-full max-w-[400px] sm:max-w-[400px] bg-white rounded-t-xl h-[85vh] overflow-y-auto absolute bottom-0 pb-8 px-6">
                <RiCloseLargeFill size={35} className="text-black cursor-pointer absolute right-0 mt-2 mr-2" onClick={closeComponent}/>
                <div className="w-full">
                    <h3 className="text-center py-7 font-bold text-blue-800 text-4xl font-[mulish]  tracking-wide">Admin Login</h3>
                    <p className="text-lg text-red-600 text-center font-[mulish]"><strong>NOTE: This page is only for admins</strong></p>

                    {successMessage && <p className="text-green-600 text-center my-4 font-[mulish] font-bold">{successMessage}</p>}
                    {errorMessage && <p className="text-red-600 text-center my-4 font-[mulish] font-bold">{errorMessage}</p>}

                    <form onSubmit={handleSignIn} className="lg:w-3/4 w-full  mx-auto">
                        <div className="flex items-center justify-around flex-col">
                            <div className="w-full lg:w-md h-auto mt-10">
                                <label className="font-[mulish] text-base ml-1">Email</label><br />
                                <input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} className="border-gray-400 border w-full h-[40px] mt-2 px-2 font-[mulish] rounded focus:outline-hidden text-lg text-black"/>
                            </div>
                            <div className="w-full lg:w-md h-auto mt-10">
                                <label className="font-[mulish] text-base ml-1">Password</label><br />
                                <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} className="border-gray-400 border w-full h-[40px] mt-2 px-2 font-[mulish] rounded focus:outline-hidden text-lg text-black"/>
                            </div>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <button className="bg-blue-800 py-3 px-8 cursor-pointer mt-10 rounded-3xl text-lg text-white transition-all duration-700 ease-in-out hover:bg-blue-950" type="submit" disabled={loading}>
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
                                ) : ("Login")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </>);
}

export default AdminLogin;