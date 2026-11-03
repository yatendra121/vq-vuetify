import { computed, defineComponent, PropType } from "vue";
import { Form as VForm } from "vee-validate";
import { VqTableFilterHandler } from "./VqTableFilterHandler";

//types
import type { Form as VFormType } from "vee-validate";

export const VqTableFilter = defineComponent({
    name: "VqTableFilter",
    props: {
        id: {
            type: String as PropType<string>,
            required: true
        }
    },
    setup(props, { attrs, slots }) {
        const filterId = computed(() => {
            return `${props.id}_filter`;
        });

        // Without an onSubmit, vee-validate falls back to a native form.submit(),
        // so pressing Enter in a filter field would reload the page.
        const noopSubmit = () => {};

        return () => (
            <>
                {/* @ts-ignore vee-validate VForm types omit id */}
                <VForm id={filterId.value} {...attrs} onSubmit={attrs.onSubmit ?? noopSubmit}>
                    <VqTableFilterHandler id={filterId.value} v-slots={slots} />
                </VForm>
            </>
        );
    }
});

export type VqTableFilter = typeof VFormType & typeof VqTableFilter;
