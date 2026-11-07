import { defineComponent, toRef } from "vue";
import { useVqField } from "../../../composables/field";
import { VTextarea } from "vuetify/components";

const VqTextareaImpl = defineComponent({
    name: "VqTextarea",
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

 
/** Typed with VTextarea's props, events and slots, which it passes through. */
export const VqTextarea = VqTextareaImpl as typeof VqTextareaImpl & typeof VTextarea;
export type VqTextarea = typeof VTextarea & typeof VqTextareaImpl;
