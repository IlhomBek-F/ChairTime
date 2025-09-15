import type { ReactNode } from "react";
import { Toaster } from "sonner";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="bg-[url('../../../public/bg-layout-image.png')] bg-cover bg-bottom h-screen w-full flex justify-center items-center">
        <div className="max-w-lg h-full w-full flex flex-col items-center justify-center p-4">
          {children}
        </div>
      </div>
    </>
  );
}
