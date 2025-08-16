export type BaseType = {
    id: number;
    created_at?: string;
    updated_at?: string;
}

export type ResponseMetaType = {
    page: number,
    total: number,
    per_page?: number
}

export type ResponseSuccess = {
    status: number;
    message: string;
}

export type ResponseSuccessWithData<T> = ResponseSuccess & {
    data: T;
}

export type ResponseWitMetaType<T> = ResponseSuccessWithData<T> & {
    meta: ResponseMetaType
}