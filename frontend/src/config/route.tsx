import { AuthLayout } from "@/components/ui/authLayout";
 import { Booking } from "@/pages/Booking";
import { Login } from "@/pages/Login";
import { UserBookings } from "@/pages/UserBookings";
import { createBrowserRouter } from "react-router";
import { PrivateRoute } from "./PrivateRoute";
import { Profile } from "@/pages/Profile";


export const router = createBrowserRouter([
    {  
        index: true,
        element: <PrivateRoute children={<UserBookings />}/>
    },
    {
       path: "booking",
       element: <PrivateRoute children={<Booking />} />
    },
    {
        path: "booking/:id",
        element: <PrivateRoute children={ <UserBookings />}/>
    },
    {
        path: "profile",
        element: <PrivateRoute children={<Profile />}/>
    },
    {
        path: "login",
        element: <AuthLayout><Login /></AuthLayout>       
    }
])