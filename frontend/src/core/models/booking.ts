import type {  BaseType } from "./base";

export type BookingViewType = BaseType & {
    date: string,
    master: string,
    style_type: string,
    time: string,
    phone: string
}

export type MasterBookingType = Omit<BookingViewType, "created_at" | "updated_at"> & {
    username: string,
    phone: string,
    description: string
} 

export type CreateBookingType = {
    user_id: number,
    date: string,
    time: string,
    master_style_type_id: number,
    description?: string
}

export type BookingByIdType = BaseType & CreateBookingType
export type UpdateBookingType = BookingByIdType