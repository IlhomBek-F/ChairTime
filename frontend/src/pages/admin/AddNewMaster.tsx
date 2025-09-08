import { createMaster } from "@/api/master";
import { Button } from "@/components/ui/button";
import { CustomForm } from "@/components/ui/form/bookingForm";
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multiSelect";
import { PageTitle } from "@/components/ui/pageTitle";
import { Separator } from "@/components/ui/separator";
import { useStyleType } from "@/hooks/useStyleType";
import { toastError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
    username: z.string().min(3, "Username is required"),
    phone: z.string().min(6, "Phone is required"),
    password: z.string().min(6, "Password is required"),
    confirm_password: z.string().min(6, "Confirm password is required"),
    offer_style_ids: z.array(z.number().min(1, "Select at least one style type"))
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"]
});

type Inputs = z.infer<typeof formSchema>;

const sampleOptions: MultiSelectOption[] = [
  { label: "Haircut", value: 1, description: "30–45 min" },
  { label: "Coloring", value: 2, description: "1–2 hours" },
  { label: "Manicure", value: 3 },
  { label: "Makeup", value: 4 },
  { label: "Massage", value: 5 },
  { label: "Shave", value: 6 },
  { label: "Brow Styling", value: 7},
  { label: "Hair Treatment", value: 8 },
];

export function AddNewMaster() {
    const [offerStyleIds, setOfferStyleIds] = useState<number[]>([]);
    const [saving, setSaving] = useState(false);
    const {styleTypes} = useStyleType();
    const styleTypeOptions = styleTypes.map(({name, duration, id}) => ({label: name, value: id, description: `${duration}`}));

    const form = useForm<Inputs>({resolver: zodResolver(formSchema), mode: "onChange", defaultValues: {
        username: "",
        password: "",
        confirm_password: "",
        offer_style_ids: [],
        phone: ""
    }});

    const handleSubmit = (values: Inputs) => {
      const {confirm_password, ...rest} = values;
      const newMaster = {...rest, offer_style_ids: offerStyleIds, start_working_time: "8:00", end_working_time: "18:00"}
      
      setSaving(true)
      createMaster(newMaster)
       .then(() => {
          toast.success("Created new master successfully")
       }).catch(toastError)
       .finally(() => setSaving(false))
    }

    return (
        <>
        <PageTitle title="Add new Master" icon={<User className="text-purple-600"/>}/>
        <Separator className="my-2"/>
          <CustomForm form={form} handleSubmit={form.handleSubmit(handleSubmit)} className="m-2">
             <CustomForm.InputField formControl={form.control}
                                    name="username"
                                    label="Name"/>
             <CustomForm.InputField formControl={form.control}
                                    name="phone"
                                    label="Phone" />
             <MultiSelect options={styleTypeOptions}
                          value={offerStyleIds}
                          label="Offer style types"
                          onChange={setOfferStyleIds}
                          className="mb-2"
                          placeholder="Choose services"
                          searchPlaceholder="Search services..."
                          emptyMessage="No services match"
                          maxVisibleBadges={2}
                          withSelectAll
                          maxHeight={240}/>
             <CustomForm.InputField formControl={form.control}
                                    name="password"
                                    label="Password"/>
             <CustomForm.InputField formControl={form.control}
                                    name="confirm_password"
                                    label="Confirm password" />

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[95%] max-w-lg">
                <Button disabled={saving} className="w-full py-5 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition text-white shadow-lg cursor-pointer">
                        {saving && <Loader2Icon className="animate-spin mr-2" />}
                        Save
                </Button>
            </div>   
          </CustomForm>
        </>
    )
}
