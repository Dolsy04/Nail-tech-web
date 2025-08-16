import { useEffect, useState } from "react";
import { useAuth } from "../../Firebase/authContext.jsx";
import profileImage from "../../assets/profile-image.png";
import { IoClose } from "react-icons/io5";
import {db} from "../../Firebase/DB-configure.js";
import { doc, getDoc, setDoc } from "firebase/firestore";


function UserProfile({isActive, closeProfile}){
    const { authUser, loading } = useAuth();
    const [imageUrl, setImageUrl] = useState(profileImage);
    const [userInfo, setUserInfo] = useState([]);

    if(loading) return <p className="text-3xl font-extrabold font-[mulish] flex items-center justify-between w-full h-screen text-white">Loading Profile....</p>

    
    // -----------Uploading profile-image---------
    const handleUploadImage = (e) => {
        const file = e.target.files[0];
        if(!file || !authUser) return;

        const reader = new FileReader();
        reader.onload = async () => {
            const base64String = reader.result;
            setImageUrl(base64String);

            const dbDocRef = doc(db, "users", authUser.uid);
            await setDoc(dbDocRef, {profileImage: base64String}, {merge: true});
            alert("Profile picture set successfully");
        }
        reader.readAsDataURL(file);
    }

    // ------------Fetch profile image from DB-----------

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

    // --------------fetch profile data-----------

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
        <section className={`userProfiles top-[80px] z-10 max-w-[350px] w-full  flex items-start justify-end transition-all duration-500 ease-in-out ${isActive ? "isActive" : ""}`}>
            <div className="bg-blue-700 p-6 relative rounded-xl w-full  inner-user-card">
                <IoClose color="white" size={30} className="absolute top-4 right-4 cursor-pointer" onClick={closeProfile}/>
                {authUser && (<>
                    <div className="flex items-center justify-center flex-col">
                        <div className="rounded-full w-[120px] h-[120px]">
                            <img src={imageUrl ? imageUrl : profileImage} alt="" className="w-full h-full rounded-full object-cover"/>
                        </div>
                        <h2 className="my-1 capitalize font-semibold tracking-wider text-md font-[mulish] text-white">{userInfo.fullname} {userInfo.othername}</h2>
                        <p className="text-white text-md fomt-[mulish] tracking-wide">{authUser.email}</p>
                        <p className="text-white capitalize text-md fomt-[mulish] tracking-wide ">{userInfo.position}</p>
                        <p className="text-white capitalize text-md fomt-[mulish] tracking-wide mb-2">{userInfo.role}</p>
                        
                        <input type="file" accept="image/*" id="profileUpload" className="hidden" onChange={handleUploadImage}/>
                         <label
                            htmlFor="profileUpload"
                            className="bg-white px-3 py-2 rounded-md font-[mulish] tracking-wide cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-900 hover:text-white">Upload Profile</label>
                    </div>
                </>)}
            </div>
        </section>
    </>);
}

export default UserProfile;