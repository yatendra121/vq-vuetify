import { defineComponent, PropType, ref, toRef } from "vue";
import { VTextField, VDialog, VMenu, VTimePicker } from "vuetify/components";
import { openPickerOnKeydown, splitPickerAttrs, useVqField } from "../../../composables/field";
import { useVqLocale } from "../../../config/locale";

const VqTimePickerImpl = defineComponent({
    name: "VqTimePicker",
    // Attrs are placed by hand; the picker's aren't read until its menu first opens.
    inheritAttrs: false,
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
            const { fieldAttrs, pickerAttrs } = splitPickerAttrs(attrs);
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
                        {...fieldAttrs}
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
                                {...pickerAttrs}
                            ></VTimePicker>
                        </ViewComponent>
                    </VTextField>
                </>
            );
        };
    }
});

 
/** Typed with VTimePicker's props, events and slots, which it passes through. */
export const VqTimePicker = VqTimePickerImpl as typeof VqTimePickerImpl & typeof VTimePicker;
export type VqTimePicker = typeof VTimePicker & typeof VqTimePickerImpl;
