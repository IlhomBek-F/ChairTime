import { BookingItem } from "@/components/ui/bookingItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookUser } from "lucide-react";
import { useNavigate } from "react-router";

export function UserBookings() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[87vh]">
      <h1 className="font-bold text-left mb-2 font-mono flex gap-1 items-center"><BookUser size={18}/> My bookings</h1>
      <ScrollArea className="h-[85%] overflow-hidden">
        {[1, 2, 3, 4].map((key) => <BookingItem key={key}/>)}
      </ScrollArea>
      <Button className="absolute w-[95%] left-1/2 transform -translate-x-1/2 bottom-5 max-w-lg"
              size="icon"
              onClick={() => navigate("booking")}>
        New booking
      </Button>
    </div>
  );
}
