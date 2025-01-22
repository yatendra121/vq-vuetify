import { defineComponent, toRef } from "vue";
import { useField } from "vee-validate";
import { VFileUpload } from "vuetify/labs/VFileUpload";

export const VqFileUpload = defineComponent({
    name: "VqFileUpload",
    props: {
        name: {
            type: String,
            required: true
        }
    },
    setup(props, { attrs, slots }) {
        const { value, errorMessage } = useField(toRef(props, "name"), undefined, {
            validateOnValueUpdate: false
        });

        setInterval(() => {
            console.log(value.value);
        }, 1000);

        return () => (
            <>
                <VFileUpload
                    // error={!!errorMessage.value}
                    v-model={value.value}
                    error-messages={errorMessage.value}
                    // messages={errorMessage.value}
                    v-slots={slots}
                    {...attrs}
                ></VFileUpload>
            </>
        );
    }
});

// eslint-disable-next-line no-redeclare
export type VqFileUpload = typeof VFileUpload & typeof VqFileUpload;
