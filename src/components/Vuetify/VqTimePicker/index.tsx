import { defineComponent, PropType, ref, toRef } from "vue";
import { VTextField, VDialog, VMenu, VTimePicker } from "vuetify/components";
import type { ComponentInstance } from "../../../types/component";
import { openPickerOnKeydown, splitPickerAttrs, useVqField } from "../../../composables/field";
import { useVqLocale } from "../../../config/locale";

const VqTimePickerImpl = defineComponent({
    name: "VqTimePicker",
    // Attrs are placed by hand; the picker's aren't read until its menu first opens.
    inheritAttrs: false,
    props: {
        /** Path of the field in the enclosing form's values, e.g. `email` or `address.city`. */
        name: {
            type: String,
            required: true
        },
        /** Label of the text field. */
        label: {
            type: String,
            default: ""
        },
        /** Open the picker in a dialog instead of a menu. */
        type: {
            type: Boolean,
            default: false
        },
        /** Props for the text field; other attrs go to the VTimePicker. */
        fieldProps: {
            type: Object as PropType<ComponentInstance<typeof VTextField>["$props"]>,
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

 
/**
 * A read-only text field that opens a `VTimePicker` in a menu (or a dialog with `type`) and
 * binds the picked time to the form field `name`, showing its validation error.
 * Other attrs, events and slots go to the VTimePicker; `fieldProps` goes to the text field.
 */
export const VqTimePicker = VqTimePickerImpl as typeof VqTimePickerImpl & typeof VTimePicker;
export type VqTimePicker = typeof VTimePicker & typeof VqTimePickerImpl;
