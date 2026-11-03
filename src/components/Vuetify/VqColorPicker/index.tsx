import { computed, defineComponent, PropType, ref, toRef } from "vue";
import { VColorPicker, VDialog, VMenu, VTextField } from "vuetify/components";
import { openPickerOnKeydown, splitPickerAttrs, useVqField } from "../../../composables/field";

type Value = string | Record<string, unknown> | null | undefined;

export const VqColorPicker = defineComponent({
    name: "VqColorPicker",
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
        /** Props for the text field; other attrs go to the VColorPicker. */
        fieldProps: {
            type: Object as PropType<Record<string, unknown>>,
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

 
export type VqColorPicker = typeof VColorPicker & typeof VqColorPicker;
