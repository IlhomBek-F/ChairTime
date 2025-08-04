import { Button } from "@/components/ui/button";
import { BookUser, ChevronLeftIcon } from "lucide-react";
import { useNavigate } from "react-router";

export function Profile() {
  const navigate = useNavigate();

  return (
    <>
     <h1 className="font-bold text-left mb-2 font-mono flex gap-1 items-center"><BookUser size={18}/>Profile</h1>
    <Button variant="default" size="icon" className="absolute bottom-5" onClick={() => navigate('/')}>
        <ChevronLeftIcon />
      </Button>
    </>
  );
}
