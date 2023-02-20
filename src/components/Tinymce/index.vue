<template>
  <Editor
    v-model="value"
    :init="{
      height: height,
      menubar: true,
      plugins: plugins,
      toolbar: toolbar,
      skin: isDark ? 'oxide' : 'oxide-dark',
      content_css: isDark ? 'default' : 'dark',
    }"
    :tinymce-script-src="baseUrl"
  />
  <transition name="bounce">
    <div
      class="tw-m-4 tw-text-xs tw-text-red-700 tw-transition tw-duration-300 tw-ease-in-out tw-dark:text-gray-400 tw-mt-1"
    >
      <p style="color: red" class="tw-min-h-[16px]">{{ errorMessage }}</p>
    </div>
  </transition>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useField } from "vee-validate";
import Editor from "@tinymce/tinymce-vue";
import plugins from "./plugins";
import toolbar from "./toolbar";

export default defineComponent({
  name: "TextEditor",
  components: {
    Editor,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: () => "",
    },
    placeholder: {
      type: String,
      default: () => "",
    },
    height: {
      type: Number,
      default: () => 250,
    },
    isDark: {
      type: Boolean,
      default: () => true,
    },
    baseUrl: {
      type: String,
      default: () => "http://localhost:3000/",
    },
  },
  setup(props) {
    const { errorMessage, value } = useField(props.name);

    return {
      plugins,
      toolbar,
      errorMessage,
      value,
      baseUrl: props.baseUrl + "static/tinymce/tinymce.min.js",
    };
  },
});
</script>
