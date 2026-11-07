import { defineComponent, toRef } from "vue";
import { VMessages, VOtpInput } from "vuetify/components";
import { useVqField } from "../../../composables/field";

const VqOtpInputImpl = defineComponent({
    name: "VqOtpInput",
    props: {
        name: {
            type: String,
            required: true
        }
    },
    setup(props, { attrs, slots }) {
        const { value, resetField, errorMessage } = useVqField<string | undefined>(
            toRef(props, "name")
        );

        // Default to empty without discarding a value from the form's initialValues.
        if (value.value === undefined) resetField({ value: "" });

        return () => (
            <>
                <VOtpInput
                    baseColor="primary"
                    error={!!errorMessage.value}
                    v-model={value.value}
                    v-slots={slots}
                    {...attrs}
                ></VOtpInput>
                {/* VOtpInput has no error-messages prop of its own. */}
                {errorMessage.value && (
                    <VMessages active color="error" messages={errorMessage.value}></VMessages>
                )}
            </>
        );
    }
});

 
/** Typed with VOtpInput's props, events and slots, which it passes through. */
export const VqOtpInput = VqOtpInputImpl as typeof VqOtpInputImpl & typeof VOtpInput;
export type VqOtpInput = typeof VOtpInput & typeof VqOtpInputImpl;
