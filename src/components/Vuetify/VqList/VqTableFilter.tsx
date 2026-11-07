import { computed, defineComponent, PropType, type VNode } from "vue";
import type { ComponentInstance, TemplateComponent } from "../../../types/component";
import { Form as VForm, type SubmissionHandler } from "vee-validate";
import { VqTableFilterHandler } from "./VqTableFilterHandler";

//types
import type { Form as VFormType } from "vee-validate";

const VqTableFilterImpl = defineComponent({
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

 
/**
 * Typed with vee-validate Form's props, which it passes through. Its default slot
 * gets no slot props (unlike Form's), so only the slot itself is typed.
 */
export const VqTableFilter = VqTableFilterImpl as typeof VqTableFilterImpl &
    TemplateComponent<
        ComponentInstance<typeof VFormType>["$props"] &
            ComponentInstance<typeof VqTableFilterImpl>["$props"],
        { default?: () => VNode[] }
    >;
export type VqTableFilter = typeof VFormType & typeof VqTableFilterImpl;
