import { computed, defineComponent, onBeforeUnmount, onMounted, ref, toRef, watch } from "vue";
import { useAsyncAxios } from "@qnx/composables/axios";
import { VAutocomplete } from "vuetify/components";
import { useVqField } from "../../../composables/field";

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
    emits: ["error"],
    setup(props, { attrs, slots, emit }) {
        const { value, errorMessage } = useVqField(toRef(props, "name"));

        const updateModelValue = (val: unknown) => {
            value.value = val;
        };
        const fetchedItems = ref<unknown[]>();
        const items = computed(() => (props.action && fetchedItems.value) || props.items);
        const loading = ref(false);

        let abortController: AbortController | undefined;
        const fetchItems = () => {
            abortController?.abort();
            if (!props.action) return;

            const controller = new AbortController();
            abortController = controller;
            loading.value = true;
            useAsyncAxios(props.action, { signal: controller.signal })
                .then((res) => {
                    fetchedItems.value = res.data.data;
                })
                .catch((err) => {
                    if (err?.name === "CanceledError") return;
                    console.error(err.message);
                    emit("error", err);
                })
                .finally(() => {
                    if (abortController === controller) loading.value = false;
                });
        };

        onMounted(fetchItems);
        watch(() => props.action, fetchItems);
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

 
export type VqAutocomplete = typeof VAutocomplete & typeof VqAutocomplete;
