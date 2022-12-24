import type { AxiosError } from 'axios';
export default function useErrorResponse(): {
    getErrorResponse: <T>(response: AxiosError<T, any>) => Promise<{
        status: import("vue").ShallowRef<any>;
        statusText: import("vue").ShallowRef<any>;
        eResponse: import("vue").ShallowRef<T | undefined>;
    }>;
};
//# sourceMappingURL=useErrorResponse.d.ts.map