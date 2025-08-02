import type { ReactNode } from "react";
import { Header } from "./header";


export function MainLayout({children}: {children: ReactNode}) {

    return (
        <div className="max-w-lg h-full w-full flex flex-col">
          <Header></Header>
           <section className="flex flex-1 w-full ">
             {children}
           </section>
          <footer className="bg-pink-400">footer</footer>
        </div>
    )
}