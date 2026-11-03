import { defineComponent, toRef } from "vue";
import { useVqField } from "../../../composables/field";
import { VCheckbox } from "vuetify/components";

export const VqCheckbox = defineComponent({
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

 
export type VqCheckbox = typeof VCheckbox & typeof VqCheckbox;
