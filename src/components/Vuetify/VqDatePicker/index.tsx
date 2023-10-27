import { computed, defineComponent, toRef } from "vue";
import { useField } from "vee-validate";
import { VDatePicker } from "vuetify/labs/VDatePicker";

export const VqDatePicker = defineComponent({
    name: "VqDatePicker",
    props: {
        name: {
            type: String,
            required: true
        },
        multiple: {
            type: Boolean,
            default: false
        }
    },
    components: {
        VDatePicker
    },
    setup(props, { attrs, slots }) {
        const { value, errorMessage } = useField<any>(toRef(props, "name"), undefined, {
            validateOnValueUpdate: false
        });

        const modelValue = computed<any[]>(() => {
            return props.multiple ? value.value : value.value ? [new Date(value.value)] : undefined;
        });

        const updateValue = (val: readonly any[]) => {
            // /val: string[] | Date[]
            if (props.multiple) value.value = val;
            else value.value = formatDate(val.at(0));
        };

        function formatDate(date: Date | undefined | string) {
            if (!(date instanceof Date)) return date;
            const year = date.toLocaleString("default", { year: "numeric" });
            const month = date.toLocaleString("default", {
                month: "2-digit"
            });
            const day = date.toLocaleString("default", { day: "2-digit" });

            return [year, month, day].join("-");
        }

        return () => (
            <>
                <VDatePicker
                    modelValue={modelValue.value}
                    onUpdate:modelValue={updateValue}
                    color="primary"
                    error-messages={errorMessage.value}
                    v-slots={slots}
                    {...attrs}
                ></VDatePicker>
            </>
        );
    }
});

// eslint-disable-next-line no-redeclare
export type VqDatePicker = typeof VDatePicker & typeof VqDatePicker;
