import type { ResponseSuccess, ResponseSuccessWithData, ResponseWitMetaType } from "@/core/models/base";
import { privateHttp } from "./http";
import type { BookingByIdType, BookingViewType, CreateBookingType, UpdateBookingType } from "@/core/models/booking";

export async function getBooking(userId: number): Promise<ResponseWitMetaType<BookingViewType[]>> {
    return privateHttp.get(`/bookings/${userId}`)
}

export async function createBooking(payload: CreateBookingType): Promise<ResponseSuccess> {
    return privateHttp.post("/booking/create", payload)
}

export async function getBookingById(id: number): Promise<ResponseSuccessWithData<BookingByIdType>> {
    return privateHttp.get(`/booking/${id}`)
}

export async function deleteBooking(id: number): Promise<ResponseSuccess> {
    return privateHttp.delete(`/booking/${id}`)
}

export async function updateBooking(payload: UpdateBookingType): Promise<ResponseSuccessWithData<UpdateBookingType>> {
    return privateHttp.put("/booking/update", payload)
}