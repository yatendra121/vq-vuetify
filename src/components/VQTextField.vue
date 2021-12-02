<template>
  <v-container fluid>
    {{ " my test " }}
    <v-text-field
      v-model="value"
      :error-message="errorMessage"
      color="cyan darken"
      label="Text field"
      placeholder="Start typing..."
    >
      <template v-slot:progress>
        <v-progress-linear absolute height="7"></v-progress-linear>
      </template>
    </v-text-field>
    {{ errorMessage }}
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useField } from "vee-validate";
export default defineComponent({
  name: "VQTextField",
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { errorMessage, value } = useField(props.name);

    return {
      errorMessage,
      value,
    };
  },
});
</script>
