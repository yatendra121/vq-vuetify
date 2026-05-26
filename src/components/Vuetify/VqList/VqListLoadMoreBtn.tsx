import { defineComponent, inject, Ref } from "vue";
import { VBtn } from "vuetify/components";
import { useVqLocale } from "../../../config/locale";
interface VqListInjection {
    loading: Ref<boolean>;
    finished: Ref<boolean>;
    tableListId: string;
    loadMore: () => void;
}
export const VqListLoadMoreBtn = defineComponent({
    name: "VqListLoadMoreBtn",
    setup(_props, { attrs, slots }) {
    const vqList = inject<VqListInjection>("vqList");

    const locale = useVqLocale();

    return () => (
            <>
                {!vqList?.finished.value && (
                    <VBtn
                        loading={vqList?.loading.value}
                        disabled={vqList?.loading.value}
                        color="primary"
                        /* @ts-ignore Vuetify VBtn types omit onClick */
                        onClick={vqList?.loadMore}
                        v-slots={slots}
                        {...attrs}
                    >
                        {locale.loadMore}
                    </VBtn>
                )}
            </>
        );
    }
});

// eslint-disable-next-line no-redeclare
export type VqListLoadMoreBtn = typeof VBtn & typeof VqListLoadMoreBtn;
