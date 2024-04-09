import { defineComponent, toRef } from "vue";
import { useField } from "vee-validate";
import { VOtpInput } from "vuetify/components";

export const VqOtpInput = defineComponent({
    name: "VqOtpInput",
    props: {
        name: {
            type: String,
            required: true
        }
    },
    components: {
        VOtpInput
    },
    setup(props, { attrs, slots }) {
        const { value, resetField, errorMessage } = useField(toRef(props, "name"), undefined, {
            validateOnValueUpdate: false
        });

        resetField({ value: "" });

        return () => (
            <>
                <VOtpInput
                    baseColor="primary"
                    error={!!errorMessage.value}
                    v-model={value.value}
                    error-messages={errorMessage.value}
                    v-slots={slots}
                    {...attrs}
                ></VOtpInput>
            </>
        );
    }
});

// eslint-disable-next-line no-redeclare
export type VqOtpInput = typeof VOtpInput & typeof VqOtpInput;
