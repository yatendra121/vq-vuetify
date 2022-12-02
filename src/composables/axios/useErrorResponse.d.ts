export default function useErrorResponse(): {
    getErrorResponse: (response: any) => Promise<{
        status: import("vue").ShallowRef<any>;
        statusText: import("vue").ShallowRef<any>;
        eResponse: import("vue").ShallowRef<any>;
    }>;
};
