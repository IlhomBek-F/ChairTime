import { Button } from "@/components/ui/button";
import { BookUser, Check } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
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
import { createBooking, getBookingById } from "@/api/booking";

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
  const { id } = useParams();
  const navigate = useNavigate();
  const {getUserInfo} = useAuth();
  const {masters} = useMaster();
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const {styleTypes, getMasterStylesOffer} = useMasterStylesOffer();
  
  const form = useForm<Inputs>({resolver: zodResolver(formSchema), mode: "onChange"});
  const masterId = form.watch("master_id")

  useEffect(() => {
    console.log(id)
    if(masterId) {
      getMasterStylesOffer(+masterId)
    }
  }, [masterId]);

  useLayoutEffect(() => {
     if(id) {
       getBookingById(+id)
        .then(({data}) => {
          setTimeout(() => {
            form.setValue("master_id", "6")
          }, 200)
           form.setValue("time", data.time)
           form.setValue("date", data.date)
        }).catch(console.log)
     }
  }, [id])

  const onSubmit = ({master_style_type_id, ...rest}: Inputs) => {
    const {id: user_id} = getUserInfo();
    
    createBooking({user_id: +user_id, master_style_type_id: +master_style_type_id, ...rest}).
       then(() => {
         setOpenAlertDialog(true);
       }).catch(console.log)
  };

  const closeAndNavigateToHomePage = () => {
     setOpenAlertDialog(false)
     navigate("/")
  }

  return (
    <div className="w-full">
      <h1 className="font-bold text-left mb-4 font-mono flex gap-1 items-center">
        <BookUser size={18} /> Booking
      </h1>

      <BookingForm form={form} handleSubmit={form.handleSubmit(onSubmit)}>
        <BookingForm.Select formControl={form.control} 
                            name="master_id" 
                            optionValue="id"
                            optionLabel="firstname"
                            label="Master" 
                            options={masters}/>

        <BookingForm.Select formControl={form.control} 
                            optionLabel="name"
                            optionValue="id"
                            name="master_style_type_id" 
                            label="Style" 
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
          {/* <Loader2Icon className="animate-spin" /> */}
          Submit</Button>
      </BookingForm>

      <AlertDialog open={openAlertDialog}>
        <AlertDialogTitle></AlertDialogTitle>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogDescription className="flex flex-col items-center gap-4">
              <span className="size-[50px] rounded-full flex justify-center items-center border-green-400 border-2">
                <Check color="green" />
              </span>
              Your booking has been accepted successfully
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
