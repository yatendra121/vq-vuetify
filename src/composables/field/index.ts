import { watch, type MaybeRefOrGetter } from "vue";
import { useField } from "vee-validate";

/**
 * Internal — lets the keyboard open a picker from its read-only text field, which
 * otherwise only opens on click. Enter is left alone because it submits the form.
 */
export const openPickerOnKeydown = (open: () => void) => (event: KeyboardEvent) => {
    if (event.key === " " || event.key === "ArrowDown") {
        event.preventDefault();
        open();
    }
};

/**
 * Internal — splits a picker's attrs. `id` and `placeholder` describe the text field
 * the user sees; everything else configures the picker in the menu.
 */
export const splitPickerAttrs = (attrs: Record<string, unknown>) => {
    const { id, placeholder, ...pickerAttrs } = attrs;
    const fieldAttrs: Record<string, unknown> = {};
    if (id !== undefined) fieldAttrs.id = id;
    if (placeholder !== undefined) fieldAttrs.placeholder = placeholder;
    return { fieldAttrs, pickerAttrs };
};

/**
 * Internal — shared `useField` setup for every Vq* field wrapper.
 *
 * Validation stays lazy (nothing runs while the user first types), but once a
 * field shows an error it re-validates on change, so the message clears as soon
 * as the value is corrected instead of lingering until the next submit.
 */
export const useVqField = <T = unknown>(name: MaybeRefOrGetter<string>) => {
    const field = useField<T>(name, undefined, { validateOnValueUpdate: false });

    watch(field.value, () => {
        if (field.errorMessage.value) field.validate();
    });

    return field;
};
