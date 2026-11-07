import { defineComponent, toRef } from "vue";
import { useVqField } from "../../../composables/field";
import { VFileUpload } from "vuetify/components";

const VqFileUploadImpl = defineComponent({
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

 
/** Typed with VFileUpload's props, events and slots, which it passes through. */
export const VqFileUpload = VqFileUploadImpl as typeof VqFileUploadImpl & typeof VFileUpload;
export type VqFileUpload = typeof VFileUpload & typeof VqFileUploadImpl;
