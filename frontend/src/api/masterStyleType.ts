import type { ResponseSuccessWithData } from "@/core/models/base";
import { privateHttp } from "./http";
import type { MasterStyleType } from "@/core/models/masterStyleType";

export async function getMasterStyleTypes(): Promise<ResponseSuccessWithData<MasterStyleType[]>> {
    return privateHttp.get(`/master-style-types`)
}

export async function getMasterStyleTypeById(id: number): Promise<ResponseSuccessWithData<MasterStyleType>> {
    return privateHttp.get(`/master-style-type/${id}`)
}
