import { defineComponent, inject, Ref } from "vue";
import { VBtn } from "vuetify/components";
import { useVqLocale } from "../../../config/locale";
interface VqListInjection {
    loading: Ref<boolean>;
    finished: Ref<boolean>;
    tableListId: string;
    loadMore: () => void;
}
const VqListLoadMoreBtnImpl = defineComponent({
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
                        {...{ onClick: () => vqList?.loadMore() }}
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

 
/** Typed with VBtn's props, events and slots, which it passes through. */
export const VqListLoadMoreBtn = VqListLoadMoreBtnImpl as typeof VqListLoadMoreBtnImpl & typeof VBtn;
export type VqListLoadMoreBtn = typeof VBtn & typeof VqListLoadMoreBtnImpl;
