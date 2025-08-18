import { Card, CardContent, CardHeader } from "./card";
import { Button } from "./button";
import { CalendarDays, Pencil, ShieldUser, Star, Timer, Trash } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import type { BookingViewType } from "@/core/models/booking";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type BookingItemPropsType = BookingViewType & {
  handleDeleteBooking: (id: number) => void
}

export function BookingItem({id, date, time, master, style_type, handleDeleteBooking}: BookingItemPropsType) {
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <Card className=" text-left gap-0 mb-4" key={id}>
      <CardHeader className="font-semibold font-mono flex items-center">
        <ShieldUser size={18}/> Master: {master}
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-mono flex items-center gap-2"><CalendarDays size={18}/> Date: {date.replace("-", ".")}</span>
          <span className="font-mono flex items-center gap-2"><Timer size={18}/> Time: {time}</span>
          <span className="font-mono flex items-center gap-2"><Star size={18}/> Style: {style_type}</span>
        </div>
        <div className="flex flex-col gap-2">
          <Popover open={openPopover}>
            <PopoverTrigger asChild>
              <Button variant="destructive" className="mb-1" onClick={() => setOpenPopover(true)}>
                <Trash />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-2 text-[14px] flex flex-col gap-2 mr-10 z-10 bg-[#faf9f9] border rounded-md">
              <span>Are you sure you want to delete this booking?</span>
              <div className="flex gap-1 justify-end">
                <Button variant="outline" onClick={() => handleDeleteBooking(id)}>Yes</Button>
                <Button variant="outline" onClick={() => setOpenPopover(false)}>No</Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="success" onClick={() => navigate(`/booking/${id}`)}>
            <Pencil />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
