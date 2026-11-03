import { computed, defineComponent, PropType, ref, toRef } from "vue";
import { VDatePicker, VDialog, VMenu, VTextField } from "vuetify/components";
import { openPickerOnKeydown, useVqField } from "../../../composables/field";

type DateValue = string | Date;
type Value = DateValue | DateValue[] | undefined;

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

// `new Date("2024-01-15")` is UTC midnight, which is the previous day anywhere
// west of Greenwich. A date-only value has to stay on its calendar day.
const parseDate = (value: DateValue): Date | undefined => {
    const dateOnly = typeof value === "string" ? DATE_ONLY.exec(value) : null;
    const date = dateOnly
        ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
        : new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
};

// Built from the numeric getters: toLocaleString would produce non-Latin digits
// or non-Gregorian years under some locales.
const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
};

export const VqDatePicker = defineComponent({
    name: "VqDatePicker",
    props: {
        name: {
            type: String,
            required: true
        },
        multiple: {
            type: [Boolean, String, Number] as PropType<boolean | "range" | number | string>,
            default: false
        },
        label: {
            type: String,
            default: ""
        },
        type: {
            type: Boolean,
            default: false
        },
        /**
         * Store `YYYY-MM-DD` strings instead of Date objects. A Date is local midnight,
         * so JSON turns it into the previous day anywhere east of Greenwich.
         */
        dateOnly: {
            type: Boolean,
            default: false
        },
        /** Props for the text field; other attrs go to the VDatePicker. */
        fieldProps: {
            type: Object as PropType<Record<string, unknown>>,
            default: undefined
        }
    },
    setup(props, { attrs, slots }) {
        const { value, errorMessage } = useVqField<Value>(toRef(props, "name"));

        const dates = computed(() => {
            const current = value.value;
            if (!current) return [];
            const list = Array.isArray(current) ? current : [current];
            return list.map(parseDate).filter((date): date is Date => !!date);
        });

        const pickerValue = computed(() => (props.multiple ? dates.value : dates.value[0]));
        const displayValue = computed(() => dates.value.map(formatDate).join(", ") || undefined);

        const modal = ref(false);
        const onKeydown = openPickerOnKeydown(() => (modal.value = true));

        const toStoredDate = (val: DateValue) =>
            props.dateOnly && val instanceof Date ? formatDate(val) : val;

        const updateValue = (val: Value) => {
            if (val === undefined) value.value = val;
            else value.value = Array.isArray(val) ? val.map(toStoredDate) : toStoredDate(val);
            if (!props.multiple) modal.value = false;
        };

        return () => {
            const ViewComponent = props.type ? VDialog : VMenu;
            return (
                <>
                    <VTextField
                        modelValue={displayValue.value}
                        error={!!errorMessage.value}
                        error-messages={errorMessage.value}
                        messages={errorMessage.value}
                        active={modal.value}
                        focused={modal.value}
                        label={props.label}
                        readonly
                        {...{ onKeydown }}
                        {...props.fieldProps}
                    >
                        <ViewComponent
                            close-on-content-click={false}
                            v-model={modal.value}
                            activator="parent"
                            width="auto"
                        >
                            <VDatePicker
                                multiple={props.multiple}
                                modelValue={pickerValue.value}
                                onUpdate:modelValue={updateValue}
                                v-slots={slots}
                                {...attrs}
                            ></VDatePicker>
                        </ViewComponent>
                    </VTextField>
                </>
            );
        };
    }
});

 
export type VqDatePicker = typeof VDatePicker & typeof VqDatePicker;
