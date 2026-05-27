import { defineComponent, onBeforeUnmount, ref, toRef } from "vue";
import { useField } from "vee-validate";
import { useAsyncAxios } from "@qnx/composables/axios";
import { VAutocomplete } from "vuetify/components";

export const VqAutocomplete = defineComponent({
    name: "VqAutoComplete",
    props: {
        name: {
            type: String,
            required: true
        },
        action: {
            type: String
        },
        items: {
            type: Array,
            default: () => []
        }
    },
    setup(props, { attrs, slots }) {
        const { value, errorMessage } = useField(toRef(props, "name"), [], {
            validateOnValueUpdate: false
        });

        const updateModelValue = (val: any) => {
            value.value = val;
        };
        const items = ref(props.items);
        const loading = ref(false);

        let abortController: AbortController | undefined;
        if (props.action) {
            abortController = new AbortController();
            loading.value = true;
            useAsyncAxios(props.action, { signal: abortController.signal })
                .then((res) => {
                    items.value = res.data.data;
                })
                .catch((err) => {
                    if (err?.name !== "CanceledError") console.error(err.message);
                })
                .finally(() => {
                    loading.value = false;
                });
        }

        onBeforeUnmount(() => abortController?.abort());

        return () => (
            <>
                <VAutocomplete
                    loading={loading.value}
                    error={!!errorMessage.value}
                    modelValue={value.value}
                    onUpdate:modelValue={updateModelValue}
                    error-messages={errorMessage.value}
                    messages={errorMessage.value}
                    items={items.value}
                    v-slots={slots}
                    {...attrs}
                ></VAutocomplete>
            </>
        );
    }
});

// eslint-disable-next-line no-redeclare
export type VqAutocomplete = typeof VAutocomplete & typeof VqAutocomplete;
