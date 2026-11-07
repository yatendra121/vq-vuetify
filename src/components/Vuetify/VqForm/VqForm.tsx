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
import { SubmissionHandler, useForm, type GenericObject } from "vee-validate";
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

// axios's methods are suggested, but any string is accepted, as axios itself does.
type SubmitMethod = Method | (string & {});

export type GenericFormValues = {
    [key: string]: unknown;
};

const submitProps = {
    /** URL the values are submitted to. */
    action: {
        type: String as PropType<string>,
        required: true as const
    },
    /** HTTP method of the request. */
    method: {
        type: String as PropType<SubmitMethod>,
        default: () => "POST"
    },
    /** Send the values as `multipart/form-data` (needed for files) instead of JSON. */
    formData: {
        type: Boolean,
        default: () => false
    },
    /** Handles a successful response instead of emitting `submitedSuccess`. */
    successResponseHandler: {
        type: Function as PropType<
            (response: ApiResponseValue, actions: SubmissionContext) => void
        >
    },
    /**
     * Handles a failed request instead of the default: showing 422 field errors and
     * emitting `submitedError` or `submitedRequestError`.
     */
    errorResponseHandler: {
        type: Function as PropType<
            (response: AxiosError<ApiResponseValue>, actions: SubmissionContext) => void
        >
    }
};

interface SubmitProps {
    action: string;
    method: SubmitMethod;
    formData: boolean;
    successResponseHandler?: (response: ApiResponseValue, actions: SubmissionContext) => void;
    errorResponseHandler?: (
        response: AxiosError<ApiResponseValue>,
        actions: SubmissionContext
    ) => void;
}

// Success and error carry an ApiResponse. The other two keep untyped payloads:
// typing them `unknown` would break handlers such as `(e) => e.message`.
const submitEmits = {
    /** The request succeeded (and no `successResponseHandler` is set). */
    submitedSuccess: (_response: ApiResponse) => true,
    /** The server rejected the values (400, 401 or 422); field errors are already shown. */
    submitedError: (_response: ApiResponse) => true,
    /** Client-side validation failed, so nothing was sent. Gets vee-validate's invalid-submission context. */
    submitedClientError: null,
    /** The request failed without a usable error response (5xx, network error). Gets the AxiosError. */
    submitedRequestError: null
};

interface SubmitEmit {
    (event: "submitedSuccess", response: ApiResponse): void;
    (event: "submitedError", response: ApiResponse): void;
    (event: "submitedClientError", payload: unknown): void;
    (event: "submitedRequestError", payload: unknown): void;
}

/**
 * Shared submit pipeline of VqForm and useVqForm: validation, the request, busy
 * state and routing the outcome to handlers / events.
 */
const createSubmitHandler = (
    getFormId: () => string,
    props: SubmitProps,
    emit: SubmitEmit,
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

/**
 * A form that validates its Vq* fields with vee-validate, then submits their values to
 * `action` and reports the outcome through its events. Server validation errors (422)
 * are shown on the matching fields.
 */
export const VqForm = defineComponent({
    name: "VqForm",
    props: {
        /** Unique id of the form; a `VqSubmitBtn` outside the form targets it with `form`. */
        id: {
            type: String as PropType<string>,
            required: true
        },
        ...submitProps,
        /** Starting values; a new object resets the form to it. */
        initialValues: {
            type: Object as PropType<InitialValues | undefined>,
            default: () => undefined
        },
        /**
         * Maps form fields to paths in `initialValues`, e.g. `{ city: "address.city" }`
         * or `{ tagIds: "tags.*.id" }`.
         */
        valuesSchema: {
            type: Object as PropType<Record<string, string>>,
            default: () => undefined
        },
        /** vee-validate schema: a yup/zod typed schema or an object of rules per field. */
        validationSchema: {
            type: Object,
            default: undefined
        }
    },
    emits: submitEmits,
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

/** The form component `useVqForm` returns, bound to the form it created. */
const defineFormWrapper = (formId: string, handleSubmit: FormContext<any>["handleSubmit"]) =>
    defineComponent({
        props: submitProps,
        emits: submitEmits,
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

/**
 * The form component of `useVqForm`: a `<form>` that submits the values of the form
 * `useVqForm` created to `action`, with VqForm's submit props and events.
 */
export type VqFormWrapper = ReturnType<typeof defineFormWrapper>;

/**
 * Pass a type argument to type the form's values: `useVqForm<MyValues>({...})`.
 * Without one, values stay untyped (`any`) as before; they are never inferred
 * from `initialValues`, since that would reject reads of fields not listed there.
 */
export interface VqFormOption<TValues extends GenericObject = any> extends FormOptions<TValues> {
    /** Unique id of the form; a `VqSubmitBtn` outside the form targets it with `form`. */
    formId: string;
    /** Maps form fields to paths in `initialValues`, as VqForm's `values-schema` does. */
    valuesSchema?: any;
    /** vee-validate schema: a yup/zod typed schema or an object of rules per field. */
    validationSchema?: any;
}

export interface UseVqFormReturn<TValues extends GenericObject = any> {
    /** The form component to render; its fields read and write this form's values. */
    wrapper: VqFormWrapper;
    resetForm: FormContext<TValues>["resetForm"];
    values: FormContext<TValues>["values"];
    errors: FormContext<TValues>["errors"];
    meta: FormContext<TValues>["meta"];
    setFieldValue: FormContext<TValues>["setFieldValue"];
    setValues: FormContext<TValues>["setValues"];
    setErrors: FormContext<TValues>["setErrors"];
    validate: FormContext<TValues>["validate"];
}

/**
 * Creates a form in script, for access to its values and helpers (`setFieldValue`,
 * `resetForm`, ...). Render the returned `wrapper` around the Vq* fields.
 *
 * @example
 * const { wrapper: Form, values } = useVqForm<{ email: string }>({ formId: "login" });
 * // <Form action="login" @submited-success="onLogin"><VqTextField name="email" /></Form>
 */
export const useVqForm = <TValues extends GenericObject = any>(
    opts: VqFormOption<NoInfer<TValues>>
): UseVqFormReturn<TValues> => {
    const { formId, valuesSchema, ...formOptions } = opts;

    const form = useForm<TValues>({
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

    const VqForm = defineFormWrapper(formId, handleSubmit);

    const wrapper = defineComponent((props: any, { slots }) => {
        // Returning functions in `setup` means this is the render function
        return () => {
            // Event handlers will also be passed in the `props` object
            return h(VqForm, props, slots);
        };
    }) as unknown as VqFormWrapper;

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

const resolveSchemaPath = (item: unknown, segments: string[]): unknown => {
    let current = item;
    for (const [index, segment] of segments.entries()) {
        if (segment === "*") {
            if (!Array.isArray(current)) return undefined;
            const rest = segments.slice(index + 1);
            return current.map((element) => resolveSchemaPath(element, rest));
        }
        current = (current as Record<string, unknown> | null | undefined)?.[segment];
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
