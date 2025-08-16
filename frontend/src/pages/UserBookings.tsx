import { getBooking } from "@/api/booking";
import { BookingItem } from "@/components/ui/bookingItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BookingViewType } from "@/core/models/booking";
import { BookUser } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function UserBookings() {
  const [bookings, setBookings] = useState<BookingViewType[]>([])
  const navigate = useNavigate();
  
  useEffect(() => {
    getBooking(2)
     .then(({data}) => {
       setBookings(data)
     }).catch(console.log)
  }, [])

  return (
    <div className="w-full h-[87vh]">
      <h1 className="font-bold text-left mb-2 font-mono flex gap-1 items-center"><BookUser size={18}/> My bookings</h1>
      <ScrollArea className="h-[85%] overflow-hidden">
        {bookings.map((booking: BookingViewType) => <BookingItem {...booking} key={booking.id}/>)}
      </ScrollArea>
      <Button className="absolute w-[95%] left-1/2 transform -translate-x-1/2 bottom-5 max-w-lg"
              size="icon"
              onClick={() => navigate("booking")}>New booking</Button>
    </div>
  );
}
