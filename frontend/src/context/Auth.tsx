import { getToken } from "@/utils/token";
import { createContext, useContext, type ReactNode } from "react";

type AuthContextType = {
    isAuthenticated: () => boolean;
    getUserInfo: () => any
};

const authContext = createContext<AuthContextType>({
    isAuthenticated: () => false,
    getUserInfo: () => {}
});

function AuthProvider({children}: {children: ReactNode}) {
    const isAuthenticated = () => !!getToken();

    const getUserInfo = () => {
        const userInfoStr = localStorage.getItem("user")
        return userInfoStr && JSON.parse(userInfoStr) || {}
    }    


    return <authContext.Provider value={{isAuthenticated, getUserInfo}}>
        {children}
    </authContext.Provider>
}

const useAuth = () => useContext(authContext)

export {AuthProvider, useAuth}