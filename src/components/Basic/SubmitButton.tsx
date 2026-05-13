import { Ref, computed, defineComponent, inject } from "vue";
import { useFormStore } from "../../store/reactivity/form";
import { useVqLocale } from "../../config/locale";
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
        const locale = useVqLocale();

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
                    {locale.submit}
                </VBtn>
            </>
        );
    }
});

// eslint-disable-next-line no-redeclare
export type VqSubmitBtn = typeof VBtn & typeof VqSubmitBtn;
