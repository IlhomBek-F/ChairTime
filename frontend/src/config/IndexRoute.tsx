import { useAuth } from "@/context/Auth";
import { Navigate } from "react-router";
import { PAGE_BY_ROLE } from "./route";
import type { Roles } from "@/core/enums/roles";

export function IndexRoute() {
    const {getUserInfo, isAuthenticated} = useAuth()
    const {role} = getUserInfo()

    if (!role || !isAuthenticated()) {
        return <Navigate to={'/login'} replace/>
    }

    return <Navigate to={PAGE_BY_ROLE[role as Roles]} replace/>
}