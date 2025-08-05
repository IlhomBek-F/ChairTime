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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

  useEffect(() => {
    if (id) {
      // fetch booking data
      console.log("fetching,,,,");
    }
  }, [id]);

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
        <BookingForm.UserName formControl={form.control} />
        <BookingForm.Phone formControl={form.control} />
        <BookingForm.Master formControl={form.control} />
        <BookingForm.Style formControl={form.control} />
        <div className="flex gap-2 w-full items-center mb-4">
          <BookingForm.Date formControl={form.control} />
          <BookingForm.Time formControl={form.control} />
        </div>
        <BookingForm.Comment formControl={form.control} />
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
