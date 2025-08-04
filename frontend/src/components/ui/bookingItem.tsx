import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Card, CardContent, CardHeader } from "./card";
import { Button } from "./button";
import { CalendarDays, Pencil, ShieldUser, Star, Timer, Trash } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

export function BookingItem({key}: {key: number}) {
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <Card className=" text-left gap-0 mb-4" key={key}>
      <CardHeader className="font-semibold font-mono flex items-center">
        <ShieldUser size={18}/> Master: Makhmudjon
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-mono flex items-center gap-2"><CalendarDays size={18}/> Date: 10.07.2025</span>
          <span className="font-mono flex items-center gap-2"><Timer size={18}/> Time: 13:00</span>
          <span className="font-mono flex items-center gap-2"><Star size={18}/> Style: Man Style</span>
        </div>
        <div className="flex flex-col gap-2">
          <Popover open={openPopover}>
            <PopoverTrigger>
              <Button variant="destructive" className="mb-1" onClick={() => setOpenPopover(true)}>
                <Trash />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-2 text-[14px] flex flex-col gap-2 mr-10 z-10 bg-[#faf9f9] border rounded-md">
              <span>Are you sure you want to delete this booking?</span>
              <div className="flex gap-1 justify-end">
                <Button variant="outline">Yes</Button>
                <Button variant="outline" onClick={() => setOpenPopover(false)}>No</Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="success" onClick={() => navigate(`booking/${key}`)}>
            <Pencil />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
