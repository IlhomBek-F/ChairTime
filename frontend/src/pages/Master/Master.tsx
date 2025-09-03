import { getMasterBookings } from "@/api/master";
import { MasterBookingItem } from "@/components/ui/booking/masterBookingItem";
import { MasterBookingSkeleton } from "@/components/ui/booking/masterBookingSkeleton";
import { PageTitle } from "@/components/ui/pageTitle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/Auth";
import type {  MasterBookingType } from "@/core/models/booking";
import { toastError } from "@/lib/utils";
import { BookUser } from "lucide-react";
import { useEffect, useState } from "react";

export function Master() {
  const [bookings, setBookings] = useState<MasterBookingType[]>([]);
  const {getUserInfo} = useAuth();
  const {id} = getUserInfo()
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    setLoading(true)
     getMasterBookings(id)
      .then((res) => {
         setBookings(res.data)
      }).catch(toastError)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageTitle title="My Bookings" icon={ <BookUser size={20} className="text-purple-600" />}/>
        {loading ? <MasterBookingSkeleton /> : bookings.length > 0 ? (
          bookings.map((booking: MasterBookingType) => <MasterBookingItem {...booking} key={booking.id}/>)
        ) : (
          <div className="absolute flex flex-col items-center justify-center h-full text-gray-500 left-1/2 transform -translate-x-1/2">
            <BookUser size={40} className="mb-2 opacity-50" />
            <p className="text-sm">No bookings yet</p>
          </div>
        )}
    </>
  );
}
