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
    // Attrs go to the button, which isn't rendered once the list is finished.
    inheritAttrs: false,
    setup(_props, { attrs, slots }) {
        const vqList = inject<VqListInjection | undefined>("vqList", undefined);

        const locale = useVqLocale();

        return () => (
            <>
                {!vqList?.finished.value && (
                    <VBtn
                        loading={vqList?.loading.value}
                        disabled={vqList?.loading.value}
                        color="primary"
                        /* @ts-ignore Vuetify VBtn types omit onClick */
                        onClick={() => vqList?.loadMore()}
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

 
export type VqListLoadMoreBtn = typeof VBtn & typeof VqListLoadMoreBtn;
