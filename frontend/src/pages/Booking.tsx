import { Button } from "@/components/ui/button";
import { BookUser, Check, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookingForm } from "@/components/ui/bookingForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMaster } from "@/hooks/useMaster";
import { useMasterStylesOffer } from "@/hooks/useMasterStylesOffer";
import { useAuth } from "@/context/Auth";
import { createBooking, getBookingById, updateBooking } from "@/api/booking";
import { getMasterStyleTypeById } from "@/api/masterStyleType";

type Inputs = {
  master_id: string;
  master_style_type_id: string;
  date: string;
  time: string;
  description?: string;
};

const formSchema = z.object({
  master_id: z.string(),
  master_style_type_id: z.string(),
  date: z.string(),
  time: z.string().min(1),
});

export function Booking() {
  const param = useParams();
  const bookingId = Number(param["id"]);

  const navigate = useNavigate();
  const {getUserInfo} = useAuth();
  const {masters, loading} = useMaster();
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const form = useForm<Inputs>({resolver: zodResolver(formSchema), mode: "onChange"});
  const {styleTypes, loading: loadingStyleTypes} = useMasterStylesOffer(+form.watch("master_id"));
  const [pendingMstStyleTypeId, setPendingMstStyleTypeId] = useState<string>("");

  useEffect(() => {
    if (masters.length && bookingId) {
      getBooking(bookingId)
    }
  }, [bookingId, masters.length])

  useEffect(() => {
     if(styleTypes && pendingMstStyleTypeId) {
       form.setValue("master_style_type_id", String(pendingMstStyleTypeId))
     }
  }, [styleTypes])

  const getBooking = async (id: number) => {
    try {
      const {data} = await getBookingById(id);
      const {data:masterStyleType} = await getMasterStyleTypeById(data.master_style_type_id);
      
      form.setValue("master_id", String(masterStyleType.master_id))
      setPendingMstStyleTypeId(String(masterStyleType.id))
      form.setValue("time", data.time)
      form.setValue("date", data.date)
    } catch (error) {
      console.log("error fetching booking")
    }
  }

  const onSave = ({master_style_type_id, ...rest}: Inputs) => {
    const {id: user_id} = getUserInfo();
    const payload = {user_id: +user_id, master_style_type_id: +master_style_type_id, ...rest};
    createBooking(payload)
    .then(() => {
      setOpenAlertDialog(true);
    }).catch(console.log)
  };

  const onUpdate = ({master_style_type_id, ...rest}: Inputs) => {
    const {id: user_id} = getUserInfo();
    const payload = {id: bookingId, user_id: +user_id, master_style_type_id: +master_style_type_id, ...rest};
    updateBooking(payload)
    .then(() => {
      setOpenAlertDialog(true);
    }).catch(console.log)
  }

  const closeAndNavigateToHomePage = () => {
     setOpenAlertDialog(false)
     navigate("/")
  }

  return (
    <div className="w-full">
      <h1 className="font-bold text-left mb-4 font-mono flex gap-1 items-center">
        <BookUser size={18} /> Booking
      </h1>

      <BookingForm form={form} handleSubmit={form.handleSubmit(bookingId ? onUpdate : onSave)}>
        <BookingForm.Select formControl={form.control} 
                            name="master_id" 
                            optionValue="id"
                            optionLabel="firstname"
                            label="Master"
                            loading={loading}
                            options={masters}/>

        <BookingForm.Select formControl={form.control} 
                            optionLabel="name"
                            optionValue="id"
                            name="master_style_type_id" 
                            label="Style" 
                            loading={loadingStyleTypes}
                            options={styleTypes}/>
        <div className="flex gap-2 w-full">
          <BookingForm.Date formControl={form.control} />
          <BookingForm.Select formControl={form.control} 
                              name="time" 
                              label="Time" 
                              options={["18:00", "19:00"]}/>
        </div>
        <BookingForm.TextArea formControl={form.control} name="description" label="Comment" />
        <Button type="submit" className="w-full">
          <Loader2Icon className="animate-spin" />
          {bookingId ? "update" : "save"}</Button>
      </BookingForm>

      <AlertDialog open={openAlertDialog}>
        <AlertDialogTitle></AlertDialogTitle>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogDescription className="flex flex-col items-center gap-4">
              <span className="size-[50px] rounded-full flex justify-center items-center border-green-400 border-2">
                <Check color="green" />
              </span>
              Your booking has been {bookingId ? "updated" : "accepted"} successfully
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeAndNavigateToHomePage}>
              ok
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
