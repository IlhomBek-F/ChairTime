import { PageTitle } from "@/components/ui/pageTitle";
import { Scissors } from "lucide-react";


export function AddNewStyleType() {

    return (
        <PageTitle title="Add new style type" icon={<Scissors className="text-purple-600"/>}/>
    )
}