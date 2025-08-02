import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

export function Header() {
  return (
    <header className="w-full h-14 shadow-sm flex justify-between items-center px-4">
      <div>chair time</div>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </header>
  );
}
