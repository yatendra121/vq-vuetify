import { useFormFilterStore } from '../../../store/reactivity/formFiler'
import { useFormValues } from 'vee-validate'
import { computed, defineComponent, onBeforeUnmount, onMounted, PropType, watch } from 'vue'

export const VqTableFilterHandler = defineComponent({
    props: {
        id: {
            type: String as PropType<string>,
            required: true
        }
    },
    setup(props, { slots }) {
        const filterId = computed(() => {
            return `${props.id}`
        })

        const formValues = useFormValues()
        const formFilterStore = useFormFilterStore()

        onMounted(() => {
            formFilterStore.addForm(filterId.value, formValues.value)
        })

        watch(formValues, (newVal) => {
            formFilterStore.updateValues(filterId.value, newVal)
        }, { deep: true })

        onBeforeUnmount(() => formFilterStore.removeForm(filterId.value))

        return () => <>{slots.default?.()}</>
    }
})

// eslint-disable-next-line no-redeclare
export type VqTableFilterHandler = typeof VqTableFilterHandler
