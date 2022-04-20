import type { Response } from '@/types/response'
class ApiResponse {
    private data = null
    private error = <string | null>''
    private errors = <any | null>''
    private message = <string | null>''
    constructor(response: Response) {
        this.data = response.data
        this.error = response.error
        this.errors = response.errors
        this.message = response.message
    }

    /**
     * Returns the id of the [[BaseTx]]
     */
    getData() {
        return this.data
    }

    /**
     * Returns the id of the [[BaseTx]]
     */
    getError() {
        return this.error
    }

    /**
     * Returns the id of the [[BaseTx]]
     */
    getErrors() {
        return this.errors
    }

    /**
     * Returns the id of the [[BaseTx]]
     */
    getMessage() {
        return this.message
    }
}

export { ApiResponse }
