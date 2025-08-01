import type { ReactNode } from "react";

export function AuthLayout({children}: {children: ReactNode}) {

    return (
        <div className="bg-[url('../../../public/bg-layout-image.png')] bg-cover bg-center h-screen w-full flex justify-center items-center">
            {children}
        </div>
    )
}