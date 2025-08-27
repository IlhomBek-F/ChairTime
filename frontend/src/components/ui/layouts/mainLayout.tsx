import type { ReactNode } from "react";
import { Header } from "../header";


export function MainLayout({children}: {children: ReactNode}) {

    return (
        <div className="max-w-lg w-full h-full flex flex-col">
          <Header></Header>
           <section className="flex flex-1 w-full p-3 border-2 border-b-0">
             {children}
           </section>
        </div>
    )
}