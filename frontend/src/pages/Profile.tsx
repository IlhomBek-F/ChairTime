import { deleteAccount, getUserInfo as _getUserInfo } from "@/api/auth";
import AvatarUploader from "@/components/ui/avatarUpload";
import { BookingForm } from "@/components/ui/bookingForm";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useAuth } from "@/context/Auth";
import { clearToken } from "@/utils/token";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookUser, ChevronsUpDown, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";

const formSchema = z.object({
  username: z.string().min(3),
  phone: z.string().min(3)
});

export function Profile() {
  const navigate = useNavigate();
  const {getUserInfo} = useAuth();
  const {id: user_id} = getUserInfo();
  const [deletingAccount, setDeletingAccount] = useState(false);

  const form = useForm({resolver: zodResolver(formSchema), mode: "onChange" });

  useEffect(() => {
     if(user_id) {
       _getUserInfo(user_id)
        .then(({data}) => {
           form.setValue("username", data.username)
           form.setValue("phone", data.phone)
        }).catch(console.log)
     }
  }, [])

  const handleSubmit = () => {};
  
  const handleDeleteAccount = () => {
    setDeletingAccount(true);
    deleteAccount(+user_id)
     .then(() => {
        clearToken()
        navigate("/login");
     }).catch(console.log)
     .finally(() => setDeletingAccount(false))
  }

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
        <BookingForm.InputField
          formControl={form.control}
          name="phone"
          label="Phone"
        />
        <Button
          type="submit"
          className="absolute w-[95%] left-1/2 transform -translate-x-1/2 bottom-5 max-w-lg"
        >
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
          {deletingAccount && <Loader2Icon className="animate-spin" />}
          <Button variant="destructive" onClick={handleDeleteAccount}>Delete account</Button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
