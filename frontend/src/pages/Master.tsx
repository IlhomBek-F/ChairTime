import { getMasterBookings } from "@/api/master";
import { MasterBookingItem } from "@/components/ui/masterBookingItem";
import { MasterBookingSkeleton } from "@/components/ui/masterBookingSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {  MasterBookingType } from "@/core/models/booking";
import { toastError } from "@/lib/utils";
import { BookUser } from "lucide-react";
import { useEffect, useState } from "react";

export function Master() {
  const [bookings, setBookings] = useState<MasterBookingType[]>([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    setLoading(true)
     getMasterBookings(6)
      .then((res) => {
         setBookings(res.data)
      }).catch(toastError)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="relative w-full h-[85vh] flex flex-col bg-gray-50 rounded-2xl shadow-sm p-4">
      <h1 className="font-bold text-xl text-gray-800 mb-3 font-mono flex gap-2 items-center">
        <BookUser size={20} className="text-purple-600" />
        My Bookings
      </h1>

      <ScrollArea className="pr-2 h-[84%]">
        {loading ? <MasterBookingSkeleton /> : bookings.length > 0 ? (
          bookings.map((booking: MasterBookingType) => <MasterBookingItem {...booking} key={booking.id}/>)
        ) : (
          <div className="absolute flex flex-col items-center justify-center h-full text-gray-500 left-1/2 transform -translate-x-1/2">
            <BookUser size={40} className="mb-2 opacity-50" />
            <p className="text-sm">No bookings yet</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
