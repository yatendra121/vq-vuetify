// @ts-nocheck
import { defineComponent, PropType, toRefs } from 'vue'
import { ConfirmState, useConfirmStore } from '../../store/reactivity/confirm'

import { mdiDelete } from '@mdi/js'
import { useAsyncAxios, useAxios } from '../../composables/axios'
import { useMessageInstance } from '../../composables/message'
import { ApiResponse } from '../../utils'
import { useFormFilterRepository } from '../../composables/form'

const VqDatatableItemAction = defineComponent({
    name: 'VqDatatableItemAction',
    props: {
        title: {
            type: String as PropType<string>,
            default: () => 'Confirmation'
        },
        description: {
            type: String as PropType<string>,
            default: () => 'Are you sure to want delete this record?'
        },
        action: {
            type: String as PropType<string>,
            default: () => 'user/change-status'
        },
        method: {
            type: String as PropType<string>,
            default: () => 'PUT'
        },
        icon: {
            type: String as PropType<string>,
            default: () => mdiDelete
        },
        itemId: {
            type: String as PropType<string>,
            default: () => '0'
        },
        id: {
            type: String as PropType<string>,
            required: true
        }
    },

    setup(props, { attrs, emit, slots }) {
        const { reload } = useFormFilterRepository(`${props.id}_filter`)

        const confirmStore = useConfirmStore()
        const useMessage = useMessageInstance()

        const callback = () =>
            executeConfirmAction({
                url: props.action,
                method: props.method,
                id: props.itemId
            })
                .then((res: any) => {
                    const apiRes = new ApiResponse(res)
                    confirmStore.close(false)
                    useMessage.success(apiRes.getMessage() ?? '')
                    reload()
                })
                .catch((res) => {
                    console.log({ res })
                    confirmStore.close(false)
                    useMessage.error('Please check input values.')
                })

        const { title, description } = toRefs(props)
        const showConfirmAction = () => {
            confirmStore.setConfirmValues({
                title: title.value,
                description: description.value,
                callback
            } as ConfirmState)

            confirmStore.showDialoag()
        }
        return () => (
            <>
                <v-tooltip text="Change Status">
                    {{
                        activator: ({ props }: any) => (
                            <>
                                <v-btn
                                    variant="text"
                                    {...props}
                                    onClick={showConfirmAction}
                                    color="primary"
                                    icon={mdiDelete}
                                ></v-btn>
                            </>
                        )
                    }}
                </v-tooltip>
            </>
        )
    }
})
export default VqDatatableItemAction
//export type VqDatatableItemAction = InstanceType<typeof VqDatatableItemAction>

const executeConfirmAction = ({ url, method, id }: { url: string; method: string; id: string }) => {
    return useAsyncAxios(`${url}/${id}`, { method })
}
