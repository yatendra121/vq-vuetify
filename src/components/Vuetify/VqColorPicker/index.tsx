import { computed, defineComponent, toRef, toRefs } from "vue";
import { useField } from "vee-validate";
import { VColorPicker } from "vuetify/components";

type Value = string | Record<string, unknown> | null | undefined;

export const VqColorPicker = defineComponent({
    name: "VqColorPicker",
    props: {
        name: {
            type: String,
            required: true
        }
    },
    components: {
        VColorPicker
    },
    setup(props, { attrs, slots }) {
        const { value, errorMessage } = useField<Value>(toRef(props, "name"), undefined, {
            validateOnValueUpdate: false
        });

        const updateValue = (val: string) => {
            value.value = val;
        };

        return () => (
            <>
                <VColorPicker
                    modelValue={value.value}
                    onUpdate:modelValue={updateValue}
                    error-messages={errorMessage.value}
                    v-slots={slots}
                    {...attrs}
                ></VColorPicker>
            </>
        );
    }
});

// eslint-disable-next-line no-redeclare
export type VqColorPicker = typeof VColorPicker & typeof VqColorPicker;
