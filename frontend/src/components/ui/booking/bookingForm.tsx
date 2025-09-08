import { CustomForm } from "../form/bookingForm";
import { Button } from "../button";
import { Loader2Icon } from "lucide-react";
import { useMasterUnavailableSchedule } from "@/hooks/useMasterUnavailableSchedule";
import { useMasterAvailableTimeSlots } from "@/hooks/useMasterAvailableTimeSlots";
import { useMaster } from "@/hooks/useMaster";
import { useEffect, useState } from "react";
import type { UpdateBookingType } from "@/core/models/booking";
import { getMasterStyleTypeById } from "@/api/masterStyleType";
import { getBookingById } from "@/api/booking";
import { useMasterStylesOffer } from "@/hooks/useMasterStylesOffer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";

type BookingFormPropsType = {
    onSubmit: (inputValues: any, booking?: UpdateBookingType) => void,
    bookingId: number,
    upsertLoading: boolean
}

export type Inputs = {
  master_id: number;
  master_style_type_id: number;
  date: string;
  time: string;
  description?: string;
};

const formSchema = z.object({
  master_id: z.number(),
  master_style_type_id: z.number(),
  date: z.string(),
  time: z.string().min(1),
  description: z.string().optional()
});

export function BookingForm({onSubmit, bookingId, upsertLoading}: BookingFormPropsType) {
    const { masters, loadingMaster } = useMaster();
    const [booking, setBooking] = useState<UpdateBookingType>();
    const [loadingBookingInfo, setLoadingBookingInfo] = useState(false);
    
    const form = useForm<Inputs>({resolver: zodResolver(formSchema), mode: "onChange"});
    const masterIdValueChange = form.watch("master_id");
    const dateValueChange = form.watch("date");

    const { dateMathcer, loading: loadingMasterSchedule } = useMasterUnavailableSchedule(masterIdValueChange);
    const { timeSlots, loading: loadingTimeSlots } = useMasterAvailableTimeSlots(masterIdValueChange, dateValueChange);
    const { styleTypes, loading: loadingStyleTypes } = useMasterStylesOffer(masterIdValueChange);
      
    useEffect(() => {
      if (masters.length && bookingId) {
          getBooking(bookingId);
      }
    }, [bookingId, masters]);
    
    useEffect(() => {
      if (styleTypes && booking) {
          form.setValue("master_style_type_id", booking.master_style_type_id);
      }
    }, [styleTypes]);
    
    const getBooking = async (id: number) => {
      setLoadingBookingInfo(true);
      try {
          const { data: {time, date, master_style_type_id, description, ...rest} } = await getBookingById(id);
          const { data: masterStyleType } = await getMasterStyleTypeById(master_style_type_id);
    
          setBooking({time, date, master_style_type_id, description, ...rest});
          
          form.setValue("master_id", masterStyleType.master_id);
          form.setValue("time", time);
          form.setValue("date", date);
          form.setValue("description", description);
        } catch (error: any) {
          toast.error(error.message);
        } finally {
          setLoadingBookingInfo(false);
      }
    };
 
    return (
        <CustomForm
        form={form}
        handleSubmit={form.handleSubmit((values: Inputs) => onSubmit(values, booking))}
        className="flex flex-col gap-4"
      >
        {/* Master */}
        <CustomForm.Select
          formControl={form.control}
          name="master_id"
          optionValue="id"
          type="number"
          optionLabel="username"
          label="Master"
          loading={loadingMaster || loadingBookingInfo}
          options={masters}
        />

        {/* Style */}
        <CustomForm.Select
          formControl={form.control}
          optionLabel="name"
          optionValue="id"
          name="master_style_type_id"
          label="Style"
          type="number"
          loading={loadingStyleTypes}
          options={styleTypes}
        />

        {/* Date + Time */}
        <div className="flex gap-3 w-full">
          <CustomForm.Date
            formControl={form.control}
            label="Date"
            name="date"
            mode="single"
            popover={true}
            loading={loadingMasterSchedule}
            matcher={dateMathcer}
          />
          <CustomForm.Select
            formControl={form.control}
            name="time"
            label="Time"
            loading={loadingTimeSlots}
            options={timeSlots}
          />
        </div>

        <CustomForm.TextArea
          formControl={form.control}
          name="description"
          label="Comment"
          placeholder="Add any special requests..."
        />

        <Button
          type="submit"
          className="w-full py-5 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition text-white shadow-lg cursor-pointer"
        >
          {upsertLoading && <Loader2Icon className="animate-spin mr-2" />}
          {bookingId ? upsertLoading ? "Updating..." : "Update" : upsertLoading ? "Saving...": "Save"}
        </Button>
      </CustomForm>
    )
}