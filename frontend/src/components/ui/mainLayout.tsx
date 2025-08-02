import type { ReactNode } from "react";
import { Header } from "./header";


export function MainLayout({children}: {children: ReactNode}) {

    return (
        <div className="max-w-lg w-full flex flex-col">
          <Header></Header>
           <section className="flex flex-1 w-full p-3">
             {children}
           </section>
        </div>
    )
}