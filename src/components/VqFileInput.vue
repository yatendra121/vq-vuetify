<template>
  <v-file-input
    accept="image/*"
    v-model="value"
    v-bind="$attrs"
    :error="!!errorMessage"
    :error-messages="errorMessage"
    :messages="errorMessage"
  >
    <!-- <template #progress>
        <v-progress-linear absolute height="7"></v-progress-linear>
      </template> -->
  </v-file-input>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
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
    const { errorMessage, value } = useField(props.name, [])

    return {
      errorMessage,
      value
    }
  }
})
</script>
