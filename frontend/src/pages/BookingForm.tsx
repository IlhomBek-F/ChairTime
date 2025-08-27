import { Button } from "@/components/ui/button";
import { BookUser, Check, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useAuth } from "@/context/Auth";
import { createBooking, getBookingById, updateBooking } from "@/api/booking";
import { getMasterStyleTypeById } from "@/api/masterStyleType";
import { toast } from "sonner";
import { toastError } from "@/lib/utils";
import { useMasterUnavailableSchedule } from "@/hooks/useMasterUnavailableSchedule";
import { CustomForm } from "@/components/ui/bookingForm";

type Inputs = {
  master_id: number;
  master_style_type_id: number;
  date: string;
  time: string;
  description: string;
};

const formSchema = z.object({
  master_id: z.number(),
  master_style_type_id: z.number(),
  date: z.string(),
  time: z.string().min(1),
  description: z.string()
});

export function BookingForm() {
  const param = useParams();
  const bookingId = Number(param["id"]);

  const navigate = useNavigate();
  const { getUserInfo } = useAuth();
  const { masters, loading } = useMaster();
  const [upsertLoading, setUpsertLoading] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });
  const masterIdValueChange = form.watch("master_id");

  const { styleTypes, loading: loadingStyleTypes } = useMasterStylesOffer(masterIdValueChange);
  const { dateMathcer, loading: loadingMasterSchedule } = useMasterUnavailableSchedule(masterIdValueChange);
  const [loadingBookingInfo, setLoadingBookingInfo] = useState(false);
  const [pendingMstStyleTypeId, setPendingMstStyleTypeId] = useState<number>();

  useEffect(() => {
    if (masters.length && bookingId) {
      getBooking(bookingId);
    }
  }, [bookingId, masters]);

  useEffect(() => {
    if (styleTypes && pendingMstStyleTypeId) {
      form.setValue("master_style_type_id", pendingMstStyleTypeId);
    }
  }, [styleTypes]);

  const getBooking = async (id: number) => {
    setLoadingBookingInfo(true);
    try {
      const { data: {time, date, master_style_type_id, description} } = await getBookingById(id);
      const { data: masterStyleType } = await getMasterStyleTypeById(master_style_type_id);

      form.setValue("master_id", masterStyleType.master_id);
      setPendingMstStyleTypeId(masterStyleType.id);
      form.setValue("time", time);
      form.setValue("date", date);
      form.setValue("description", description);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoadingBookingInfo(false);
    }
  };

  const _createBooking = (values: Inputs) => {
    const { id: user_id } = getUserInfo();
    const payload = {user_id: +user_id, ...values};
    
    createBooking(payload)
      .then(() => setOpenAlertDialog(true))
      .catch(toastError)
      .finally(() => setUpsertLoading(false));
  };

  const _updateBooking = (values: Inputs) => {
    const { id: user_id } = getUserInfo();
    const payload = { id: bookingId, user_id: +user_id, ...values};

    updateBooking(payload)
      .then(() => setOpenAlertDialog(true))
      .catch(toastError)
      .finally(() => setUpsertLoading(false));
  };

  const onSubmit = ({ master_style_type_id, ...rest }: Inputs) => {
    setUpsertLoading(true);
    if (bookingId) {
      _updateBooking({ master_style_type_id, ...rest });
    } else {
      _createBooking({ master_style_type_id, ...rest });
    }
  };

  const closeAndNavigateToHomePage = () => {
    setOpenAlertDialog(false);
    navigate("/");
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-gray-50 rounded-2xl shadow-sm">
      {/* Header */}
      <h1 className="font-bold text-xl text-gray-800 mb-6 font-mono flex gap-2 items-center">
        <BookUser size={20} className="text-purple-600" />
        Booking
      </h1>

      {/* Form */}
      <CustomForm
        form={form}
        handleSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Master */}
        <CustomForm.Select
          formControl={form.control}
          name="master_id"
          optionValue="id"
          type="number"
          optionLabel="firstname"
          label="Master"
          loading={loading || loadingBookingInfo}
          options={masters}
        />

        {/* Style */}
        <CustomForm.Select
          formControl={form.control}
          optionLabel="name"
          optionValue="id"
          name="master_style_type_id"
          label="Style"
          type="number"
          loading={loadingStyleTypes}
          options={styleTypes}
        />

        {/* Date + Time */}
        <div className="flex gap-3 w-full">
          <CustomForm.Date
            formControl={form.control}
            label="Date"
            name="date"
            mode="single"
            popover={true}
            loading={loadingMasterSchedule}
            matcher={dateMathcer}
          />
          <CustomForm.Select
            formControl={form.control}
            name="time"
            label="Time"
            options={["18:00", "19:00"]}
          />
        </div>

        {/* Comment */}
        <CustomForm.TextArea
          formControl={form.control}
          name="description"
          label="Comment"
          placeholder="Add any special requests..."
        />

        {/* Submit */}
        <Button
          type="submit"
          className="w-full py-5 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition text-white shadow-lg cursor-pointer"
        >
          {upsertLoading && <Loader2Icon className="animate-spin mr-2" />}
          {bookingId
            ? upsertLoading
              ? "Updating..."
              : "Update"
            : upsertLoading
            ? "Saving..."
            : "Save"}
        </Button>
      </CustomForm>

      {/* Success Dialog */}
      <AlertDialog open={openAlertDialog}>
        <AlertDialogContent className="rounded-2xl shadow-lg">
          <AlertDialogHeader>
            <AlertDialogDescription className="flex flex-col items-center gap-4">
              <span className="size-[60px] rounded-full flex justify-center items-center border-green-400 border-2 bg-green-50">
                <Check color="green" size={30} />
              </span>
              <p className="text-gray-700 font-medium">
                Your booking has been {bookingId ? "updated" : "accepted"}{" "}
                successfully
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="rounded-lg bg-purple-600 text-white hover:bg-purple-700"
              onClick={closeAndNavigateToHomePage}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
