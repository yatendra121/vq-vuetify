import { computed, defineComponent } from "vue";
import { useFormStore } from "../../store/reactivity/form";
import { VBtn } from "vuetify/components";

export const VqSubmitBtn = defineComponent({
    name: "VqSubmitButton",
    props: {
        form: {
            type: String,
            default: "form"
        }
    },
    setup(props, { attrs }) {
        const formStore = useFormStore();
        const loading = computed(() => formStore.forms[props.form]?.busy ?? false);

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
