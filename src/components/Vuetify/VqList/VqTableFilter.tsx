import { computed, defineComponent, PropType, type VNode } from "vue";
import type { ComponentInstance, TemplateComponent } from "../../../types/component";
import { Form as VForm, type SubmissionHandler } from "vee-validate";
import { VqTableFilterHandler } from "./VqTableFilterHandler";

//types
import type { Form as VFormType } from "vee-validate";

const VqTableFilterImpl = defineComponent({
    name: "VqTableFilter",
    props: {
        /** `id` of the `VqDataTable` or `VqList` to filter. */
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

 
/**
 * A form whose field values filter the `VqDataTable` or `VqList` with the same `id`:
 * every change refetches from the first page. Takes vee-validate Form's props.
 */
export const VqTableFilter = VqTableFilterImpl as typeof VqTableFilterImpl &
    TemplateComponent<
        ComponentInstance<typeof VFormType>["$props"] &
            ComponentInstance<typeof VqTableFilterImpl>["$props"],
        { default?: () => VNode[] }
    >;
export type VqTableFilter = typeof VFormType & typeof VqTableFilterImpl;
