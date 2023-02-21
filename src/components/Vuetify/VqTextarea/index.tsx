import { defineComponent, toRef } from 'vue'
import { useField } from 'vee-validate'
import { VTextarea } from 'vuetify/components'

export const VqTextarea = defineComponent({
    name: 'VqTextarea',
    props: {
        name: {
            type: String,
            required: true
        }
    },
    components: {
        VTextarea
    },
    setup(props, { attrs, slots }) {
        const { value, errorMessage } = useField(toRef(props, 'name'), undefined, {
            validateOnValueUpdate: false
        })

        return () => (
            <>
                <VTextarea
                    error={!!errorMessage.value}
                    v-model={value.value}
                    error-messages={errorMessage.value}
                    messages={errorMessage.value}
                    v-slots={slots}
                    {...attrs}
                ></VTextarea>
            </>
        )
    }
})

// eslint-disable-next-line no-redeclare
export type VqTextarea = typeof VTextarea & typeof VqTextarea
