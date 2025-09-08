import type { ResponseSuccess, ResponseSuccessWithData, ResponseWitMetaType } from "@/core/models/base";
import { privateHttp } from "./http";
import type { CreateMaster, CreateMasterUnavailableScheduleType, MasterStylesOfferType, MasterType, MasterUnavailableScheduleType, WorkingTime } from "@/core/models/master";
import type { MasterBookingType } from "@/core/models/booking";

export function getMasters(): Promise<ResponseWitMetaType<MasterType[]>> {
    return privateHttp.get("/masters")
}

export function getMasterStylesOffer(masterId: number): Promise<ResponseSuccessWithData<MasterStylesOfferType[]>> {
    return privateHttp.get(`/master/${masterId}/styles-offer`)
}

export function getMasterUnavailableSchedules(masterId: number): Promise<ResponseSuccessWithData<MasterUnavailableScheduleType[]>> {
    return privateHttp.get(`/master/unavailables/${masterId}`)
}

export function getMasterBookings(masterId: number): Promise<ResponseSuccessWithData<MasterBookingType[]>> {
    return privateHttp.get(`/master/${masterId}/bookings`)
}

export function getMasterAvailableTimeSlots(masterId: number, date: string): Promise<ResponseSuccessWithData<string[]>> {
    return privateHttp.get(`/master/${masterId}/${date}`)
}

export function getMasterById(masterId: number): Promise<ResponseSuccessWithData<MasterType>> {
    return privateHttp.get(`/master/${masterId}`)
}

export function updateMasterWorkingTime(payload: WorkingTime): Promise<ResponseSuccessWithData<WorkingTime>> {
    return privateHttp.put("/master/working-times", payload)
}

export function scheduleMasterUnavailableDays(payload: CreateMasterUnavailableScheduleType[], master_id: number): Promise<ResponseSuccess> {
    return privateHttp.post(`/master/${master_id}/unavailable`, payload)
}

export function deleteMaster(masterId: number): Promise<ResponseSuccess> {
    return privateHttp.delete(`/master/${masterId}`)
}

export function createMaster(masterPayload: CreateMaster): Promise<ResponseSuccessWithData<MasterType>> {
    return privateHttp.post("master/create", masterPayload)
}