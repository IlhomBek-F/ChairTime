import { deleteBooking, getBooking } from "@/api/booking";
import { BookingItem } from "@/components/ui/bookingItem";
import { BookingSkeleton } from "@/components/ui/bookingSkeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/Auth";
import type { BookingViewType } from "@/core/models/booking";
import { toastError } from "@/lib/utils";
import { BookUser } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function UserBookings() {
  const [bookings, setBookings] = useState<BookingViewType[]>([]);
  const {getUserInfo} = useAuth();
  const {id: userId} = getUserInfo();
  
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  
  const handleDeleteBooking = (id: number) => {
    deleteBooking(id)
     .then(() => getBookings(userId))
     .catch(toastError)
  }

  useEffect(() => {
    getBookings(userId)
  }, [])

  const getBookings = (id: number) => {
    setLoading(true)
    getBooking(id)
     .then(({data}) => {
       setBookings(data)
     }).catch(toastError)
     .finally(() => setLoading(false))
  }

  return (
    <div className="w-full h-[87vh]">
      <h1 className="font-bold text-left mb-2 font-mono flex gap-1 items-center"><BookUser size={18}/> My bookings</h1>
      {<ScrollArea className="h-[85%] overflow-hidden">
        {loading && <BookingSkeleton /> || bookings.map((booking: BookingViewType) => <BookingItem {...booking} key={booking.id} handleDeleteBooking={handleDeleteBooking}/>)}
      </ScrollArea>}
     
      <Button className="absolute w-[95%] cursor-pointer left-1/2 transform -translate-x-1/2 bottom-5 max-w-lg"
              size="icon"
              onClick={() => navigate("booking")}>New booking</Button>
    </div>
  );
}
