import type { Roles } from "../enums/roles";
import type { BaseType } from "./base";

export type AdminType = BaseType & {
 username: string
 phone: string
 role_id: Roles
}