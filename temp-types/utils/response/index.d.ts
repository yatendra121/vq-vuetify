type ErrorCode = string | null;
type Errors = Record<string, string[]> | null;
type Message = string | null;
type Error = string | null;
type ServerError = any | null;
export interface ApiDataResponse<T = any> {
    data: T | null;
    errorCode: ErrorCode;
    errors: Errors;
    error: Error;
    message: Message;
    serverError: ServerError;
}
export interface ApiResponseInterface<T = any> {
    getData: () => T | null;
    getErrorCode: () => ErrorCode;
    getErrors: () => Errors;
    getMessage: () => Message;
    getError: () => string | null;
}
declare class ApiResponse<T> implements ApiResponseInterface<T> {
    private data;
    private errorCode;
    private error;
    private errors;
    private message;
    constructor(response: ApiDataResponse | undefined);
    /**
     * Returns data
     */
    getData(): T | null;
    /**
     * Returns Error code
     */
    getErrorCode(): ErrorCode;
    /**
     * Returns error
     */
    getError(): Error;
    /**
     * Returns errors
     */
    getErrors(): Errors;
    /**
     * Returns message
     */
    getMessage(): Message;
}
export { ApiResponse };
//# sourceMappingURL=index.d.ts.map