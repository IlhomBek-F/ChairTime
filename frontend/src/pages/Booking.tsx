import { Button } from "@/components/ui/button";
import { BookUser, ChevronLeftIcon } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";


export function Booking() {
   const navigate = useNavigate();
   const {id} = useParams();
   
   useEffect(() => {
      if(id) {
        // fetch booking data
        console.log("fetching,,,,")
      }
   }, [id])

    return (
        <>
         <Button size="icon" className="size-8 absolute bottom-5" onClick={() => navigate('/')}>
            <ChevronLeftIcon />
        </Button>
        <h1 className="font-bold text-left mb-2 font-mono flex gap-1 items-center"><BookUser size={18}/>Booking</h1>
        </>
    )
}