import { Button } from "@/components/ui/button";
import { BookUser } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookingForm } from "@/components/ui/bookingForm";

type Inputs = {
  username: string;
  phone: string;
  master: string;
  style: string;
  date: Date;
  time: string;
  description: string;
};

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  phone: z.string().min(8, "Phone number is required"),
  master: z.string().min(1, "Username is required"),
  style: z.string().min(1, "Username is required"),
  date: z.date(),
  time: z.string().min(1, "Username is required"),
  description: z.string().min(1, "Username is required"),
});

export function Booking() {
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
        <Button type="submit">Submit</Button>
      </BookingForm>
    </div>
  );
}
