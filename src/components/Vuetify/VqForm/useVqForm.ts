import {
    computed,
    defineComponent,
    onBeforeUnmount,
    onMounted,
    PropType,
    provide,
    readonly,
    toRef,
    toRefs
} from "vue";
import {
    Form as VForm,
    SubmissionHandler,
    InvalidSubmissionHandler,
    useForm,
    FormOptions
} from "vee-validate";
import { useAsyncAxios, useErrorResponse } from "@qnx/composables/axios";
import { ApiResponse,objectToFormData } from "@qnx/composables";
import { useFormStore } from "../../../store/reactivity/form";

//types
import type { SubmissionContext, Form as VFormType } from "vee-validate";
import type { AxiosError, Method } from "axios";
import type { ApiResponseValue } from "@qnx/composables";
import type { InitialValues } from "../../../types";

const veeFormProps = {
    as: {
        type: null as unknown as PropType<string | null>,
        default: "form"
    },
    validationSchema: {
        type: Object,
        default: undefined
    },
    initialErrors: {
        type: Object,
        default: undefined
    },
    initialTouched: {
        type: Object,
        default: undefined
    },
    validateOnMount: {
        type: Boolean,
        default: false
    },
    onSubmit: {
        type: Function as PropType<SubmissionHandler>,
        default: undefined
    },
    onInvalidSubmit: {
        type: Function as PropType<InvalidSubmissionHandler>,
        default: undefined
    },
    keepValues: {
        type: Boolean,
        default: false
    }
};

const vqFormProps = {
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
        type: Function as PropType<(response: ApiResponseValue, actions: SubmissionContext) => void>
    },
    errorResponseHandler: {
        type: Function as PropType<
            (response: AxiosError<ApiResponseValue>, actions: SubmissionContext) => void
        >
    }
};

export type GenericFormValues = {
    [key: string]: unknown;
};
export const VqForm = defineComponent({
    components: {
        VForm
    },
    props: { ...veeFormProps, ...vqFormProps },
    emits: ["submitedSuccess", "submitedError", "submitedClientError"],
    setup(props, { attrs, emit, slots }) {
        provide("formId", readonly(toRef(props, "id")));

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
        } = useForm({
            validationSchema: props.validationSchema,
            initialValues: props.initialValues,
            initialErrors: props.initialErrors,
            initialTouched: props.initialTouched,
            validateOnMount: props.validateOnMount,
            keepValuesOnUnmount: props.keepValues
        });

        return () => <></>;
    }
});

const test = (opts: FormOptions<any>) => {
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
    } = useForm(opts);
};
