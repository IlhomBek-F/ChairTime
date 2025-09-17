import { deleteAccount, getUserInfo as _getUserInfo } from "@/api/auth";
import { getMasterById } from "@/api/master";
import AvatarUploader from "@/components/ui/form/avatarUpload";
import { CustomForm } from "@/components/ui/form/bookingForm";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PageTitle } from "@/components/ui/pageTitle";
import { useAuth } from "@/context/Auth";
import { Roles } from "@/core/enums/roles";
import { clearToken } from "@/lib/token";
import { toastError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookUser, ChevronsUpDown, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";
import { getAdminById } from "@/api/admin";
import type { ResponseSuccessWithData } from "@/core/models/base";
import type { MasterType } from "@/core/models/master";
import type { AdminType } from "@/core/models/admin";
import type { User } from "@/core/models/user";

const formSchema = z.object({
  username: z.string().min(3),
  phone: z.string().min(3),
});

export function Profile() {
  const navigate = useNavigate();
  const { getUserInfo } = useAuth();
  const { id: user_id , role} = getUserInfo();
  const [deletingAccount, setDeletingAccount] = useState(false);

  const form = useForm({ resolver: zodResolver(formSchema), mode: "onChange" });

  useEffect(() => {
    if (user_id) {
      const actionMap: Record<Roles, any> = {
        [Roles.USER]: _getUserInfo,
        [Roles.MASTER]: getMasterById,
        [Roles.ADMIN]: getAdminById
      }

        actionMap[role](user_id).then(({ data }: ResponseSuccessWithData<User | MasterType | AdminType>) => {
          form.setValue("username", data.username);
          form.setValue("phone", data.phone);
        })
        .catch(toastError);
    }
  }, []);

  const handleSubmit = () => {};
  
  const handleDeleteAccount = () => {
    setDeletingAccount(true);
    deleteAccount(+user_id)
      .then(() => {
        clearToken();
        navigate("/login");
      })
      .catch(toastError)
      .finally(() => setDeletingAccount(false));
  };

  return (
    <>
  <PageTitle title="Profile" icon={<BookUser size={20} className="text-purple-600" />}/>
  <div className="flex flex-col items-center mb-6">
    <AvatarUploader />
    <span className="text-sm text-gray-500 mt-2">Tap to update photo</span>
  </div>

  {/* Form */}
  <CustomForm form={form} handleSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
    <CustomForm.InputField
      formControl={form.control}
      name="username"
      label="Username"
    />
    <CustomForm.InputField
      formControl={form.control}
      name="phone"
      label="Phone"
    />
  </CustomForm>

  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-lg">
    <Button
      type="submit"
      className="w-full py-5 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition text-white shadow-lg cursor-pointer"
    >
      Save Changes
    </Button>
  </div>

  <Collapsible  className=" border-t pt-4 flex w-full flex-col gap-3">
    <div className="flex items-center justify-between gap-4">
      <h4 className="text-sm font-semibold text-red-500">Danger Zone</h4>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 cursor-pointer hover:bg-red-50"
        >
          <ChevronsUpDown />
          <span className="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent className="flex flex-col gap-2">
      {deletingAccount && <Loader2Icon className="animate-spin text-red-500" />}
      <Button
        variant="destructive"
        className="rounded-lg shadow-sm"
        onClick={handleDeleteAccount}
      >
        Delete Account
      </Button>
    </CollapsibleContent>
  </Collapsible>
</>
  );
}
