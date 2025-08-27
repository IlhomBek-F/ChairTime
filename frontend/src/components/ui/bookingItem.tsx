import { Card, CardContent, CardHeader } from "./card";
import { Button } from "./button";
import {
  CalendarDays,
  Loader2Icon,
  Pencil,
  ShieldUser,
  Star,
  Timer,
  Trash,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import type { BookingViewType } from "@/core/models/booking";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type BookingItemPropsType = BookingViewType & {
  deleteingBookingId: number,
  handleDeleteBooking: (id: number) => void;
};

export function BookingItem({
  id,
  date,
  time,
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
        <span className="font-semibold text-lg text-gray-800">
          Master: {master}
        </span>
      </CardHeader>

      <CardContent className="flex justify-between items-center">
        {/* Left side info */}
        <div className="flex flex-col gap-2 text-gray-700">
          <span className="flex items-center gap-2 text-sm">
            <CalendarDays size={18} className="text-pink-500" />
            <span>{date.replaceAll("-", ".")}</span>
          </span>
          <span className="flex items-center gap-2 text-sm">
            <Timer size={18} className="text-blue-500" />
            <span>{time}</span>
          </span>
          <span className="flex items-center gap-2 text-sm">
            <Star size={18} className="text-yellow-500" />
            <span>{style_type}</span>
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <Popover open={openPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full shadow-md"
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
                  onClick={() => handleDeleteBooking(id)}>
                  {deleteingBookingId === id && <Loader2Icon className="animate-spin mr-2" />}
                  Yes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
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
            className="rounded-full shadow-md"
            onClick={() => navigate(`/booking/${id}`)}
          >
            <Pencil />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
