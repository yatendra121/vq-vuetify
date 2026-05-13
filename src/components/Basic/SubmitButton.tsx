import { Ref, computed, defineComponent, inject, PropType } from "vue";
import { useFormStore } from "../../store/reactivity/form";
import { VBtn } from "vuetify/components";

export const VqSubmitBtn = defineComponent({
    name: "VqSubmitButton",
    props: {
        form: {
            type: String,
            default: undefined
        },
        text: {
            type: String as PropType<string>,
            default: undefined
        }
    },
    setup(props, { attrs, slots }) {
        const formStore = useFormStore();

        const formId = inject<Readonly<Ref<string | undefined>>>("formId");

        const loading = computed(
            () => (formId?.value && formStore.forms[formId.value]?.busy) ?? false
        );

        return () => (
            <>
                <VBtn
                    loading={loading.value}
                    /* @ts-ignore Vuetify VBtn types omit native button type */
                    type="submit"
                    form={props.form}
                    color="primary"
                    {...attrs}
                >
                    {slots.default ? slots.default() : (props.text ?? "Submit")}
                </VBtn>
            </>
        );
    }
});

// eslint-disable-next-line no-redeclare
export type VqSubmitBtn = typeof VBtn & typeof VqSubmitBtn;
