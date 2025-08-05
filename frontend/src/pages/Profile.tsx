import AvatarUploader from "@/components/ui/avatarUpload";
import { BookingForm } from "@/components/ui/bookingForm";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookUser, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";

const formSchema = z.object({
  username: z.string().min(3),
});

export function Profile() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "Arslan",
    },
    mode: "onChange",
  });

  const handleSubmit = () => {};

  return (
    <div className="w-full">
      <h1 className="font-bold text-left font-mono flex gap-1 items-center mb-4">
        <BookUser size={18} />
        Profile
      </h1>
      <AvatarUploader />
      <BookingForm form={form} handleSubmit={form.handleSubmit(handleSubmit)}>
        <BookingForm.InputField
          formControl={form.control}
          name="username"
          label="Username"
        />
        <Button
          type="submit"
          className="absolute w-[95%] left-1/2 transform -translate-x-1/2 bottom-5 max-w-lg"
        >
          {/* <Loader2Icon className="animate-spin" /> */}
          Submit
        </Button>
      </BookingForm>
      <Collapsible className="flex w-full flex-col gap-2">
        <div className="flex items-center justify-between gap-4 px-4">
          <h4 className="text-sm font-semibold text-red-500">Dangerous</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ChevronsUpDown />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          <Button variant="destructive">Delete account</Button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
