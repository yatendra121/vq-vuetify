import { defineComponent, ref, toRef } from "vue";
import { useField } from "vee-validate";
import { useAsyncAxios } from "../../composables/axios";
import type { VAutocomplete } from "vuetify/components";
//import { collectValidationListeners } from "./config";

export const VqAutocomplete = defineComponent({
  name: "VqAutoComplete",
  props: {
    name: {
      type: String,
      required: true,
    },
    action: {
      type: String,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  // components: {
  //   VAutocomplete,
  // },
  setup(props, { attrs, slots }) {
    const { value, errorMessage } = useField(toRef(props, "name"), [], {
      validateOnValueUpdate: false,
    });

    // const validationListeners = collectValidationListeners({
    //   handleChange,
    //   errorMessage
    // })

    const updateModelValue = (val: any) => {
      value.value = val;
    };
    const items = ref(props.items);
    const loading = ref(false);

    if (props.action) {
      loading.value = true;
      useAsyncAxios(props.action, {})
        .then((res) => {
          items.value = res.data.data;
        })
        .catch((err) => {
          console.error(err.message);
        })
        .finally(() => {
          loading.value = false;
        });
    }

    return () => (
      <>
        <v-autocomplete
          loading={loading.value}
          error={!!errorMessage.value}
          modelValue={value.value}
          onUpdate:modelValue={updateModelValue}
          error-messages={errorMessage.value}
          messages={errorMessage.value}
          items={items.value}
          v-slots={slots}
          {...attrs}
          // onChange={validationListeners.value.input}
        ></v-autocomplete>
      </>
    );
  },
});

// eslint-disable-next-line no-redeclare
export type VqAutocomplete = typeof VAutocomplete & typeof VqAutocomplete;
