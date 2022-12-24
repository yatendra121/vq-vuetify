import { PropType } from "vue";
import type { Form as VFormType } from "vee-validate";
import type { Method } from "axios";
import type { InitialValues } from "../../types";
export type GenericFormValues = {
    [key: string]: unknown;
};
export declare const VqForm: import("vue").DefineComponent<{
    id: {
        type: PropType<string>;
        required: true;
    };
    action: {
        type: PropType<string>;
        required: true;
    };
    method: {
        type: PropType<Method>;
        default: () => string;
    };
    initialValues: {
        type: PropType<InitialValues>;
        default: () => undefined;
    };
    valuesSchema: {
        type: ObjectConstructor;
        default: () => undefined;
    };
    formData: {
        type: BooleanConstructor;
        default: () => boolean;
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("submitedSuccess" | "submitedError" | "submitedClientError")[], "submitedSuccess" | "submitedError" | "submitedClientError", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    id: {
        type: PropType<string>;
        required: true;
    };
    action: {
        type: PropType<string>;
        required: true;
    };
    method: {
        type: PropType<Method>;
        default: () => string;
    };
    initialValues: {
        type: PropType<InitialValues>;
        default: () => undefined;
    };
    valuesSchema: {
        type: ObjectConstructor;
        default: () => undefined;
    };
    formData: {
        type: BooleanConstructor;
        default: () => boolean;
    };
}>> & {
    onSubmitedSuccess?: ((...args: any[]) => any) | undefined;
    onSubmitedError?: ((...args: any[]) => any) | undefined;
    onSubmitedClientError?: ((...args: any[]) => any) | undefined;
}, {
    method: Method;
    initialValues: InitialValues;
    valuesSchema: Record<string, any>;
    formData: boolean;
}>;
export type VqForm = typeof VFormType & typeof VqForm;
//# sourceMappingURL=VqForm.d.ts.map