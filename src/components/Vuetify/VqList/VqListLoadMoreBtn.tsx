//@ts-nocheck
import { defineComponent, inject, Ref } from 'vue'
import { VBtn } from 'vuetify/components'
export const VqListLoadMoreBtn = defineComponent({
    name: 'VqListLoadMoreBtn',
    components: {
        VBtn
    },
    setup(props, { attrs, slots }) {
        const vqList = inject<{
            loading: Ref<boolean>
            finished: Ref<boolean>
            tableListId: string
            loadMore: () => void
        }>('vqList')

        return () => (
            <>
                {!vqList?.finished.value && (
                    <VBtn
                        loading={vqList?.loading.value}
                        disabled={vqList?.loading.value}
                        color="primary"
                        onClick={vqList?.loadMore}
                        v-slots={slots}
                        {...attrs}
                    >
                        Load More
                    </VBtn>
                )}
            </>
        )
    }
})

// eslint-disable-next-line no-redeclare
export type VqListLoadMoreBtn = typeof VBtn & typeof VqListLoadMoreBtn
