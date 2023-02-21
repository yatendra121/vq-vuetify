import { computed, defineComponent } from 'vue'
import { useFormStore } from '../../store/reactivity/form'
import { VBtn } from 'vuetify/components'

export const VqSubmitBtn = defineComponent({
    name: 'VqSubmitButton',
    props: {
        id: {
            type: String,
            default: 'form'
        }
    },
    setup(props, { attrs }) {
        const formStore = useFormStore()
        const loading = computed(() => formStore.forms[props.id]?.busy ?? false)

        const submit = () => {
            const form = document.getElementById(props.id)
            // @ts-ignore
            if (form) form._vei.onSubmit(form)
        }

        return () => (
            <>
                {/* @ts-ignore */}
                <VBtn loading={loading.value} onClick={submit} color="primary" {...attrs}>
                    Submit
                </VBtn>
            </>
        )
    }
})

// eslint-disable-next-line no-redeclare
export type VqSubmitBtn = typeof VBtn & typeof VqSubmitBtn
