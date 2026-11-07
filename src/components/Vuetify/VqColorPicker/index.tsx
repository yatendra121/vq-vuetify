import { computed, defineComponent, PropType, ref, toRef } from "vue";
import { VColorPicker, VDialog, VMenu, VTextField } from "vuetify/components";
import type { ComponentInstance } from "../../../types/component";
import { openPickerOnKeydown, splitPickerAttrs, useVqField } from "../../../composables/field";

type Value = string | Record<string, unknown> | null | undefined;

const VqColorPickerImpl = defineComponent({
    name: "VqColorPicker",
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
        /** Props for the text field; other attrs go to the VColorPicker. */
        fieldProps: {
            type: Object as PropType<ComponentInstance<typeof VTextField>["$props"]>,
            default: undefined
        }
    },
    setup(props, { attrs, slots }) {
        const { value, errorMessage } = useVqField<Value>(toRef(props, "name"));

        const modal = ref(false);
        const onKeydown = openPickerOnKeydown(() => (modal.value = true));

        // Non-string values ({ r, g, b }) would otherwise show as [object Object].
        const displayValue = computed(() =>
            value.value && typeof value.value === "object"
                ? JSON.stringify(value.value)
                : value.value
        );

        return () => {
            const ViewComponent = props.type ? VDialog : VMenu;
            const { fieldAttrs, pickerAttrs } = splitPickerAttrs(attrs);
            return (
                <>
                    <VTextField
                        modelValue={displayValue.value}
                        error={!!errorMessage.value}
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
                            <VColorPicker
                                v-model={value.value}
                                v-slots={slots}
                                {...pickerAttrs}
                            ></VColorPicker>
                        </ViewComponent>
                    </VTextField>
                </>
            );
        };
    }
});

 
/**
 * A read-only text field that opens a `VColorPicker` in a menu (or a dialog with `type`) and
 * binds the picked color to the form field `name`, showing its validation error.
 * Other attrs, events and slots go to the VColorPicker; `fieldProps` goes to the text field.
 */
export const VqColorPicker = VqColorPickerImpl as typeof VqColorPickerImpl & typeof VColorPicker;
export type VqColorPicker = typeof VColorPicker & typeof VqColorPickerImpl;
