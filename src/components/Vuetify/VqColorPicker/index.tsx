import { computed, defineComponent, ref, toRef, toRefs } from "vue";
import { useField } from "vee-validate";
import { VColorPicker, VDialog, VMenu, VTextField } from "vuetify/components";

type Value = string | Record<string, unknown> | null | undefined;

export const VqColorPicker = defineComponent({
    name: "VqColorPicker",
    props: {
        name: {
            type: String,
            required: true
        },
        label: {
            type: String,
            default: ""
        },
        type: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { attrs, slots }) {
        const { value, errorMessage } = useField<Value>(toRef(props, "name"), undefined, {
            validateOnValueUpdate: false
        });

        const modal = ref(false);

        const ViewComponent = props.type ? VDialog : VMenu;

        return () => (
            <>
                <VTextField
                    modelValue={value.value}
                    error={!!errorMessage.value}
                    error-messages={errorMessage.value}
                    messages={errorMessage.value}
                    active={modal.value}
                    focused={modal.value}
                    label={props.label}
                    readonly
                >
                    <ViewComponent
                        close-on-content-click={false}
                        v-model={modal.value}
                        activator="parent"
                        width="auto"
                    >
                        <VColorPicker
                            v-model={value.value}
                            v-slots={slots}
                            {...attrs}
                        ></VColorPicker>
                    </ViewComponent>
                </VTextField>
            </>
        );
    }
});

// eslint-disable-next-line no-redeclare
export type VqColorPicker = typeof VColorPicker & typeof VqColorPicker;
