import logo from "../../../public/favicon.png";
import profileImage from "../../assets/profile-image.png";
import { useAuth } from "../../Firebase/authContext.jsx";
import {db} from "../../Firebase/DB-configure.js";
import { doc, getDoc } from "firebase/firestore";
import {useState, useEffect} from "react";
import UserProfile from "./UserProfile.jsx";

function ResponsiveHeader(){
    const [openProfile, setOpenProfile] = useState(false)
    const { authUser, loading } = useAuth();
    const [imageUrl, setImageUrl] = useState(profileImage);

    if(loading) return <p>Loading Profile....</p>
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

    const handleOpenProfile = ()=>{
        setOpenProfile(!openProfile);
    }

    return(<>
        <header className="res-header bg-white flex items-center justify-between p-3">
            <div className="logo flex items-center gap-2">
                <img src={logo} alt="NT-HUB Logo" width={30} height={30} />
                <h3 className="font-bold font-[mulish] text-2xl text-blue-700">NT-HUB</h3>
            </div>
            
            <div>
                <img src={imageUrl ? imageUrl : profileImage} alt="profile image" className="cursor-pointer rounded-full w-[50px] h-[50px] object-cover" onClick={handleOpenProfile}/>
            </div>
        </header>
        <UserProfile isActive={openProfile} closeProfile={()=> setOpenProfile(false)}/>
    </>)
}

export default ResponsiveHeader;