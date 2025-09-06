import type { ResponseSuccessWithData } from "@/core/models/base"
import { privateHttp } from "./http"
import type { AdminType } from "@/core/models/admin"

export function getAdminById(id: number): Promise<ResponseSuccessWithData<AdminType>> {
 return privateHttp.get(`admin/${id}`)
}