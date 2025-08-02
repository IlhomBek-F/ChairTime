import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Booking() {
  return (
    <div className="w-full h-[87vh]">
      <h1 className="font-bold text-left mb-2 font-mono ">My bookings</h1>
      <ScrollArea className="h-[85%] overflow-hidden">
        {[1, 2, 3, 4].map((key) => {
          return (
            <Card className=" text-left gap-0 mb-4" key={key}>
              <CardHeader className="font-semibold font-mono">
                Master: Makhmudjon
              </CardHeader>
              <CardContent className="flex flex-col">
                <span className=" font-mono">Date: 10.07.2025</span>
                <span className=" font-mono">Time: 13:00</span>
                <span className=" font-mono">Style: Man Style</span>
              </CardContent>
            </Card>
          );
        })}
      </ScrollArea>
      <Button className="absolute w-[95%] left-1/2 transform -translate-x-1/2 bottom-5 max-w-lg">New booking</Button>
    </div>
  );
}
