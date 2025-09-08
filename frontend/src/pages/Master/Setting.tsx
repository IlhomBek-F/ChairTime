import { scheduleMasterUnavailableDays, updateMasterWorkingTime } from "@/api/master";
import { CustomForm } from "@/components/ui/form/bookingForm";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PageTitle } from "@/components/ui/pageTitle";
import { useAuth } from "@/context/Auth";
import { useMasterUnavailableSchedule } from "@/hooks/useMasterUnavailableSchedule";
import { toastError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {  ChevronsUpDown, Loader2Icon, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type Inputs = {
  days_off: any[];
}

const formSchema = z.object({
  days_off: z.array(z.string().optional()),
});

export function Setting() {
  const [workingTime, setWorkingTime] = useState({start_working_time: "08:00", end_working_time: "18:00"})
  const [loading, setLoading] = useState(false)
  const [daysOffLoading, setDaysoffLoading] = useState(false)
  const {getUserInfo} = useAuth()
  const {id} = getUserInfo()
  const { unavailableSchedules} = useMasterUnavailableSchedule(id)
  const form = useForm<Inputs>({
      resolver: zodResolver(formSchema),
      mode: "onChange",
  });

  const saveWorkingTime = () => {
    setLoading(true)
    updateMasterWorkingTime({...workingTime, id: getUserInfo().id})
     .then(() => toast.success("Working time saved"))
     .catch(toastError)
     .finally(() => setLoading(false))
  }

  useEffect(() => {
      if(unavailableSchedules.length) {
        form.setValue("days_off", unavailableSchedules.map(sch => sch.date))
      }
  }, [unavailableSchedules])
  
  

   const onSubmit = ({days_off}: Inputs) => {
       const requests = days_off.map((date: string) => ({day_of_week: 1, start_time: "", end_time: "", date, master_id: id}))
       
       setDaysoffLoading(true)
       scheduleMasterUnavailableDays(requests, id)
       .then(() => {
         toast.success("days off saved successfully")
       }).catch(toastError)
       .finally(() => setDaysoffLoading(false))
    }

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
              value={workingTime.start_working_time}
              onInput={(e: any) => {
                  if (!e.target.value) {
                    setWorkingTime({...workingTime, start_working_time: "08:00"})
                  } else {
                    setWorkingTime({...workingTime, start_working_time: e.target.value})
                  }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm text-left font-medium text-gray-700 mb-2">End Time</label>
            <input 
              type="time" 
              inputMode="text"
              value={workingTime.end_working_time}
              onInput={(e: any) => {
                  if (!e.target.value) {
                    setWorkingTime({...workingTime, end_working_time: "18:00"})
                  } else {
                    setWorkingTime({...workingTime, end_working_time: e.target.value})
                  }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          </div>
            <Button type="submit" className="py-5 
                                             float-right
                                             font-semibold 
                                             bg-gradient-to-r
                                             mb-2   
                                             from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition text-white shadow-lg cursor-pointer"
                                             onClick={saveWorkingTime}
                                             >
                                             {loading && <Loader2Icon className="animate-spin mr-2" />}
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
            <CustomForm form={form} 
                        handleSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-4 items-end"
                        >
               <CustomForm.Date name="days_off" 
                                label="" 
                                mode="multiple"
                                formControl={form.control} 
                                popover={false}></CustomForm.Date>
                                <Button type="submit" disabled={daysOffLoading} className="py-5 
                                             font-semibold
                                             bg-gradient-to-r 
                                             w-max
                                             from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition text-white shadow-lg cursor-pointer"
                                             >
                                             {daysOffLoading && <Loader2Icon className="animate-spin mr-2" />}
                                             Save</Button>
            </CustomForm>
            
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
