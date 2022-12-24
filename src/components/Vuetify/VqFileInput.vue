<template>
  <v-file-input
    accept="image/*"
    v-model="value"
    v-bind="$attrs"
    :error="!!errorMessage"
    :error-message="errorMessage"
  >
    <!-- <template #progress>
        <v-progress-linear absolute height="7"></v-progress-linear>
      </template> -->
  </v-file-input>
</template>

<script lang="ts">
import { defineComponent, Ref } from 'vue'
import { useField } from 'vee-validate'
export default defineComponent({
  name: 'VqFileInput',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const {
      errorMessage,
      value
    }: { errorMessage: Ref<unknown>; value: Ref<File[] | undefined> } =
      useField(props.name, [])

    return {
      errorMessage,
      value
    }
  }
})
</script>
