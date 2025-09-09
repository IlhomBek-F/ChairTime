import { Login } from "@/pages/Login";
import { Bookings } from "@/pages/user/BookingList";
import { createBrowserRouter } from "react-router";
import { createProtectedRoute, createPublicRoute } from "./PrivateRoute";
import { Profile } from "@/pages/Profile";
import { Roles } from "@/core/enums/roles";
import { IndexRoute } from "./IndexRoute";
import { Setting } from "@/pages/master/Setting";
import { Booking } from "@/pages/user/Booking";
import { AddNewStyleType } from "@/pages/admin/AddNewStyleType";
import { MasterSetting } from "@/pages/admin/MasterSetting";
import { Home } from "@/pages/admin/Home";
import { AddNewMaster } from "@/pages/admin/AddNewMaster";
import { MasterBooking } from "@/pages/master/BookingList";

export const PAGE_BY_ROLE = {
    [Roles.USER]: "/bookings",
    [Roles.MASTER]: "/master",
    [Roles.ADMIN]: "/admin"
}

export const ROUTE_CONFIGS = [
  {
    path: "/bookings",
    element: <Bookings />,
    roles: [Roles.USER],
    title: "My Bookings"
  },
  {
    path: "/booking/new",
    element: <Booking />,
    roles: [Roles.USER],
    title: "New Booking"
  },
  {
    path: "/booking/edit/:id",
    element: <Booking />,
    roles: [Roles.USER],
    title: "Edit Booking"
  },
  {
    path: "/master",
    element: <MasterBooking />,
    roles: [Roles.MASTER],
    title: "Master Dashboard"
  },
   {
    path: "/master/setting",
    element: <Setting />,
    roles: [Roles.MASTER],
    title: "Master Dashboard"
  },
  {
    path: "/admin",
    element: <Home />,
    roles: [Roles.ADMIN],
    title: "Admin Dashboard"
  },
  {
    path: "/new-master",
    element: <AddNewMaster />,
    roles: [Roles.ADMIN],
    title: "Add new master"
  },
  {
    path: "/master/setting/:id",
    element: <MasterSetting />,
    roles: [Roles.ADMIN],
    title: "Master setting"
  },
  {
    path: "/style-type/add",
    element: <AddNewStyleType />,
    roles: [Roles.ADMIN],
    title: "Add new style type"
  },
  {
    path: "/style-type/edit/:id",
    element: <AddNewStyleType />,
    roles: [Roles.ADMIN],
    title: "Add new style type"
  },
  {
    path: "/profile",
    element: <Profile />,
    roles: [Roles.USER, Roles.MASTER, Roles.ADMIN],
    title: "Profile"
  }
] as const;

// Public routes (no authentication required)
export const PUBLIC_ROUTES = [
  {
    path: "/login",
    element: <Login />,
    title: "Login"
  },
] as const;

export const router = createBrowserRouter([
    {
      index: true,
      element: <IndexRoute />
    },
    ...ROUTE_CONFIGS.map(createProtectedRoute),
    ...PUBLIC_ROUTES.map(createPublicRoute)
])