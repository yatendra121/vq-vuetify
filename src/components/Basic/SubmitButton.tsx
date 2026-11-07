import { Ref, computed, defineComponent, inject, PropType } from "vue";
import { useFormStore } from "../../store/reactivity/form";
import { useVqLocale } from "../../config/locale";
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
        const locale = useVqLocale();

        const injectedFormId = inject<Readonly<Ref<string | undefined>> | undefined>(
            "formId",
            undefined
        );

        // `form` targets a form from outside it, where nothing is injected.
        const loading = computed(() => {
            const formId = props.form ?? injectedFormId?.value;
            return !!(formId && formStore.forms[formId]?.busy);
        });

        return () => (
            <>
                <VBtn
                    loading={loading.value}
                    {...{ type: "submit", form: props.form }}
                    color="primary"
                    v-slots={{
                        ...slots,
                        default: () => (slots.default ? slots.default() : (props.text ?? locale.submit))
                    }}
                    {...attrs}
                ></VBtn>
            </>
        );
    }
});

 
export type VqSubmitBtn = typeof VBtn & typeof VqSubmitBtn;
