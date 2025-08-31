import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PageTitle } from "@/components/ui/pageTitle";
import {  ChevronsUpDown, PhoneOff, Settings } from "lucide-react";

export function Setting() {
  return (
    <>
      <PageTitle
        title="Setting"
        icon={<Settings size={20} className="text-purple-600" />}
      />
      <Collapsible className="border-t pt-4 flex w-full flex-col gap-3" open>
        <div className="flex items-center justify-between gap-4">
          <h4 className=" font-semibold text-gray-800">Working hours</h4>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 cursor-pointer hover:bg-red-50"
            >
              <ChevronsUpDown />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent >
            <div className="flex w-full gap-4 mb-4">
          <div className="w-full">
            <label className="block text-sm text-left font-medium text-gray-700 mb-2">Start Time</label>
            <input 
              type="time" 
              defaultValue="09:00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm text-left font-medium text-gray-700 mb-2">End Time</label>
            <input 
              type="time" 
              defaultValue="18:00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          </div>
            <Button type="submit" className="py-5 
                                             float-right
                                             font-semibold 
                                             bg-gradient-to-r
                                             mb-2   
                                             from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition text-white shadow-lg cursor-pointer">
                                             Save</Button>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible className="border-t pt-4 flex w-full flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-[15px] font-semibold text-gray-800">Days off</h4>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 cursor-pointer hover:bg-red-50"
            >
              <ChevronsUpDown />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="flex flex-col gap-2 min-h-52 ">
          <p className="text-black text-[13px] ">
            Add dates when you won't be available for bookings
          </p>
          <div className="border-2  rounded-md border-dashed flex flex-col items-center justify-center h-full text-gray-500 ">
            <PhoneOff size={40} className="mb-2 opacity-50" />
            <p className="text-sm mb-3">No days off yet</p>
            <Button type="submit" className="py-5 
                                             font-semibold 
                                             bg-gradient-to-r 
                                             from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition text-white shadow-lg cursor-pointer">
                                             Schedule days off</Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
