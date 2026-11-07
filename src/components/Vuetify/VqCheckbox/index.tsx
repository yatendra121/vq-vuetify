import { defineComponent, toRef } from "vue";
import { useVqField } from "../../../composables/field";
import { VCheckbox } from "vuetify/components";

const VqCheckboxImpl = defineComponent({
    name: "VqCheckbox",
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
                <VCheckbox
                    error={!!errorMessage.value}
                    v-model={value.value}
                    error-messages={errorMessage.value}
                    messages={errorMessage.value}
                    v-slots={slots}
                    {...attrs}
                ></VCheckbox>
            </>
        );
    }
});

 
/**
 * A `v-checkbox` bound to the form field `name`: it shows the field's value and its
 * validation error. Takes every VCheckbox prop, event and slot.
 */
export const VqCheckbox = VqCheckboxImpl as typeof VqCheckboxImpl & typeof VCheckbox;
export type VqCheckbox = typeof VCheckbox & typeof VqCheckboxImpl;
