type ErrorCode = string | null
type Errors = Record<string, string[]> | null
type Message = string | null
type Error = string | null
type ServerError = any | null

export interface ApiDataResponse<T = any> {
    data: T | null
    errorCode: ErrorCode
    errors: Errors
    error: Error
    message: Message
    serverError: ServerError
}

export interface ApiResponseInterface<T = any> {
    getData: () => T | null
    getErrorCode: () => ErrorCode
    getErrors: () => Errors
    getMessage: () => Message
    getError: () => string | null
}

class ApiResponse<T> implements ApiResponseInterface<T> {
    private data = <T | null>null
    private errorCode: ErrorCode = null
    private error: Error = null
    private errors: Errors = null
    private message: Message = ''
    constructor(response: ApiDataResponse | undefined) {
        if (typeof response === 'undefined') return
        this.data = response.data
        this.error = response.error
        this.errors = response.errors
        this.message = response.message
    }

    /**
     * Returns data
     */
    getData() {
        return this.data
    }

    /**
     * Returns Error code
     */
    getErrorCode() {
        return this.errorCode
    }

    /**
     * Returns error
     */
    getError() {
        return this.error
    }

    /**
     * Returns errors
     */
    getErrors() {
        return this.errors
    }

    /**
     * Returns message
     */
    getMessage() {
        return this.message
    }
}

export { ApiResponse }
