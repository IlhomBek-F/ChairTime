import {
  CalendarDays,
  Loader2Icon,
  Pencil,
  Phone,
  Scissors,
  ShieldUser,
  Timer,
  Trash,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import type { BookingViewType } from "@/core/models/booking";
import { Card, CardContent, CardHeader } from "../card";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";

type BookingItemPropsType = BookingViewType & {
  deleteingBookingId: number,
  handleDeleteBooking: (id: number) => void;
};

export function BookingItem({
  id,
  date,
  time,
  phone,
  master,
  style_type,
  deleteingBookingId,
  handleDeleteBooking,
}: BookingItemPropsType) {
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState(false);
  
  return (
    <Card className="w-full p-4 rounded-2xl shadow-lg border border-gray-200 bg-white transition hover:shadow-xl mb-2">
      <CardHeader className="flex items-center gap-2 border-b">
        <ShieldUser size={20} className="text-purple-600" />
        <span className="font-semibold text-lg text-gray-800 overflow-ellipsis whitespace-nowrap overflow-hidden">
          Master: {master}
        </span>
      </CardHeader>

      <CardContent className="flex justify-between items-center">
        {/* Left side info */}
        <div className="flex flex-col gap-2 text-gray-700">
          <div className="flex items-center gap-2 text-gray-700">
          <Phone size={16} className="text-green-500" /> {phone}
        </div>
          <span className="flex items-center gap-2 text-sm">
            <CalendarDays size={18} className="text-pink-500" />
            <span>{date.replaceAll("-", ".")}</span>
          </span>
          <span className="flex items-center gap-2 text-sm">
            <Timer size={18} className="text-blue-500" />
            <span>{time}</span>
          </span>
          <span className="flex items-center gap-2 text-sm">
             <Scissors size={16} className="text-pink-500" /> {style_type}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <Popover open={openPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full shadow-md cursor-pointer"
                onClick={() => setOpenPopover(true)}
              >
                <Trash />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-3 text-sm flex flex-col gap-2 mr-10 z-10 bg-white border rounded-lg shadow-lg">
              <span className="text-gray-700">
                Are you sure you want to delete this booking?
              </span>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => handleDeleteBooking(id)}>
                  {deleteingBookingId === id && <Loader2Icon className="animate-spin mr-2" />}
                  Yes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => setOpenPopover(false)}
                >
                  No
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="success"
            size="icon"
            className="rounded-full shadow-md cursor-pointer"
            onClick={() => navigate(`/booking/edit/${id}`)}
          >
            <Pencil />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
