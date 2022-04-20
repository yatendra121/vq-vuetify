export type Response = {
    current_permission: number
    data: any
    error: null | string
    error_code: null | string
    errors: null | Object
    exception: null | string
    message: null | string
    trace: null | string
    [key: string]: any
}

export type AxiosSuccessResponse = {
    data: Response
    [key: string]: any
}

export type AxiosErrorResponse = {
    data: Response
    [key: string]: any
}

export type LoginData = {
    device: any
    token: any
    user: any
}
