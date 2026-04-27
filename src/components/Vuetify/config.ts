import { computed, ComputedRef, Ref } from 'vue'
import { FieldContext } from 'vee-validate'

type HandleChange = FieldContext['handleChange']

interface ValidationListenersInput {
    handleChange: HandleChange
    errorMessage: Ref<string | undefined>
}

export type ValidationListeners = {
    onChange: HandleChange
    onInput: HandleChange
    onBlur: HandleChange
}

export function collectValidationListeners({ handleChange, errorMessage }: ValidationListenersInput): ComputedRef<ValidationListeners> {
    return computed(() => {
        // If the field is valid or has not been validated yet — lazy strategy:
        // only validate on blur/change, not on every keystroke
        if (!errorMessage.value) {
            return {
                onBlur: handleChange,
                onChange: handleChange,
                // disable `shouldValidate` to avoid marking invalid while typing
                onInput: (e: Event | unknown) => handleChange(e, false)
            }
        }
        // Aggressive strategy: re-validate on every keystroke so users see recovery immediately
        return {
            onBlur: handleChange,
            onChange: handleChange,
            onInput: handleChange
        }
    })
}
