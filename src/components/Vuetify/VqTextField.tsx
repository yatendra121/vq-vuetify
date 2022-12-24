import { defineComponent, PropType, toRef } from "vue";
import { useField } from "vee-validate";
import { collectValidationListeners } from "./config";

//types
import type { VTextField } from "vuetify/components";

export const VqTextField = defineComponent({
  name: "VqTextField",
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, { attrs, slots }) {
    const { value, errorMessage, handleChange } = useField(
      toRef(props, "name"),
      undefined,
      {
        validateOnValueUpdate: false,
      }
    );

    const validationListeners = collectValidationListeners({
      handleChange,
      errorMessage,
    });

    return () => (
      <>
        <v-text-field
          error={!!errorMessage.value}
          v-model={value.value}
          error-messages={errorMessage.value}
          messages={errorMessage.value}
          v-slots={slots}
          {...attrs}
          // onChange={handleChange}
          // onInput={validationListeners.value.input}
          // onBlur={handleChange}
        ></v-text-field>
      </>
    );
  },
});

// eslint-disable-next-line no-redeclare
export type VqTextField = typeof VTextField & typeof VqTextField;
