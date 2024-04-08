import {
    computed,
    defineComponent,
    h,
    onBeforeUnmount,
    onMounted,
    PropType,
    provide,
    readonly,
    ref,
    toRef,
    toRefs,
    toValue,
    VNode,
    watch
} from "vue";
import { SubmissionHandler, InvalidSubmissionHandler, useForm } from "vee-validate";
import { useAsyncAxios, useErrorResponse } from "@qnx/composables/axios";
import { ApiResponse, objectToFormData } from "@qnx/composables";
import { useFormStore } from "../../../store/reactivity/form";

//types
import type { FormOptions, SubmissionContext, Form as VFormType } from "vee-validate";
import type { AxiosError, Method } from "axios";
import type { ApiResponseValue } from "@qnx/composables";
import type { InitialValues } from "../../../types";

export type GenericFormValues = {
    [key: string]: unknown;
};
export const VqForm = defineComponent({
    props: {
        id: {
            type: String as PropType<string>,
            required: true
        },
        action: {
            type: String as PropType<string>,
            required: true
        },
        method: {
            type: String as PropType<Method>,
            default: () => "POST"
        },
        initialValues: {
            type: Object as PropType<InitialValues | undefined>,
            default: () => undefined
        },
        valuesSchema: {
            type: Object,
            default: () => undefined
        },
        formData: {
            type: Boolean,
            default: () => false
        },
        successResponseHandler: {
            type: Function as PropType<
                (response: ApiResponseValue, actions: SubmissionContext) => void
            >
        },
        errorResponseHandler: {
            type: Function as PropType<
                (response: AxiosError<ApiResponseValue>, actions: SubmissionContext) => void
            >
        },
        validationSchema: {
            type: Object,
            default: undefined
        }
    },
    emits: ["submitedSuccess", "submitedError", "submitedClientError"],
    setup(props, { attrs, emit, slots }) {
        provide("formId", readonly(toRef(props, "id")));

        const formStore = useFormStore();
        onMounted(() => {
            formStore.addForm(props.id);
        });
        onBeforeUnmount(() => formStore.removeForm(props.id));

        const onSubmit: SubmissionHandler<GenericFormValues> = (values, actions) => {
            const postData = props.formData ? objectToFormData(values) : values;

            formStore.changeBusy(props.id, true);

            useAsyncAxios<ApiResponseValue>(props.action, {
                method: props.method,
                data: postData
            })
                .then((response) => {
                    if (props.successResponseHandler) {
                        props.successResponseHandler(response, actions);
                        return;
                    }
                    const apiResponse = new ApiResponse(response);
                    emit("submitedSuccess", apiResponse);
                })
                .catch(async (response: AxiosError<ApiResponseValue>) => {
                    if (props.errorResponseHandler) {
                        props.errorResponseHandler(response, actions);
                        return;
                    }
                    const { getErrorResponse } = useErrorResponse();
                    const { eResponse } = await getErrorResponse(response);
                    if (eResponse.value) {
                        const apiResponse = new ApiResponse(eResponse.value);
                        //@ts-ignore
                        actions.setErrors(apiResponse.getErrors());
                        emit("submitedError", apiResponse);
                    }
                })
                .finally(() => {
                    formStore.changeBusy(props.id, false);
                });
        };

        const { handleSubmit, resetForm } = useForm({
            validationSchema: props.validationSchema,
            initialValues: transformObjValues(props.initialValues, props.valuesSchema)
        });

        const initialValues = toRef(props, "initialValues");
        watch(initialValues, () => {
            resetForm({
                values: transformObjValues(props.initialValues, props.valuesSchema)
            });
        });

        const onFinalSubmit = handleSubmit(onSubmit);

        return () => (
            <>
                {/* @ts-ignore */}
                <form novalidate id={props.id} onSubmit={onFinalSubmit} v-slots={slots} {...attrs}>
                    {slots.default?.()}
                </form>
            </>
        );
    }
});

export interface VqFormOption extends FormOptions<any> {
    formId: string;
    valuesSchema?: any;
    validationSchema?: any;
}

