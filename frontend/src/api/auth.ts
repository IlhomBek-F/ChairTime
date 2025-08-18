import type { AuthResType, AuthType } from "@/core/models/auth";
import { privateHttp, publicHttp } from "./http";
import type { ResponseSuccess, ResponseSuccessWithData } from "@/core/models/base";
import type { User } from "@/core/models/user";

export async function signIn(username: string, password: string): Promise<ResponseSuccessWithData<AuthResType>> {
    return publicHttp.post("/auth/sign-in", {username, password})
}

export async function signUp(credential: AuthType): Promise<ResponseSuccess> {
    return publicHttp.post("/auth/sign-up", credential)
}

export async function deleteAccount(userId: number): Promise<ResponseSuccess> {
    return privateHttp.delete(`/user/${userId}`)
}

export async function getUserInfo(userId: number): Promise<ResponseSuccessWithData<User>> {
    return privateHttp.get(`/user/${userId}`)
} 