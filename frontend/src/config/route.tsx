import { Login } from "@/pages/Login";
import { Bookings } from "@/pages/User/Bookings";
import { createBrowserRouter } from "react-router";
import { createProtectedRoute, createPublicRoute } from "./PrivateRoute";
import { Profile } from "@/pages/Profile";
import { Master } from "@/pages/Master/Master";
import { Roles } from "@/core/enums/roles";
import { IndexRoute } from "./IndexRoute";
import { BookingForm } from "@/pages/User/BookingForm";
import { Setting } from "@/pages/Master/Setting";

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
    element: <BookingForm />,
    roles: [Roles.USER],
    title: "New Booking"
  },
  {
    path: "/booking/edit/:id",
    element: <BookingForm />,
    roles: [Roles.USER],
    title: "Edit Booking"
  },
  {
    path: "/master",
    element: <Master />,
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