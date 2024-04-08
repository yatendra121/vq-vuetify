import { defineComponent, ref, toRef } from "vue";
import { useField } from "vee-validate";
import { VTimePicker } from "vuetify/labs/VTimePicker";
import { VTextField, VDialog, VMenu } from "vuetify/components";

export const VqTimePicker = defineComponent({
    name: "VqTimePicker",
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
    components: {
        VTimePicker
    },
    setup(props, { attrs, slots }) {
        const { value, errorMessage } = useField<string | undefined>(
            toRef(props, "name"),
            undefined,
            {
                validateOnValueUpdate: false
            }
        );

        const modal = ref(false);

        const ViewComponent = props.type ? VDialog : VMenu;
        return () => (
            <>
                <VTextField
                    error={!!errorMessage.value}
                    v-model={value.value}
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
                        <VTimePicker
                            title="Select Time"
                            format="24hr"
                            v-model={value.value}
                            v-slots={slots}
                            {...attrs}
                        ></VTimePicker>
                    </ViewComponent>
                </VTextField>
            </>
        );
    }
});
export type VqTimePicker = typeof VTimePicker & typeof VqTimePicker;
