import { getToken } from "@/utils/token";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AuthContextType = {
    isAuthenticated: () => boolean;
    userInfo: any
};

const authContext = createContext<AuthContextType>({
    isAuthenticated: () => false,
    userInfo: {}
});

function AuthProvider({children}: {children: ReactNode}) {
    const [userInfo, setUserInfo] = useState();
    const isAuthenticated = () => !!getToken();

    useEffect(() => {
       const userInfoStr = localStorage.getItem("user");
       if(userInfoStr) {
         setUserInfo(JSON.parse(userInfoStr))
       }
    }, [])


    return <authContext.Provider value={{isAuthenticated, userInfo}}>
        {children}
    </authContext.Provider>
}

const useAuth = () => useContext(authContext)

export {AuthProvider, useAuth}