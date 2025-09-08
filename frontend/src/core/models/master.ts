import type { WeekDays } from "../enums/weekDays";
import type { BaseType } from "./base";
import type { User } from "./user";

export type MasterType = User & {
  offer_style_ids: number[],
  role_id: number
}

export type MasterUnavailableScheduleType = BaseType & {
  day_of_week: WeekDays,
  start_time: string,
  end_time: string,
  date: string,
  master_id: number
}

export type CreateMaster = {
  username: string;
  phone: string;
  offer_style_ids: number[],
  password: string;
  start_working_time: string;
  end_working_time: string
}

export type WorkingTime = {
  id: number
  start_working_time: string,
  end_working_time: string
}

export type CreateMasterUnavailableScheduleType = Omit<MasterUnavailableScheduleType, "id" | "created_at" | "updated_at">

export type MasterStylesOfferType = {
    id: number,
    master_style_type_id: number,
    name: string
}