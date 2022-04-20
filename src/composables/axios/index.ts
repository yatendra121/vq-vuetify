import type { Ref } from 'vue'
import { ref, shallowRef } from 'vue'
import type {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    CancelTokenSource
} from 'axios'
import { _axios } from '@/plugins/axios'
import axios from 'axios'
import useErrorResponse from './useErrorResponse'

export interface UseAxiosReturn<T> {
    /**
     * Axios Response
     */
    response: Ref<AxiosResponse<T> | undefined>

    /**
     * Axios response data
     */
    data: Ref<T | undefined>

    /**
     * Indicates if the request has finished
     */
    isFinished: Ref<boolean>

    /**
     * Indicates if the request is currently loading
     */
    isLoading: Ref<boolean>

    /**
     * Indicates if the request was canceled
     */
    aborted: Ref<boolean>

    /**
     * Any errors that may have occurred
     */
    error: Ref<AxiosError<T> | undefined>

    errorResponse: any

    /**
     * Aborts the current request
     */
    abort: (message?: string | undefined) => void
}

/**
 * Wrapper for axios.
 *
 * @param url
 * @param config
 */
export function useAxios<T = any>(url: string, args: any) {
    const config: AxiosRequestConfig = args
    const instance: AxiosInstance = _axios

    const response = shallowRef<AxiosResponse<T>>()
    const data = shallowRef<T>()
    const isFinished = ref(false)
    const isLoading = ref(true)
    const aborted = ref(false)
    const errorResponse = shallowRef()
    const error = shallowRef<AxiosError<T>>()

    const cancelToken: CancelTokenSource = axios.CancelToken.source()
    const abort = (message?: string) => {
        if (isFinished.value || !isLoading.value) return

        cancelToken.cancel(message)
        aborted.value = true
        isLoading.value = false
        isFinished.value = false
    }

    instance(url, { ...config, cancelToken: cancelToken.token })
        .then((r: any) => {
            response.value = r
            data.value = r.data
        })
        .catch(async (e: any) => {
            const { getErrorResponse } = useErrorResponse()
            const { eResponse } = await getErrorResponse(e)
            errorResponse.value = eResponse
            error.value = e
        })
        .finally(() => {
            isLoading.value = false
            isFinished.value = true
        })

    return {
        response,
        data,
        error,
        finished: isFinished,
        loading: isLoading,
        isFinished,
        isLoading,
        cancel: abort,
        canceled: aborted,
        aborted,
        abort
    }
}
