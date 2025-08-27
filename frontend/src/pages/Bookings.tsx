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
import { toast } from "sonner";

export function Bookings() {
  const [bookings, setBookings] = useState<BookingViewType[]>([]);
  const { getUserInfo } = useAuth();
  const { id: userId } = getUserInfo();
  const [loading, setLoading] = useState(false);
  const [deleteingBookingId, setDeletingBookingId] = useState(-1)

  const navigate = useNavigate();

  const handleDeleteBooking = (id: number) => {
    setDeletingBookingId(id)
    deleteBooking(id)
      .then(() => {
        toast.success("Booking deleted");
        getBookings(userId);
      })
      .catch(toastError)
      .finally(() => setDeletingBookingId(-1))
  };

  useEffect(() => {
    getBookings(userId);
  }, []);

  const getBookings = (id: number) => {
    setLoading(true);
    getBooking(id)
      .then(({ data }) => {
        setBookings(data);
      })
      .catch(toastError)
      .finally(() => setLoading(false));
  };

  return (
    <div className="relative w-full h-[90vh] flex flex-col bg-gray-50 rounded-2xl shadow-sm p-4">
      <h1 className="font-bold text-xl text-gray-800 mb-3 font-mono flex gap-2 items-center">
        <BookUser size={20} className="text-purple-600" />
        My Bookings
      </h1>

      <ScrollArea className="pr-2 h-[84%]">
        {loading ? <BookingSkeleton /> : bookings.length > 0 ? (
          bookings.map((booking: BookingViewType) => (
            <BookingItem
              {...booking}
              key={booking.id}
              deleteingBookingId={deleteingBookingId}
              handleDeleteBooking={handleDeleteBooking}
            />
          ))
        ) : (
          <div className="absolute flex flex-col items-center justify-center h-full text-gray-500 left-1/2 transform -translate-x-1/2">
            <BookUser size={40} className="mb-2 opacity-50" />
            <p className="text-sm">No bookings yet</p>
          </div>
        )}
      </ScrollArea>

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[95%] max-w-lg">
        <Button
          className="w-full py-5 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition text-white shadow-lg cursor-pointer"
          onClick={() => navigate("/booking")}
        >+ New Booking</Button>
      </div>
    </div>
  );
}
