import type { AuthType } from "./auth"
import type { BaseType } from "./base"

export type CreateAccountType = AuthType & {
  phone: string
}

export type User = BaseType & {
    username: string
    phone: string
}