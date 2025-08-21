import { useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useState } from "react";
import { getToken } from "@/utils/token";

export function Header() {
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState(false);

  const navigateToProfilePage = () => {
    setOpenPopover(false);
    navigate("/profile")
  }

  return (
    <header className="w-full h-14 shadow-sm flex justify-between items-center px-4">
      <h1 className="font-bold" onClick={() => navigate("/")}>MasterM</h1>
      <Popover open={openPopover}>
        <PopoverTrigger>
          <Avatar>
            <AvatarImage src={`http://localhost:8080/api/file/${getToken()}`}  onClick={() => setOpenPopover(!openPopover)}/>
            <AvatarFallback onClick={() => setOpenPopover(!openPopover)}>CN</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] flex flex-col p-1 gap-2 mr-5">
            <Button variant="outline" onClick={navigateToProfilePage}>Profile</Button>
            <Button variant="outline" className="border border-red-400" onClick={() => navigate("/login")}>Log out</Button>
        </PopoverContent>
      </Popover>
    </header>
  );
}
