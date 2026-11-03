import { watch, type MaybeRefOrGetter } from "vue";
import { useField } from "vee-validate";

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
