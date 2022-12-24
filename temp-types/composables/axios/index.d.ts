import { AxiosError, AxiosRequestConfig, CancelTokenSource } from 'axios';
import type { Ref, ShallowRef } from 'vue';
import type { ApiDataResponse } from '../../utils/response';
export interface UseAxiosReturn<T> {
    /**
     * Axios Response
     */
    response: Ref<ApiDataResponse<T> | undefined>;
    /**
     * Axios response data
     */
    data: Ref<T | undefined>;
    /**
     * Indicates if the request has finished
     */
    isFinished: Ref<boolean>;
    /**
     * Indicates if the request is currently loading
     */
    isLoading: Ref<boolean>;
    /**
     * Indicates if the request was canceled
     */
    aborted: Ref<boolean>;
    /**
     * Any errors that may have occurred
     */
    error: Ref<AxiosError<T> | undefined>;
    errorResponse: ShallowRef<T | undefined>;
    /**
     * Aborts the current request
     */
    abort: (message?: string | undefined) => void;
}
/**
 * Wrapper for axios.
 * @param url
 */
export declare function useAxios<T = any, _D = any, E = any>(url: string, args: AxiosRequestConfig): {
    response: Ref<ApiDataResponse<T> | undefined>;
    finished: Ref<boolean>;
    loading: Ref<boolean>;
    isFinished: Ref<boolean>;
    isLoading: Ref<boolean>;
    cancel: (message?: string) => void;
    canceled: Ref<boolean>;
    aborted: Ref<boolean>;
    abort: (message?: string) => void;
};
export declare function useAsyncAxios<T = any>(url: string, args: AxiosRequestConfig, option?: {
    cancelToken: CancelTokenSource;
}): Promise<T>;
export declare function useAsyncAxiosGenerator<T = any>(url: string, args: AxiosRequestConfig, option?: {
    queryParams?: any;
    page_size: number;
    page?: number;
    deley?: number;
}): any;
//# sourceMappingURL=index.d.ts.map