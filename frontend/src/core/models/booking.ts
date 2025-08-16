import type {  BaseType } from "./base";

export type BookingViewType = BaseType & {
    date: string,
    master: string,
    style_type: string,
    time: string,
}

export type CreateBookingType = {
    user_id: number,
    date: string,
    time: string,
    master_style_type_id: number,
}

export type BookingByIdType = BaseType & CreateBookingType