import { defineComponent, toRef } from "vue";
import { useVqField } from "../../../composables/field";
import { VCheckbox } from "vuetify/components";

const VqCheckboxImpl = defineComponent({
    name: "VqCheckbox",
    props: {
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

 
/** Typed with VCheckbox's props, events and slots, which it passes through. */
export const VqCheckbox = VqCheckboxImpl as typeof VqCheckboxImpl & typeof VCheckbox;
export type VqCheckbox = typeof VCheckbox & typeof VqCheckboxImpl;
