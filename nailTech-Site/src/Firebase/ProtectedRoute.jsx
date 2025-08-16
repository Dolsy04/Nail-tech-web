import {Navigate} from "react-router-dom";
import {useAuth} from "../Firebase/authContext.jsx";

function ProtectedPage({children}){
    const {authUser, loading} = useAuth();

    if(loading) return <p className="text-3xl font-extrabold font-[mulish] flex items-center justify-between w-full h-screen text-white">Loading......</p>

    if(!authUser){
        return <Navigate to="/"/>
    }

    return children;
}

export default ProtectedPage;