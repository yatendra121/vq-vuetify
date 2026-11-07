import { defineComponent, toRef } from "vue";
import { useVqField } from "../../../composables/field";
import { VTextarea } from "vuetify/components";

const VqTextareaImpl = defineComponent({
    name: "VqTextarea",
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
                <VTextarea
                    error={!!errorMessage.value}
                    v-model={value.value}
                    error-messages={errorMessage.value}
                    messages={errorMessage.value}
                    v-slots={slots}
                    {...attrs}
                ></VTextarea>
            </>
        );
    }
});

 
/**
 * A `v-textarea` bound to the form field `name`: it shows the field's value and its
 * validation error. Takes every VTextarea prop, event and slot.
 */
export const VqTextarea = VqTextareaImpl as typeof VqTextareaImpl & typeof VTextarea;
export type VqTextarea = typeof VTextarea & typeof VqTextareaImpl;
