import { useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { useState } from "react";
import { getToken, TokenTypeEnum } from "@/lib/token";
import { useAuth } from "@/context/Auth";
import { Roles } from "@/core/enums/roles";

export function Header() {
  const navigate = useNavigate();
  const { logOut, getUserInfo } = useAuth();
  const {role} = getUserInfo()

  const [openPopover, setOpenPopover] = useState(false);

  const navigateTo = (path: string) => {
    setOpenPopover(false);
    navigate(path);
  };

  return (
    <header className="w-full h-[50px] shadow-md flex justify-between items-center px-6 bg-white">
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
              src={`http://localhost:8080/api/file/${getToken(TokenTypeEnum.ACCESS_TOKEN)}`}
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
            onClick={() => navigateTo("/profile")}
          >
            Profile
          </Button>
          {role === Roles.MASTER && <Button
            variant="outline"
            className="cursor-pointer font-medium hover:bg-purple-50"
            onClick={() => navigateTo("/master/setting")}
          >
            Setting
          </Button>}
          <Button
            variant="outline"
            className="cursor-pointer border-red-400 text-red-500 hover:bg-red-50"
            onClick={() => {
              logOut()
              navigate("/login")
            }}
          >
            Log out
          </Button>
        </PopoverContent>
      </Popover>
    </header>
  );
}
