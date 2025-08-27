import { MainLayout } from "@/components/ui/layouts/mainLayout";
import { useAuth } from "@/context/Auth";
import type { Roles } from "@/core/enums/roles";

export function PrivateRoute({children, roles}: {children: React.ReactNode, roles: Roles[]}) {
    const { isAuthenticated , getUserInfo, logOut} = useAuth();
    const user = getUserInfo()

    if (!isAuthenticated() || !roles.includes(user.role)) {
        logOut()
        return;
    }

    return <MainLayout>{children}</MainLayout>
}
