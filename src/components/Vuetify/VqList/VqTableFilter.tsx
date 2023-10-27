import { computed, defineComponent, PropType } from 'vue'
import { Form as VForm } from 'vee-validate'
import { VqTableFilterHandler } from './VqTableFilterHandler'

//types
import type { Form as VFormType } from 'vee-validate'

export const VqTableFilter = defineComponent({
    components: {
        VForm,
        VqTableFilterHandler
    },
    props: {
        id: {
            type: String as PropType<string>,
            required: true
        }
    },
    setup(props, { attrs, slots }) {
        const filterId = computed(() => {
            return `${props.id}_filter`
        })

        return () => (
            <>
                <VForm
                    //@ts-ignore
                    id={filterId.value}
                    {...attrs}
                >
                    <VqTableFilterHandler id={filterId.value} v-slots={slots}>
                        <>{slots.default?.()}</>
                    </VqTableFilterHandler>
                </VForm>
            </>
        )
    }
})

// eslint-disable-next-line no-redeclare
export type VqTableFilter = typeof VFormType & typeof VqTableFilter
