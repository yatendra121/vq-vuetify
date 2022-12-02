import type { Response } from '@/types/response';
declare class ApiResponse {
    private data;
    private error;
    private errors;
    private message;
    constructor(response: Response);
    /**
     * Returns the id of the [[BaseTx]]
     */
    getData(): any;
    /**
     * Returns the id of the [[BaseTx]]
     */
    getError(): string;
    /**
     * Returns the id of the [[BaseTx]]
     */
    getErrors(): any;
    /**
     * Returns the id of the [[BaseTx]]
     */
    getMessage(): string;
}
export { ApiResponse };
