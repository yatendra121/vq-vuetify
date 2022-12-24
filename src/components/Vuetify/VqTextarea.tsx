import { defineComponent, toRef } from "vue";
import { useField } from "vee-validate";

//types
import type { VTextarea } from "vuetify/components";

export const VqTextarea = defineComponent({
  name: "VqTextarea",
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, { attrs, slots }) {
    const { value, errorMessage } = useField(toRef(props, "name"), undefined, {
      validateOnValueUpdate: false,
    });

    return () => (
      <>
        <v-textarea
          error={!!errorMessage.value}
          v-model={value.value}
          error-messages={errorMessage.value}
          messages={errorMessage.value}
          v-slots={slots}
          {...attrs}
        ></v-textarea>
      </>
    );
  },
});

// eslint-disable-next-line no-redeclare
export type VqTextarea = typeof VTextarea & typeof VqTextarea;
