import { defineComponent, toRef } from "vue";
import { VTextField } from "vuetify/components";
import { useVqField } from "../../../composables/field";

const VqTextFieldImpl = defineComponent({
    name: "VqTextField",
    props: {
        /** Path of the field in the enclosing form's values, e.g. `email` or `address.city`. */
        name: {
            type: String,
            required: true
        }
    },
    setup(props, { attrs, slots }) {
        const { value, errorMessage } = useVqField(toRef(props, "name"));

        return () => (
            <>
                <VTextField
                    error={!!errorMessage.value}
                    v-model={value.value}
                    error-messages={errorMessage.value}
                    messages={errorMessage.value}
                    v-slots={slots}
                    {...attrs}
                ></VTextField>
            </>
        );
    }
});

/**
 * A `v-text-field` bound to the form field `name`: it shows the field's value and its
 * validation error. Takes every VTextField prop, event and slot.
 */
export const VqTextField = VqTextFieldImpl as typeof VqTextFieldImpl & typeof VTextField;
export type VqTextField = InstanceType<typeof VTextField & typeof VqTextFieldImpl>;
