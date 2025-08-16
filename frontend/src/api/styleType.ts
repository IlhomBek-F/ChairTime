import type {  ResponseWitMetaType } from "@/core/models/base";
import { privateHttp } from "./http";
import type { StyleType } from "@/core/models/styleType";


export function getStyleTypes(): Promise<ResponseWitMetaType<StyleType[]>> {
    return privateHttp.get("/style-types")
}