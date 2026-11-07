import { defineComponent, toRef } from "vue";
import { useVqField } from "../../../composables/field";
import { VFileUpload } from "vuetify/components";

const VqFileUploadImpl = defineComponent({
    name: "VqFileUpload",
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

 
/**
 * A `v-file-upload` bound to the form field `name`: it shows the field's value and its
 * validation error. Takes every VFileUpload prop, event and slot.
 */
export const VqFileUpload = VqFileUploadImpl as typeof VqFileUploadImpl & typeof VFileUpload;
export type VqFileUpload = typeof VFileUpload & typeof VqFileUploadImpl;
