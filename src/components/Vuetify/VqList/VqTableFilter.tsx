import { computed, defineComponent, PropType } from "vue";
import { Form as VForm, type SubmissionHandler } from "vee-validate";
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
                <VForm
                    {...{ id: filterId.value }}
                    {...attrs}
                    onSubmit={(attrs.onSubmit as SubmissionHandler | undefined) ?? noopSubmit}
                >
                    <VqTableFilterHandler id={filterId.value} v-slots={slots} />
                </VForm>
            </>
        );
    }
});

 
export type VqTableFilter = typeof VFormType & typeof VqTableFilter;
