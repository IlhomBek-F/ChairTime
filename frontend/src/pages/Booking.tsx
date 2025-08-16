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
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMaster } from "@/hooks/useMaster";
import { useMasterStylesOffer } from "@/hooks/useMasterStylesOffer";
import { useAuth } from "@/context/Auth";

type Inputs = {
  user_id: number;
  phone: string;
  master_id: string;
  style_type_id: string;
  date: Date;
  time: string;
  description?: string;
};

const formSchema = z.object({
  user_id: z.number(),
  phone: z.string().min(8).max(10),
  master_id: z.string().min(1),
  style_type_id: z.string().min(1),
  date: z.date(),
  time: z.string().min(1),
});

export function Booking() {
  const {userInfo} = useAuth();
  const {masters} = useMaster();
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const {styleTypes, getMasterStylesOffer} = useMasterStylesOffer();
  
  const navigate = useNavigate();
  const { id } = useParams();

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: userInfo?.id || 1,
      phone: "888281211"
    },
    mode: "onChange",
  });

  const masterId = form.watch("master_id")

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
                            name="master_id" 
                            optionValue="id"
                            optionLabel="firstname"
                            label="Master" 
                            options={masters}/>

        <BookingForm.Select formControl={form.control} 
                            optionLabel="name"
                            optionValue="id"
                            name="style_type_id" 
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
            <AlertDialogAction onClick={() => setOpenAlertDialog(false)}>
              ok
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
