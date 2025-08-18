import { deleteBooking, getBooking } from "@/api/booking";
import { BookingItem } from "@/components/ui/bookingItem";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { BookingViewType } from "@/core/models/booking";
import { BookUser } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function UserBookings() {
  const [bookings, setBookings] = useState<BookingViewType[]>([]);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  
  const handleDeleteBooking = (id: number) => {
    deleteBooking(id)
     .then(() => getBookings(2))
     .catch(() => console.log("error deleted"))
  }

  useEffect(() => {
    getBookings(2)
  }, [])

  const getBookings = (id: number) => {
    setLoading(true)
    getBooking(id)
     .then(({data}) => {
       setBookings(data)
     }).catch(console.log)
     .finally(() => setLoading(false))
  }

  return (
    <div className="w-full h-[87vh]">
      <h1 className="font-bold text-left mb-2 font-mono flex gap-1 items-center"><BookUser size={18}/> My bookings</h1>
      {loading && <div>
              <Skeleton className="h-[160px]  rounded-xl bg-[#e8e8e8]">
                 <div className="p-6">
                   <Skeleton className="h-[20px] mb-3 w-[240px] rounded-md bg-[#cacaca]"/>
                   <Skeleton className="h-[18px] mb-3 w-[200px] rounded-md bg-[#cacaca]"/>
                   <Skeleton className="h-[18px] mb-3 w-[160px] rounded-md bg-[#cacaca]"/>
                   <Skeleton className="h-[18px] w-[140px]  rounded-md bg-[#cacaca]"/>
                 </div>
              </Skeleton>
        </div>}
      <ScrollArea className="h-[85%] overflow-hidden">
        {bookings.map((booking: BookingViewType) => <BookingItem {...booking} key={booking.id} handleDeleteBooking={handleDeleteBooking}/>)}
      </ScrollArea>
      <Button className="absolute w-[95%] left-1/2 transform -translate-x-1/2 bottom-5 max-w-lg"
              size="icon"
              onClick={() => navigate("booking")}>New booking</Button>
    </div>
  );
}
