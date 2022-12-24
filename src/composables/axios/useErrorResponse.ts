import { ref, shallowRef } from 'vue'
import { unauthenticationError } from './useError'

import type { AxiosError } from 'axios'

export default function useErrorResponse() {
    const getErrorResponse = async <T>(response: AxiosError<T>) => {
        const status = shallowRef()
        const statusText = shallowRef()
        const errorResponse = shallowRef<T>()
        if (response.response) {
            const r = response.response
            status.value = r.status
            statusText.value = r.statusText

            if ([400, 422].includes(status.value)) {
                errorResponse.value = r.data
            } else if ([401].includes(status.value)) {
                await unauthenticationError()
            } else if ([405, 404].includes(status.value)) {
                throw new Error(response.message)
            } else {
                throw new Error(response.message)
            }
        } else {
            console.error('API Error (No response):', response.message)
            throw new Error(response.message)
        }
        return { status, statusText, eResponse: errorResponse }
    }

    return { getErrorResponse }
}
