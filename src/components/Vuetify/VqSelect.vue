<template>
  <v-select
    v-model="value"
    v-bind="$attrs"
    :error="!!errorMessage"
    :error-messages="errorMessage"
    :messages="errorMessage"
  >
  </v-select>
</template>

<script lang="ts">
import { defineComponent, Ref } from 'vue'
import { useField } from 'vee-validate'
export default defineComponent({
  name: 'VqSelect',
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
    }: { errorMessage: Ref<unknown>; value: Ref<string | undefined> } =
      useField(props.name)

    return {
      errorMessage,
      value
    }
  }
})
</script>
