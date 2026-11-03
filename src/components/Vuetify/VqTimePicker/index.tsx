import { defineComponent, PropType, ref, toRef } from "vue";
import { VTextField, VDialog, VMenu, VTimePicker } from "vuetify/components";
import { openPickerOnKeydown, useVqField } from "../../../composables/field";
import { useVqLocale } from "../../../config/locale";

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
        },
        /** Props for the text field; other attrs go to the VTimePicker. */
        fieldProps: {
            type: Object as PropType<Record<string, unknown>>,
            default: undefined
        }
    },
    setup(props, { attrs, slots }) {
        const { value, errorMessage } = useVqField<string | undefined>(toRef(props, "name"));
        const locale = useVqLocale();

        const modal = ref(false);
        const onKeydown = openPickerOnKeydown(() => (modal.value = true));

        return () => {
            const ViewComponent = props.type ? VDialog : VMenu;
            return (
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
                        {...{ onKeydown }}
                        {...props.fieldProps}
                    >
                        <ViewComponent
                            close-on-content-click={false}
                            v-model={modal.value}
                            activator="parent"
                            width="auto"
                        >
                            <VTimePicker
                                title={locale.selectTime}
                                format="24hr"
                                v-model={value.value}
                                v-slots={slots}
                                {...attrs}
                            ></VTimePicker>
                        </ViewComponent>
                    </VTextField>
                </>
            );
        };
    }
});

 
export type VqTimePicker = typeof VTimePicker & typeof VqTimePicker;
