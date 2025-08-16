import type { ResponseWitMetaType } from "@/core/models/base";
import { privateHttp } from "./http";
import type { BookingViewType } from "@/core/models/booking";

export async function getBooking(userId: number): Promise<ResponseWitMetaType<BookingViewType[]>> {
    return privateHttp.get(`/bookings/${userId}`)
}
