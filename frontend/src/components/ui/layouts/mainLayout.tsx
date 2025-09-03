import type { ReactNode } from "react";
import { Header } from "./header";
import { ScrollArea } from "../scroll-area";

export function MainLayout({children}: {children: ReactNode}) {

    return (
        <div className="max-w-lg w-full h-full flex flex-col ">
          <Header></Header>
           <section className="flex flex-1 w-full p-3 border-2 border-b-0 ">
            <div className="relative w-full h-[90vh] flex flex-col bg-gray-50 rounded-2xl shadow-sm p-4">
              <ScrollArea className="h-full pr-3">
                 {children}
              </ScrollArea>
            </div>
           </section>
        </div>
    )
}