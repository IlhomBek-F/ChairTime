import { useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full h-14 shadow-sm flex justify-between items-center px-4">
      <div>chair time</div>
      <Popover>
        <PopoverTrigger>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] flex flex-col p-1 gap-2 mr-5">
            <Button variant="outline" onClick={() => navigate("/profile")}>Profile</Button>
            <Button variant="outline" className="border border-red-400" onClick={() => navigate("/login")}>Log out</Button>
        </PopoverContent>
      </Popover>
    </header>
  );
}
