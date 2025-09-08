import { createNewStyleType, updateStyleType } from "@/api/styleType";
import { Button } from "@/components/ui/button";
import { CustomForm } from "@/components/ui/form/bookingForm";
import { PageTitle } from "@/components/ui/pageTitle";
import { Separator } from "@/components/ui/separator";
import { useStyleType } from "@/hooks/useStyleType";
import { toastError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Scissors } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
    name: z.string().min(3),
    duration: z.number(),
    description: z.string().optional()
})

type Inputs = z.infer<typeof formSchema>;

export function AddNewStyleType() {
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const param = useParams();
    const styleTypeId = Number(param["id"]);
    const {styleType} = useStyleType(styleTypeId);

    const form = useForm<Inputs>({resolver: zodResolver(formSchema), defaultValues: {
        name: "",
        duration: 30
    }})

    useEffect(() => {
       if(styleType) {
           form.reset(styleType)
       }
    }, [styleType])

    const _createNewStyleType = async (data: Inputs) => {
        createNewStyleType(data)
         .then(() => {
            toast.success("Created new style type successfully")
            navigate("/")
         }).catch(toastError)
         .finally(() => setSaving(false))
    }

    const _updateStyleType = async (data: Inputs) => {
        updateStyleType({...data, id: styleTypeId, created_at: styleType?.created_at})
         .then(() => {
            toast.success("Updated style type successfully")
            navigate("/")
         }).catch(toastError)
         .finally(() => setSaving(false))
    }

    const handleSubmit = (values: Inputs) => {
         setSaving(true)
         if(styleTypeId) {
            _updateStyleType(values)
         } else {
            _createNewStyleType(values)
         }
    }

    return (
        <>
          <PageTitle title="Add new style type" icon={<Scissors className="text-purple-600"/>}/>
          <Separator />
          <CustomForm form={form} handleSubmit={form.handleSubmit(handleSubmit)} className="m-2">
             <CustomForm.InputField formControl={form.control}
                                    name="name"
                                    label="Name"/>
             <CustomForm.InputField formControl={form.control}
                                    name="duration"
                                    label="Duration" />
             <CustomForm.TextArea   formControl={form.control}
                                    name="description"
                                    label="Description" />

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-[95%] max-w-lg">
                <Button disabled={saving} className="w-full py-5 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition text-white shadow-lg cursor-pointer">
                        {saving && <Loader2Icon className="animate-spin mr-2" />}
                        {styleTypeId ? (saving ? "Updating..." : "Update") : (saving ? "Creating..." : "Create")}
                </Button>
            </div>   
          </CustomForm>
        </>
    )
}