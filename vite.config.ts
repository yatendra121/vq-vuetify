import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
//import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
    vueJsx(),
    //dts()
  ],
  define: { "process.env": {} },
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "vq-vuetify",
      fileName: (format) => `vq-vuetify.${format}.js`,
      formats: ["es"],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue", "vuetify", "vee-validate", "axios"],
      // output: {
      //   //format: 'esm',
      //   // Provide global variables to use in the UMD build
      //   // for externalized deps
      //   globals: {
      //     vue: "Vue",
      //   },
      // },
    },
  },
  /* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
  */
});
