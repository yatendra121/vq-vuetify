import { defineComponent, PropType, toRef } from "vue";
import { VTextField } from "vuetify/components";
import { useField } from "vee-validate";
import { collectValidationListeners } from "../config";

export const VqTextField = defineComponent({
    name: "VqTextField",
    props: {
        name: {
            type: String,
            required: true
        }
    },
    components: {
        VTextField
    },
    setup(props, { attrs, slots }) {
        const { value, errorMessage, handleChange } = useField(toRef(props, "name"), undefined, {
            validateOnValueUpdate: false
        });

        const validationListeners = collectValidationListeners({
            handleChange,
            errorMessage
        });

        return () => (
            <>
                <VTextField
                    error={!!errorMessage.value}
                    v-model={value.value}
                    error-messages={errorMessage.value}
                    messages={errorMessage.value}
                    v-slots={slots}
                    {...attrs}
                    // onChange={handleChange}
                    // onInput={validationListeners.value.input}
                    // onBlur={handleChange}
                ></VTextField>
            </>
        );
    }
});

// eslint-disable-next-line no-redeclare
export type VqTextField = typeof VTextField & typeof VqTextField;
