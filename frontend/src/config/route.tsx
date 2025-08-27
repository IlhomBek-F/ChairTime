import { AuthLayout } from "@/components/ui/layouts/authLayout";
import { Login } from "@/pages/Login";
import { Bookings } from "@/pages/Bookings";
import { createBrowserRouter } from "react-router";
import { PrivateRoute } from "./PrivateRoute";
import { Profile } from "@/pages/Profile";
import { Master } from "@/pages/Master";
import { Roles } from "@/core/enums/roles";
import { IndexRoute } from "./IndexRoute";
import { BookingForm } from "@/pages/BookingForm";

export const PAGE_BY_ROLE = {
    [Roles.USER]: "/bookings",
    [Roles.MASTER]: "/master",
    [Roles.ADMIN]: "/admin"
}

export const router = createBrowserRouter([
    {
      index: true,
      element: <IndexRoute />
    },
    {  
        path: "bookings",
        element: <PrivateRoute children={<Bookings />} roles={[Roles.USER]}/>
    },
    {
      path:"master",
      element: <PrivateRoute children={<Master />} roles={[Roles.MASTER]}/>
    },
    {
       path: "booking",
       element: <PrivateRoute children={<BookingForm />} roles={[Roles.USER]}/>,
       children: [
         {
            path: ":id",
            element: <PrivateRoute children={ <Bookings />} roles={[Roles.USER]}/>
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