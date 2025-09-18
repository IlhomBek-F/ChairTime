import type { AuthResType } from "@/core/models/auth";
import { clearToken, getToken, TokenTypeEnum } from "@/lib/token";
import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { Toaster } from "sonner";

type AuthContextType = {
  isAuthenticated: () => boolean;
  getUserInfo: () => AuthResType;
  logOut: VoidFunction;
};

const authContext = createContext<AuthContextType>({} as AuthContextType);

function AuthProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = () => !!getToken(TokenTypeEnum.ACCESS_TOKEN);

  const getUserInfo = () => {
    const userInfoStr = localStorage.getItem("user");
    return (userInfoStr && JSON.parse(userInfoStr)) || {};
  };

  const logOut = () => {
    clearToken();
    localStorage.removeItem("user");
  };

  return (
    <authContext.Provider value={{ isAuthenticated, getUserInfo, logOut }}>
      {children}
      <Toaster
        position="top-center"
        theme="light"
        toastOptions={{
          duration: 3000, // auto close after 3s
          className: "rounded-xl shadow-lg font-medium px-4 py-3",
          classNames: {
            success: "!bg-green-100 !text-green-800 border border-green-300",
            error: "!bg-red-100 !text-red-800 border border-red-300",
            info: "!bg-blue-100 !text-blue-800 border border-blue-300",
          },
        }}
      />
    </authContext.Provider>
  );
}

const useAuth = () => useContext(authContext);

export { AuthProvider, useAuth };
