import type { BaseType } from "./base";

export type StyleType = BaseType & {
	name: string,
    duration: number,
    description?: string
}

export type CreateStyleType = Omit<StyleType, "id" | "created_at" | "updated_at">