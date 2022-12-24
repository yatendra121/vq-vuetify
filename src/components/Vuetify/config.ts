import { computed } from 'vue'
export function collectValidationListeners({
    handleChange,
    errorMessage
}: any) {
    return computed(() => {
        // If the field is valid or have not been validated yet
        // lazy
        if (!errorMessage.value) {
            return {
                blur: handleChange,
                change: handleChange,
                // disable `shouldValidate` to avoid validating on input
                input: (e: any) => handleChange(e, false)
            }
        }
        // Aggressive
        return {
            blur: handleChange,
            change: handleChange,
            input: handleChange // only switched this
        }
    })
}
