import { computed, defineComponent, toRef } from "vue";
import { useField } from "vee-validate";
import { VFileInput } from "vuetify/components";

export const VqFileInput = defineComponent({
    name: "VqFileInput",
    props: {
        name: {
            type: String,
            required: true
        }
    },
    components: {
        VFileInput
    },
    setup(props, { attrs, slots }) {
        const name = computed(() => `${props.name}[file]`);
        const { value, errorMessage } = useField(name, undefined, {
            validateOnValueUpdate: false
        });

        return () => (
            <>
                <VFileInput
                    multiple={false}
                    error={!!errorMessage.value}
                    v-model={value.value}
                    error-messages={errorMessage.value}
                    messages={errorMessage.value}
                    v-slots={slots}
                    {...attrs}
                ></VFileInput>
            </>
        );
    }
});

// eslint-disable-next-line no-redeclare
export type VqTextarea = typeof VFileInput & typeof VqFileInput;
