import { MainLayout } from "@/components/ui/layouts/mainLayout";
import { useAuth } from "@/context/Auth";
import type { Roles } from "@/core/enums/roles";
import type { PUBLIC_ROUTES, ROUTE_CONFIGS } from "./route";
import { AuthLayout } from "@/components/ui/layouts/authLayout";

function PrivateRoute({children, roles}: {children: React.ReactNode, roles: Roles[]}) {
    const { isAuthenticated , getUserInfo, logOut} = useAuth();
    const user = getUserInfo()

    if (!isAuthenticated() || !roles.includes(user.role)) {
        logOut()
        return;
    }

    return children
}

export const createProtectedRoute = (config: typeof ROUTE_CONFIGS[number]) => ({
  path: config.path,
  element: (
    <MainLayout>
      <PrivateRoute roles={config.roles}>
        {config.element}
      </PrivateRoute>
    </MainLayout>
  )
});

export const createPublicRoute = (config: typeof PUBLIC_ROUTES[number]) => ({
  path: config.path,
  element: <AuthLayout>{config.element}</AuthLayout>
});
