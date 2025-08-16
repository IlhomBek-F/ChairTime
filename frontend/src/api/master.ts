import type { ResponseSuccessWithData, ResponseWitMetaType } from "@/core/models/base";
import { privateHttp } from "./http";
import type { MasterStylesOfferType, MasterType } from "@/core/models/master";

export function getMasters(): Promise<ResponseWitMetaType<MasterType[]>> {
    return privateHttp.get("/masters")
}

export function getMasterStylesOffer(masterId: number): Promise<ResponseSuccessWithData<MasterStylesOfferType[]>> {
    return privateHttp.get(`/master/${masterId}/styles-offer`)
}