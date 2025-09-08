import type {  ResponseSuccess, ResponseSuccessWithData, ResponseWitMetaType } from "@/core/models/base";
import { privateHttp } from "./http";
import type { CreateStyleType, StyleType } from "@/core/models/styleType";


export function getStyleTypes(): Promise<ResponseWitMetaType<StyleType[]>> {
    return privateHttp.get("/style-types")
}

export function createNewStyleType(payload: CreateStyleType): Promise<ResponseSuccessWithData<StyleType>> {
    return privateHttp.post("/style-type/create", payload)
}

export function deleteStyleType(style_type_id: number): Promise<ResponseSuccess> {
    return privateHttp.delete(`/style-type/${style_type_id}`)
}

export function getStyleTypeById(style_type_id: number): Promise<ResponseSuccessWithData<StyleType>> {
    return privateHttp.get(`/style-type/${style_type_id}`)
}

export function updateStyleType(payload: StyleType): Promise<ResponseSuccessWithData<StyleType>> {
    return privateHttp.put("/style-type/update", payload)
}