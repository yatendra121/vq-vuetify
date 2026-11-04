import { defineComponent, toRef } from "vue";
import { useVqField } from "../../../composables/field";
import { VFileUpload } from "vuetify/components";

export const VqFileUpload = defineComponent({
    name: "VqFileUpload",
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
                <VFileUpload
                    v-model={value.value}
                    error-messages={errorMessage.value}
                    v-slots={slots}
                    {...attrs}
                ></VFileUpload>
            </>
        );
    }
});

export type VqFileUpload = typeof VFileUpload & typeof VqFileUpload;
