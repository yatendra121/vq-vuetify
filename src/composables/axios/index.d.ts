import type { Ref } from 'vue';
import type { AxiosError, AxiosResponse } from 'axios';
export interface UseAxiosReturn<T> {
    /**
     * Axios Response
     */
    response: Ref<AxiosResponse<T> | undefined>;
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
    errorResponse: any;
    /**
     * Aborts the current request
     */
    abort: (message?: string | undefined) => void;
}
/**
 * Wrapper for axios.
 *
 * @param url
 * @param config
 */
export declare function useAxios<T = any>(url: string, args: any): {
    response: import("vue").ShallowRef<AxiosResponse<T, any>>;
    data: import("vue").ShallowRef<T>;
    error: import("vue").ShallowRef<AxiosError<T, any>>;
    finished: Ref<boolean>;
    loading: Ref<boolean>;
    isFinished: Ref<boolean>;
    isLoading: Ref<boolean>;
    cancel: (message?: string) => void;
    canceled: Ref<boolean>;
    aborted: Ref<boolean>;
    abort: (message?: string) => void;
};
