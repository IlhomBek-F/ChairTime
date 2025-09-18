import type { Roles } from "../enums/roles"

export type AuthType = {
    username: string,
    password: string
}

export type AuthResType = {
    id: number,
    role: Roles,
    access_token: string,
    refresh_token: string
}