import {
    defineComponent,
    h,
    isReactive,
    isRef,
    onBeforeUnmount,
    onMounted,
    PropType,
    provide,
    readonly,
    ref,
    toRef,
    toValue,
    watch
} from "vue";
import { SubmissionHandler, useForm } from "vee-validate";
import { useAsyncAxios, useErrorResponse } from "@qnx/composables/axios";
import { ApiResponse, objectToFormData } from "@qnx/composables";
import { useFormStore } from "../../../store/reactivity/form";

//types
import type {
    FormContext,
    FormOptions,
    SubmissionContext,
    Form as VFormType
} from "vee-validate";
import type { AxiosError, Method } from "axios";
import type { ApiResponseValue } from "@qnx/composables";
import type { InitialValues } from "../../../types";

export type GenericFormValues = {
    [key: string]: unknown;
};

const submitProps = {
    action: {
        type: String as PropType<string>,
        required: true as const
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
};

interface SubmitProps {
    action: string;
    method: Method;
    formData: boolean;
    successResponseHandler?: (response: ApiResponseValue, actions: SubmissionContext) => void;
    errorResponseHandler?: (
        response: AxiosError<ApiResponseValue>,
        actions: SubmissionContext
    ) => void;
}

type SubmitEvent =
    | "submitedSuccess"
    | "submitedError"
    | "submitedClientError"
    | "submitedRequestError";

/**
 * Shared submit pipeline of VqForm and useVqForm: validation, the request, busy
 * state and routing the outcome to handlers / events.
 */
const createSubmitHandler = (
    getFormId: () => string,
    props: SubmitProps,
    emit: (event: SubmitEvent, payload: unknown) => void,
    handleSubmit: FormContext<any>["handleSubmit"]
) => {
    const formStore = useFormStore();

    const onFailure = async (
        response: AxiosError<ApiResponseValue>,
        actions: SubmissionContext
    ) => {
        if (props.errorResponseHandler) {
            props.errorResponseHandler(response, actions);
            return;
        }

        // getErrorResponse only resolves for 400/401/422 and throws for anything
        // else (500s, network failures).
        let errorValue: ApiResponseValue | undefined;
        try {
            const { getErrorResponse } = useErrorResponse();
            const { eResponse } = await getErrorResponse(response);
            errorValue = eResponse.value;
        } catch {
            console.error(response);
            emit("submitedRequestError", response);
            return;
        }

        if (errorValue) {
            const apiResponse = new ApiResponse(errorValue);
            const errors = apiResponse.getErrors();
            if (errors) actions.setErrors(errors);
            emit("submitedError", apiResponse);
        }
    };

    const onSubmit: SubmissionHandler<GenericFormValues> = (values, actions) => {
        const formId = getFormId();

        // Pressing Enter in a field submits implicitly, even while the submit
        // button shows its loading state.
        if (formStore.forms[formId]?.busy) return;

        const postData = props.formData ? objectToFormData(values) : values;

        formStore.changeBusy(formId, true);

        return useAsyncAxios<ApiResponseValue>(props.action, {
            method: props.method,
            data: postData
        })
            .then(
                (response) => {
                    if (props.successResponseHandler) {
                        props.successResponseHandler(response, actions);
                        return;
                    }
                    emit("submitedSuccess", new ApiResponse(response));
                },
                (response: AxiosError<ApiResponseValue>) => onFailure(response, actions)
            )
            .finally(() => {
                formStore.changeBusy(formId, false);
            });
    };

    return handleSubmit(onSubmit, (context) => emit("submitedClientError", context));
};

export const VqForm = defineComponent({
    name: "VqForm",
    props: {
        id: {
            type: String as PropType<string>,
            required: true
        },
        ...submitProps,
        initialValues: {
            type: Object as PropType<InitialValues | undefined>,
            default: () => undefined
        },
        valuesSchema: {
            type: Object,
            default: () => undefined
        },
        validationSchema: {
            type: Object,
            default: undefined
        }
    },
    emits: ["submitedSuccess", "submitedError", "submitedClientError", "submitedRequestError"],
    setup(props, { attrs, emit, slots }) {
        provide("formId", readonly(toRef(props, "id")));

        const formStore = useFormStore();
        onMounted(() => {
            formStore.addForm(props.id);
        });
        watch(
            () => props.id,
            (newId, oldId) => {
                formStore.removeForm(oldId);
                formStore.addForm(newId);
            }
        );
        onBeforeUnmount(() => formStore.removeForm(props.id));

        // Same guard as vee-validate's own <Form>: useForm only enables schema
        // validation for a schema present at creation, but then follows the ref.
        const validationSchema = toRef(props, "validationSchema");
        const { handleSubmit, resetForm } = useForm({
            validationSchema: validationSchema.value ? validationSchema : undefined,
            initialValues: transformObjValues(props.initialValues, props.valuesSchema)
        });

        const initialValues = toRef(props, "initialValues");
        watch(initialValues, () => {
            resetForm({
                values: transformObjValues(props.initialValues, props.valuesSchema)
            });
        });

        const onFinalSubmit = createSubmitHandler(() => props.id, props, emit, handleSubmit);

        return () => (
            <>
                <form novalidate id={props.id} onSubmit={onFinalSubmit} {...attrs}>
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
    const { formId, valuesSchema, ...formOptions } = opts;

    const form = useForm({
        ...formOptions,
        initialValues: transformObjValues(toValue(opts.initialValues), valuesSchema)
    });
    const { resetForm, handleSubmit } = form;

    // Plain objects are valid `initialValues` too; only reactive sources can change.
    const source = opts.initialValues as unknown;
    if (isRef(source) || isReactive(source) || typeof source === "function") {
        watch(source as () => unknown, () => {
            resetForm({
                values: transformObjValues(toValue(opts.initialValues), valuesSchema)
            });
        });
    }

    const VqForm = defineComponent({
        props: submitProps,
        emits: ["submitedSuccess", "submitedError", "submitedClientError", "submitedRequestError"],
        setup(props, { attrs, emit, slots }) {
            provide("formId", readonly(ref(formId)));

            const formStore = useFormStore();
            onMounted(() => {
                formStore.addForm(formId);
            });
            onBeforeUnmount(() => formStore.removeForm(formId));

            const onSubmit = createSubmitHandler(() => formId, props, emit, handleSubmit);

            return () => (
                <>
                    <form novalidate id={formId} onSubmit={onSubmit} {...attrs}>
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

    return {
        wrapper,
        resetForm,
        values: form.values,
        errors: form.errors,
        meta: form.meta,
        setFieldValue: form.setFieldValue,
        setValues: form.setValues,
        setErrors: form.setErrors,
        validate: form.validate
    };
};

const resolveSchemaPath = (item: any, segments: string[]): unknown => {
    let current = item;
    for (const [index, segment] of segments.entries()) {
        if (segment === "*") {
            if (!Array.isArray(current)) return undefined;
            const rest = segments.slice(index + 1);
            return current.map((element) => resolveSchemaPath(element, rest));
        }
        current = current?.[segment];
    }
    return current;
};

const transformObjValues = (item: any, schema: { [key: string]: string } | undefined) => {
    if (!item || !schema) return item;
    const mapped: Record<string, unknown> = {};
    for (const [key, path] of Object.entries(schema)) {
        mapped[key] = resolveSchemaPath(item, path.split("."));
    }
    return { ...item, ...mapped };
};

export type VqForm = typeof VFormType & typeof VqForm;
