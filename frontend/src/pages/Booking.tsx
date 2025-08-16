import { Button } from "@/components/ui/button";
import { BookUser, Check } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { useMaster } from "@/hooks/useMaster";
import { useMasterStylesOffer } from "@/hooks/useMasterStylesOffer";
import type { MasterType } from "@/core/models/master";
import type { StyleType } from "@/core/models/styleType";

type Inputs = {
  username: string;
  phone: string;
  master: string;
  style: string;
  date: Date;
  time: string;
  description?: string;
};

const formSchema = z.object({
  username: z.string().min(3),
  phone: z.string().min(8).max(10),
  master: z.string().min(1),
  style: z.string().min(1),
  date: z.date(),
  time: z.string().min(1),
});

export function Booking() {
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const {masters} = useMaster();
  const {styleTypes, getMasterStylesOffer} = useMasterStylesOffer();

  const navigate = useNavigate();
  const { id } = useParams();

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "Arslan",
      phone: "1234567890",
    },
    mode: "onChange",
  });

  const masterId = form.watch("master")

  useEffect(() => {
    if(masterId) {
      getMasterStylesOffer(+masterId)
    }
  }, [masterId]);

  const onSubmit = (data: any) => {
    setOpenAlertDialog(true);
    console.log(data);
  };


  return (
    <div className="w-full">
      <h1 className="font-bold text-left mb-4 font-mono flex gap-1 items-center">
        <BookUser size={18} /> Booking
      </h1>

      <BookingForm form={form} handleSubmit={form.handleSubmit(onSubmit)}>
        <BookingForm.Select formControl={form.control} 
                            name="master" 
                            label="Master" 
                            options={masters.map(({id, firstname}: MasterType) => ({id, label: firstname}))}/>

        <BookingForm.Select formControl={form.control} 
                            name="style" 
                            label="Style" 
                            options={styleTypes.map(({id, name}: StyleType) => ({id, label: name}))}/>
        <div className="flex gap-2 w-full">
          <BookingForm.Date formControl={form.control} />
          <BookingForm.Select formControl={form.control} 
                              name="time" 
                              label="Time" 
                              options={[]}/>
        </div>
        <BookingForm.TextArea formControl={form.control} name="description" label="Comment" />
        <Button type="submit" className="w-full">
          {/* <Loader2Icon className="animate-spin" /> */}
          Submit</Button>
      </BookingForm>

      <AlertDialog open={openAlertDialog}>
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
            <AlertDialogAction onClick={() => setOpenAlertDialog(false)}>
              ok
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
