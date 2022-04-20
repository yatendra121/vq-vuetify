import { shallowRef } from 'vue'
import { unauthenticationError } from './useError'

export default function useErrorResponse() {
    const getErrorResponse = async (response: any) => {
        const status = shallowRef()
        const statusText = shallowRef()
        const errorResponse = shallowRef()
        if (response.response) {
            const r = response.response.request
            status.value = r.status
            statusText.value = r.statusText

            if ([400, 422].includes(status.value)) {
                errorResponse.value = JSON.parse(r.response)
            } else if ([401].includes(status.value)) {
                await unauthenticationError()
            } else if ([405, 404].includes(status.value)) {
                console.log(response.message)
            }
        } else {
            console.log('API Error (No response):', response.message)
        }
        return { status, statusText, eResponse: errorResponse }
    }

    return { getErrorResponse }
}
