import { AuthLayout } from "@/components/ui/authLayout";
import { MainLayout } from "@/components/ui/mainLayout";
import { Booking } from "@/pages/Booking";
import { Login } from "@/pages/Login";
import { Profile } from "@/pages/Profile";
import { createBrowserRouter } from "react-router";


export const router = createBrowserRouter([
    {  
        index: true,
        element: <MainLayout><Booking /></MainLayout>
    },
    {
        path: "profile",
        element: <MainLayout><Profile /></MainLayout>
    },
    {
        path: "login",
        element: <AuthLayout><Login /></AuthLayout>       
    }
])