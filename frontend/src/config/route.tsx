import App from "@/App";
import { AuthLayout } from "@/components/ui/authLayout";
import { MainLayout } from "@/components/ui/mainLayout";
import { Login } from "@/pages/Login";
import { createBrowserRouter } from "react-router";


export const router = createBrowserRouter([
    {  
        index: true,
        element: <MainLayout><App /></MainLayout>
    },
    {
        path: "login",
        element: <AuthLayout><Login /></AuthLayout>       
    }
])