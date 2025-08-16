import { getToken } from "@/utils/token";
import { createContext, useContext, type ReactNode } from "react";

type AuthContextType = {
    isAuthenticated: () => boolean;
};

const authContext = createContext<AuthContextType>({
    isAuthenticated: () => false,
});

function AuthProvider({children}: {children: ReactNode}) {
    const isAuthenticated = () => !!getToken()

    return <authContext.Provider value={{isAuthenticated}}>
        {children}
    </authContext.Provider>
}

const useAuth = () => useContext(authContext)

export {AuthProvider, useAuth}