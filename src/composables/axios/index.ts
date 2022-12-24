import { ref, shallowRef } from 'vue'
import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    CancelTokenSource
} from 'axios'
import { _axios } from '../../plugins/axios'
import useErrorResponse from './useErrorResponse'
import { objectToQueryString } from '../../composables/axios/formData'

import type { Ref, ShallowRef } from 'vue'
import type { ApiDataResponse } from '../../utils/response'

export interface UseAxiosReturn<T> {
    /**
     * Axios Response
     */
    response: Ref<ApiDataResponse<T> | undefined>

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

    errorResponse: ShallowRef<T | undefined>

    /**
     * Aborts the current request
     */
    abort: (message?: string | undefined) => void
}

/**
 * Wrapper for axios.
 * @param url
 */
export function useAxios<T = any, _D = any, E = any>(
    url: string,
    args: AxiosRequestConfig
) {
    const config: AxiosRequestConfig = args
    const instance: AxiosInstance = _axios

    const response = ref<ApiDataResponse<T>>()
    // const data = shallowRef<T | null>(null)
    const isFinished = ref(false)
    const isLoading = ref(true)
    const aborted = ref(false)
    const errorResponse = shallowRef<E>()
    //const error = shallowRef<AxiosError<E>>()

    const cancelToken: CancelTokenSource = axios.CancelToken.source()
    const abort = (message?: string) => {
        if (isFinished.value || !isLoading.value) return

        cancelToken.cancel(message)
        aborted.value = true
        isLoading.value = false
        isFinished.value = false
    }

    instance<T>(url, { ...config, cancelToken: cancelToken.token })
        .then((res: AxiosResponse['data']) => {
            response.value = res
            // data.value = r.data
        })
        .catch(async (e: AxiosError<E>) => {
            const { getErrorResponse } = useErrorResponse()
            const { eResponse } = await getErrorResponse<E>(e)
            errorResponse.value = eResponse.value
            //error.value = e
        })
        .finally(() => {
            isLoading.value = false
            isFinished.value = true
        })

    return {
        response,
        // data,
        // error,
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

export async function useAsyncAxios<T = any>(
    url: string,
    args: AxiosRequestConfig,
    option: { cancelToken: CancelTokenSource } = {
        cancelToken: axios.CancelToken.source()
    }
): Promise<T> {
    const config: AxiosRequestConfig = args
    const instance: AxiosInstance = _axios

    const { cancelToken } = option

    try {
        return (await instance<T>(url, {
            ...config,
            cancelToken: cancelToken.token
        })) as AxiosResponse<T>['data']
    } catch (e: unknown) {
        const err = e as AxiosError<T>
        return Promise.reject(err)
    }
}

export async function* useAsyncAxiosGenerator<T = any>(
    url: string,
    args: AxiosRequestConfig,
    option: {
        queryParams?: any
        page_size: number
        page?: number
        deley?: number
    } = {
        page_size: 10
    }
): any {
    let page = 1
    let nextPage
    let response
    let dataFinished = false
    while (nextPage !== 0 && !dataFinished) {
        console.log({ page })
        option.queryParams.page = page
        try {
            response = await useAsyncAxios<T>(
                `${url}?${objectToQueryString(option.queryParams, '')}`,
                args
            )
        } catch (e: any) {
            throw new Error(e.message)
        }

        nextPage = yield response
        page = nextPage ?? ++page

        if (option && option.deley && option.deley > 0)
            await new Promise((resolve) => setTimeout(resolve, option.deley))
        //@ts-ignore
        if (option && option.page_size * page >= response.data.data.total)
            dataFinished = true
    }
}

// const apiParams = reactive({ page: 1, page_size: 3, search: '' })

// const axiosGenerator = useAsyncAxiosGenerator(
//   `user`,
//   {
//     method: 'GET'
//   },
//   { queryParams: apiParams, page_size: 10 }
// )

// const loadMore = async () => {
//   loading.value = true
//   const test = await axiosGenerator.next().finally(() => {
//     loading.value = false
//   })
//   console.log(test)
// }
