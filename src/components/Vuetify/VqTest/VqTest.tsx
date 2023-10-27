import { defineComponent, toRefs } from 'vue'

export const VqTest = defineComponent({
    name: 'VqTest',
    props: {
        title: {
            type: String,
            default: 'Default Title',
            required: true
        }
    },

    setup(props) {
        const { title } = toRefs(props)
        return () => (
            <>
                <h1>{title.value}</h1>
            </>
        )
    }
})

// eslint-disable-next-line no-redeclare
export type VqTest = typeof VqTest
