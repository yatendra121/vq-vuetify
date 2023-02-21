import { defineComponent, toRef } from 'vue'
import { useField } from 'vee-validate'
import { VCheckbox } from 'vuetify/components'

export const VqCheckbox = defineComponent({
    name: 'VqCheckbox',
    props: {
        name: {
            type: String,
            required: true
        }
    },
    components: {
        VCheckbox
    },
    setup(props, { attrs, slots }) {
        const { value, errorMessage } = useField(toRef(props, 'name'), undefined, {
            validateOnValueUpdate: false
        })

        return () => (
            <>
                <VCheckbox
                    error={!!errorMessage.value}
                    v-model={value.value}
                    error-messages={errorMessage.value}
                    messages={errorMessage.value}
                    v-slots={slots}
                    {...attrs}
                ></VCheckbox>
            </>
        )
    }
})

// eslint-disable-next-line no-redeclare
export type VqCheckbox = typeof VCheckbox & typeof VqCheckbox
