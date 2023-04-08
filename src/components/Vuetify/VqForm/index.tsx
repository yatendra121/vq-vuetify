import { computed, defineComponent, onBeforeUnmount, onMounted, PropType } from "vue";
import { Form as VForm, SubmissionHandler, InvalidSubmissionHandler } from "vee-validate";
import { useAsyncAxios, useErrorResponse, objectToFormData } from "@qnx/composables/axios";
import { ApiResponse } from "@qnx/composables";
import { useFormStore } from "../../../store/reactivity/form";

//types
import type { Form as VFormType } from "vee-validate";
import type { AxiosError, Method } from "axios";
import type { ApiResponseValue } from "@qnx/composables";
import type { InitialValues } from "../../../types";

export type GenericFormValues = {
    [key: string]: unknown;
};
export const VqForm = defineComponent({
    components: {
        VForm
    },
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
        }
    },
    emits: ["submitedSuccess", "submitedError", "submitedClientError"],
    setup(props, { attrs, emit, slots }) {
        const initialValues = computed(() => {
            return transformObjValues(props.initialValues, props.valuesSchema);
        });
        const formStore = useFormStore();
        onMounted(() => {
            formStore.addForm(props.id);
        });

        onBeforeUnmount(() => formStore.removeForm(props.id));

        // const initialValues = ref(
        //   transformObjValues(props.initialValues, props.valuesSchema)
        // )
        const onSubmit: SubmissionHandler<GenericFormValues> = (values, actions) => {
            const postData = props.formData ? objectToFormData(values) : values;

            formStore.changeBusy(props.id, true);

            useAsyncAxios<ApiResponseValue>(props.action, {
                method: props.method,
                data: postData
            })
                .then((response) => {
                    const apiResponse = new ApiResponse(response);
                    emit("submitedSuccess", apiResponse);
                })
                .catch(async (response: AxiosError<ApiResponseValue>) => {
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

        return () => (
            <>
                <VForm
                    //@ts-ignore
                    id={props.id}
                    onSubmit={(e, actions) => onSubmit(e, actions)}
                    onInvalidSubmit={(e) => emit("submitedClientError", e)}
                    initial-values={initialValues.value}
                    v-slots={slots}
                    {...attrs}
                >
                    <>{slots.default?.()}</>
                </VForm>
            </>
        );
    }
});

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
