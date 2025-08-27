import { AuthLayout } from "@/components/ui/authLayout";
 import { Booking } from "@/pages/Booking";
import { Login } from "@/pages/Login";
import { UserBookings } from "@/pages/UserBookings";
import { createBrowserRouter } from "react-router";
import { PrivateRoute } from "./PrivateRoute";
import { Profile } from "@/pages/Profile";
import { Master } from "@/pages/Master";
import { Roles } from "@/core/enums/roles";

export const PAGE_BY_ROLE = {
    [Roles.USER]: "/bookings",
    [Roles.MASTER]: "/master",
    [Roles.ADMIN]: "/admin"
}

export const router = createBrowserRouter([
    {  
        index: true,
        path: "bookings",
        element: <PrivateRoute children={<UserBookings />} roles={[Roles.USER]}/>
    },
    {
      path:"master",
      element: <PrivateRoute children={<Master />} roles={[Roles.MASTER]}/>
    },
    {
       path: "booking",
       element: <PrivateRoute children={<Booking />} roles={[Roles.USER]}/>,
       children: [
         {
            path: ":id",
            element: <PrivateRoute children={ <UserBookings />} roles={[Roles.USER]}/>
         },
       ]
    },
    {
        path: "profile",
        element: <PrivateRoute children={<Profile />} roles={[Roles.USER, Roles.ADMIN, Roles.MASTER]}/>
    },
    {
        path: "login",
        element: <AuthLayout><Login /></AuthLayout>       
    }
])