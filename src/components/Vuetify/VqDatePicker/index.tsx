import { computed, defineComponent, toRef, toRefs } from "vue";
import { useField } from "vee-validate";
import { VDatePicker } from "vuetify/components";

type Value = string | Date;

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
        const { name } = toRefs(props);
        const { value, errorMessage } = useField<Value | undefined>(name, undefined, {
            validateOnValueUpdate: false
        });

        const modelValue = computed(() => {
            return value.value ? new Date(value.value) : undefined;
            //return props.multiple ? value.value : value.value ? [new Date(value.value)] : undefined;
        });

        const updateValue = (val: Value) => {
            value.value = val;

            // /val: string[] | Date[]
            // if (props.multiple) value.value = val;
            // else value.value = formatDate(val);
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
