import {createContext, useContext, useEffect, useState} from "react"
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./DB-configure.js";

const AuthContext = createContext();

export function AuthProvider({children}){
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const notLoggedIn = onAuthStateChanged(auth, (user)=>{
            setAuthUser(user);
            setLoading(false);
        });

        return ()=> notLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{authUser, loading,}}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    const context = useContext(AuthContext);
    return context;
}