import { MainLayout } from "@/components/ui/mainLayout";
import { useAuth } from "@/context/Auth";

export function PrivateRoute({children}: {children: React.ReactNode}) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated()) {
        window.location.replace("/login")
    }

    return <MainLayout>{children}</MainLayout>
}
