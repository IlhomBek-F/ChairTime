import App from "@/App";
import { AuthLayout } from "@/components/ui/authLayout";
import { Login } from "@/pages/Login";
import { createBrowserRouter } from "react-router";


export const router = createBrowserRouter([
    {  
        index: true,
        element: <App />
    },
    {
        path: "login",
        element: <AuthLayout><Login /></AuthLayout>       
    }
])