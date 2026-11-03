import { defineComponent, toRef } from "vue";
import { useVqField } from "../../../composables/field";
import { VTextarea } from "vuetify/components";

export const VqTextarea = defineComponent({
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

 
export type VqTextarea = typeof VTextarea & typeof VqTextarea;
