import { MdDateRange } from "react-icons/md"
import { GoClockFill } from "react-icons/go";
import {useState, useEffect} from "react";
import profileImage from "../../assets/profile-image.png";
import { useAuth } from "../../Firebase/authContext.jsx";
import {db} from "../../Firebase/DB-configure.js";
import { doc, getDoc } from "firebase/firestore";
import UserProfile from "./UserProfile.jsx";
import { MdWavingHand } from "react-icons/md";




function Header(){
    const [time, setTime] = useState(new Date())
    const [openProfile, setOpenProfile] = useState(false)
    const { authUser, loading } = useAuth();
    const [imageUrl, setImageUrl] = useState(profileImage);
    const [userInfo, setUserInfo] = useState([]);


    if(loading) return <p>Loading Profile....</p>

    useEffect(() => {
        const time = setInterval(()=>{
            setTime(new Date());
        }, 1000);

        return ()=> clearInterval(time);
    },[])
    const displayedTime = time.toLocaleTimeString();

    const today = new Date().getDay();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDay = dayNames[today];


    const handleOpenProfile = ()=>{
        setOpenProfile(!openProfile);
    }


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
        fetchProfile();
    }, [authUser]);
    

    return(<>
        <header className="flex items-center justify-between bg-white p-4 sticky top-0 z-10 header-lg">
            <div className="flex items-center gap-[10px]">
                <div className="flex gap-[1px] items-center">
                    <p className="font-semibold text-lg font-[mulish] flex items-center gap-[3px]"><MdDateRange className="text-blue-800" size={25}/>Day & Date:</p>
                    <div>
                        <span className="font-semibold text-lg font-[mulish]">{currentDay}, </span>
                        <span className="font-semibold text-lg font-[mulish]">{String(new Date().getDate()).padStart(2, "0")} / </span>
                        <span className="font-semibold text-lg font-[mulish]">{String(new Date().getUTCMonth() + 1).padStart(2, "0")} / </span>
                        <span className="font-semibold text-lg font-[mulish]">{new Date().getFullYear()}</span>
                    </div>
                </div>
                <div>
                    <p className="font-semibold text-lg font-[mulish] flex items-center gap-[3px]"><GoClockFill className="text-blue-800" size={25}/> Time: {displayedTime}</p>

                </div>
            </div>

            <div className="flex items-start gap-[15px]">
                <div className="flex flex-col items-center">
                    <h3 className="flex items-center gap-2 font-bold font[mulish] text-md text-blue-700 tracking-wide capitalize"> <MdWavingHand />Welcome, {userInfo.othername}</h3>
                    <p className="font-bold font[mulish] text-md text-blue-700 tracking-wide capitalize">{userInfo.role}</p>
                </div>
                <div className="rounded-full border">
                    <img src={imageUrl ? imageUrl : profileImage} alt="profile image" className="cursor-pointer rounded-full w-[50px] h-[50px] object-cover" onClick={handleOpenProfile}/>
                </div>
                
            </div>
            <UserProfile isActive={openProfile} closeProfile={()=> setOpenProfile(false)}/>
        </header>
    </>);
}

export default Header;