import type {  ResponseSuccess, ResponseSuccessWithData, ResponseWitMetaType } from "@/core/models/base";
import { privateHttp } from "./http";
import type { CreateStyleType, StyleType } from "@/core/models/styleType";


export function getStyleTypes(): Promise<ResponseWitMetaType<StyleType[]>> {
    return privateHttp.get("/style-types")
}

export function createNewStyleType(payload: CreateStyleType): Promise<ResponseSuccessWithData<StyleType>> {
    return privateHttp.post("/style-stype/create", payload)
}

export function deleteStyleType(style_type_id: number): Promise<ResponseSuccess> {
    return privateHttp.delete(`/style-type/${style_type_id}`)
}