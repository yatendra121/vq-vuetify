import { defineComponent, toRef } from "vue";
import { VTextField } from "vuetify/components";
import { useVqField } from "../../../composables/field";

export const VqTextField = defineComponent({
    name: "VqTextField",
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

export type VqTextField = InstanceType<typeof VTextField & typeof VqTextField>;
