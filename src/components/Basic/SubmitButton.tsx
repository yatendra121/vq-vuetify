import { Ref, computed, defineComponent, inject, readonly, ref, toRef } from "vue";
import { useFormStore } from "../../store/reactivity/form";
import { VBtn } from "vuetify/components";

export const VqSubmitBtn = defineComponent({
    name: "VqSubmitButton",
    props: {
        form: {
            type: String,
            default: undefined
        }
    },
    setup(props, { attrs }) {
        const formStore = useFormStore();

        //const internalformId = inject<Readonly<Ref<string | undefined>>>("formId");
        //  const externalformId = toRef(props, "form");
        // const formId = computed(() => internalformId?.value ?? externalformId?.value);

        // const loading = computed(
        //     () => (formId.value && formStore.forms[formId.value]?.busy) ?? false
        // );

        const formId = inject<Readonly<Ref<string | undefined>>>("formId");

        const loading = computed(
            () => (formId?.value && formStore.forms[formId.value]?.busy) ?? false
        );

        return () => (
            <>
                <VBtn
                    loading={loading.value}
                    /* @ts-ignore */
                    type="submit"
                    form={props.form}
                    color="primary"
                    {...attrs}
                >
                    Submit
                </VBtn>
            </>
        );
    }
});

// eslint-disable-next-line no-redeclare
export type VqSubmitBtn = typeof VBtn & typeof VqSubmitBtn;
