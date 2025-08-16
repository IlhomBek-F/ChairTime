import type { AuthResType, AuthType } from "@/core/models/auth";
import { publicHttp } from "./http";
import type { ResponseSuccess, ResponseSuccessWithData } from "@/core/models/base";

export async function signIn(username: string, password: string): Promise<ResponseSuccessWithData<AuthResType>> {
    return publicHttp.post("/auth/sign-in", {username, password})
}

export async function signUp(credential: AuthType): Promise<ResponseSuccess> {
    return publicHttp.post("/auth/sign-up", credential)
}