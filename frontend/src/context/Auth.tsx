import { clearToken, getToken } from "@/lib/token";
import { createContext, useContext, type ReactNode } from "react";
import { Toaster } from "sonner";

type AuthContextType = {
    isAuthenticated: () => boolean;
    getUserInfo: () => any
    logOut: VoidFunction
};

const authContext = createContext<AuthContextType>({
    isAuthenticated: () => false,
    getUserInfo: () => {},
    logOut: () => {}
});

function AuthProvider({children}: {children: ReactNode}) {
    const isAuthenticated = () => !!getToken();

    const getUserInfo = () => {
        const userInfoStr = localStorage.getItem("user")
        return userInfoStr && JSON.parse(userInfoStr) || {}
    }    
    
    const logOut = () => {
        clearToken()
        localStorage.removeItem("user")
        window.location.replace("/login")
    }

    return <authContext.Provider value={{isAuthenticated, getUserInfo, logOut}}>
        {children}
        <Toaster position="top-center" theme="system" toastOptions={{
            classNames: {
            error: "!bg-red-200 text-red-800"
        }}}/>
    </authContext.Provider>
}

const useAuth = () => useContext(authContext)

export {AuthProvider, useAuth}