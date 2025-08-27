import { useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useState } from "react";
import { getToken } from "@/lib/token";
import { useAuth } from "@/context/Auth";

export function Header() {
  const navigate = useNavigate();
  const { logOut } = useAuth();
  const [openPopover, setOpenPopover] = useState(false);

  const navigateToProfilePage = () => {
    setOpenPopover(false);
    navigate("/profile");
  };

  return (
    <header className="w-full h-16 shadow-md flex justify-between items-center px-6 bg-white">
      <h1
        className="font-bold text-xl text-purple-600 tracking-wide cursor-pointer hover:text-purple-700 transition"
        onClick={() => navigate("/")}
      >
        Master<span className="text-pink-500">M</span>
      </h1>

      {/* User avatar + popover */}
      <Popover open={openPopover}>
        <PopoverTrigger>
          <Avatar className="border-2 border-purple-200 shadow-sm">
            <AvatarImage
              className="cursor-pointer"
              src={`http://localhost:8080/api/file/${getToken()}`}
              onClick={() => setOpenPopover(!openPopover)}
            />
            <AvatarFallback
              className="cursor-pointer bg-purple-100 text-purple-600 font-semibold"
              onClick={() => setOpenPopover(!openPopover)}
            >
              CN
            </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] flex flex-col p-2 gap-2 mr-5 rounded-lg shadow-lg border bg-white">
          <Button
            variant="outline"
            className="cursor-pointer font-medium hover:bg-purple-50"
            onClick={navigateToProfilePage}
          >
            Profile
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer border-red-400 text-red-500 hover:bg-red-50"
            onClick={logOut}
          >
            Log out
          </Button>
        </PopoverContent>
      </Popover>
    </header>
  );
}
