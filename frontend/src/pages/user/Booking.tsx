import { BookUser, Check } from "lucide-react";
import {  useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/Auth";
import { createBooking, updateBooking } from "@/api/booking";
import { toastError } from "@/lib/utils";
import { PageTitle } from "@/components/ui/pageTitle";
import { BookingForm, type Inputs } from "@/components/ui/booking/bookingForm";
import type { UpdateBookingType } from "@/core/models/booking";

export function Booking() {
  const param = useParams();
  const bookingId = Number(param["id"]);
  const navigate = useNavigate();
  const { getUserInfo } = useAuth();
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [upsertLoading, setUpsertLoading] = useState(false);

  const _createBooking = (values: Inputs) => {
    const { id: user_id } = getUserInfo();
    const payload = {user_id: +user_id, ...values};
    
    createBooking(payload)
      .then(() => setOpenAlertDialog(true))
      .catch(toastError)
      .finally(() => setUpsertLoading(false));
  };

  const _updateBooking = (values: Inputs, booking?: UpdateBookingType) => {
    const { id: user_id } = getUserInfo();
    const payload = { id: bookingId, user_id: +user_id, ...values, created_at: booking?.created_at};

    updateBooking(payload)
      .then(() => setOpenAlertDialog(true))
      .catch(toastError)
      .finally(() => setUpsertLoading(false));
  };

  const onSubmit = ({ master_style_type_id, ...rest }: Inputs, booking?: UpdateBookingType) => {
    setUpsertLoading(true);
    if (bookingId) {
      _updateBooking({ master_style_type_id, ...rest }, booking);
    } else {
      _createBooking({ master_style_type_id, ...rest });
    }
  };

  const closeAndNavigateToHomePage = () => {
    setOpenAlertDialog(false);
    navigate("/");
  };

  return (
    <>
      {/* Header */}
      <PageTitle title="Booking" icon={<BookUser size={20} className="text-purple-600" />}/>
    
      <BookingForm bookingId={bookingId}
                   upsertLoading={upsertLoading}
                   onSubmit={onSubmit}
                   />

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
    </>
  );
}
