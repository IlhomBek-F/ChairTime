import type { BaseType } from "./base";

export type MasterType = BaseType & {
  firstname: string,
  lastname: string,
  phone: string,
  offer_style_ids: number[]
}

export type MasterStylesOfferType = {
    id: number,
    master_style_type_id: number,
    name: string
}