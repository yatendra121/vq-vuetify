<template>
  <editor
    v-model="value"
    :init="{
      height: height,
      menubar: true,

      plugins: plugins,
      toolbar: toolbar,

      skin: isDark ? 'oxide' : 'oxide-dark',
      content_css: isDark ? 'default' : 'dark'
    }"
    :tinymce-script-src="baseUrl"
  />
  <transition name="bounce">
    <div
      class="tw-m-4 tw-text-xs tw-text-red-700 tw-transition tw-duration-300 tw-ease-in-out tw-dark:text-gray-400 tw-mt-1"
    >
      <p class="tw-min-h-[16px]">{{ errorMessage }}</p>
    </div>
  </transition>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useField } from 'vee-validate'
import Editor from '@tinymce/tinymce-vue'
import plugins from './plugins'
import toolbar from './toolbar'
import { Portal } from '@/utils/portal'
const currentPortal = Portal.getInstance()

export default defineComponent({
  name: 'TextEditor',
  components: {
    Editor
  },
  props: {
    name: {
      type: String,
      required: true,
      default: () => ''
    },
    label: {
      type: String,
      default: () => ''
    },
    placeholder: {
      type: String,
      default: () => ''
    },
    height: {
      type: Number,
      default: () => 250
    },
    isDark: {
      type: Boolean,
      default: () => true
    }
  },
  setup(props) {
    const { errorMessage, value } = useField(props.name)

    return {
      plugins,
      toolbar,
      errorMessage,
      value,
      baseUrl:
        currentPortal.getBaseUrl() +
        currentPortal.getDomianPrefix() +
        'static/tinymce/tinymce.min.js'
    }
  }
})
</script>
