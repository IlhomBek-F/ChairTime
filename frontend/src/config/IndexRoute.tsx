import { useAuth } from "@/context/Auth";
import { Navigate } from "react-router";
import { PAGE_BY_ROLE } from "./route";
import type { Roles } from "@/core/enums/roles";

export function IndexRoute() {
    const {getUserInfo} = useAuth()
    const {role} = getUserInfo()
    return <Navigate to={PAGE_BY_ROLE[role as Roles]}/>
}