export const useVqForm = (opts: VqFormOption) => {
    const initialValues = computed(() => {
        return transformObjValues(opts.initialValues, opts.valuesSchema);
    });

    const {
        errors,
        errorBag,
        values,
        meta,
        isSubmitting,
        isValidating,
        submitCount,
        controlledValues,
        validate,
        validateField,
        handleReset,
        resetForm,
        handleSubmit,
        setErrors,
        setFieldError,
        setFieldValue,
        setValues,
        setFieldTouched,
        setTouched,
        resetField
    } = useForm({ validationSchema: opts.validationSchema });

    watch(opts.initialValues, () => {
        resetForm({
            values: transformObjValues(toValue(opts.initialValues), opts.valuesSchema)
        });
    });

    const { formId } = opts;

    const VqForm = defineComponent({
        props: {
            action: {
                type: String as PropType<string>,
                required: true
            },
            method: {
                type: String as PropType<Method>,
                default: () => "POST"
            },
            formData: {
                type: Boolean,
                default: () => false
            },
            successResponseHandler: {
                type: Function as PropType<
                    (response: ApiResponseValue, actions: SubmissionContext) => void
                >
            },
            errorResponseHandler: {
                type: Function as PropType<
                    (response: AxiosError<ApiResponseValue>, actions: SubmissionContext) => void
                >
            }
        },
        setup(props, { attrs, emit, slots }) {
            provide("formId", readonly(ref(formId)));

            const formStore = useFormStore();
            onMounted(() => {
                formStore.addForm(formId);
            });
            onBeforeUnmount(() => formStore.removeForm(formId));

            const defaultOnSubmit: SubmissionHandler<GenericFormValues> = (values, actions) => {
                const postData = props.formData ? objectToFormData(values) : values;

                formStore.changeBusy(formId, true);

                useAsyncAxios<ApiResponseValue>(props.action, {
                    method: props.method,
                    data: postData
                })
                    .then((response) => {
                        if (props.successResponseHandler) {
                            props.successResponseHandler(response, actions);
                            return;
                        }
                        const apiResponse = new ApiResponse(response);
                        emit("submitedSuccess", apiResponse);
                    })
                    .catch(async (response: AxiosError<ApiResponseValue>) => {
                        if (props.errorResponseHandler) {
                            props.errorResponseHandler(response, actions);
                            return;
                        }
                        const { getErrorResponse } = useErrorResponse();
                        const { eResponse } = await getErrorResponse(response);
                        if (eResponse.value) {
                            const apiResponse = new ApiResponse(eResponse.value);
                            //@ts-ignore
                            actions.setErrors(apiResponse.getErrors());
                            emit("submitedError", apiResponse);
                        }
                    })
                    .finally(() => {
                        formStore.changeBusy(formId, false);
                    });
            };

            const onSubmit = handleSubmit(defaultOnSubmit);

            return () => (
                <>
                    {/* @ts-ignore */}
                    <form novalidate onSubmit={onSubmit} v-slots={slots} {...attrs}>
                        {slots.default?.()}
                    </form>
                </>
            );
        }
    });

    const wrapper = defineComponent((props: any, { slots }) => {
        // Returning functions in `setup` means this is the render function
        return () => {
            // Event handlers will also be passed in the `props` object
            return h(VqForm, props, slots);
        };
    });

    return { wrapper, resetForm };
};

const transformObjValues = (item: unknown, object: { [key: string]: string } | undefined) => {
    if (!item || !object) return item;
    return { ...item, ...collectFormObjValues(item, object) };
};

const collectFormObjValues = (item: any, object: { [key: string]: string }) => {
    const finalVal: any = [];
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const element = object[key];
            const arrKeys = element.split(".");
            let lastItemValue = item;
            for (const [arrKeyIndex, arrKey] of arrKeys.entries()) {
                if (arrKey === "*") {
                    let newArray: any = [];
                    let index = 0;
                    for (const iterator of lastItemValue) {
                        newArray = [
                            collectFormObjValues(lastItemValue[index++], {
                                key: arrKeys.slice(arrKeyIndex + 1).join(".")
                            }).key,
                            ...newArray
                        ];
                    }
                    lastItemValue = newArray;
                    break;
                } else if (typeof arrKey === "string") {
                    lastItemValue = lastItemValue?.[arrKey];
                }
            }
            finalVal[key] = lastItemValue ?? object;
        }
    }
    console.log({ finalVal });
    return finalVal;
};

// eslint-disable-next-line no-redeclare
export type VqForm = typeof VFormType & typeof VqForm;
