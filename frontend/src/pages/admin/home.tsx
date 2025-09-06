import { PageTitle } from "@/components/ui/pageTitle";
import { UserStar } from "lucide-react";

export function Home() {

    return (
       <>
          <PageTitle title="Admin" icon={ <UserStar size={20} className="text-purple-600" />}/>
       </>
    )
}