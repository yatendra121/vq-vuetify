import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
//import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        //extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
        alias: {
            "@": resolve(__dirname, "./src")
        }
    },
    plugins: [
        vue(),
        vuetify({
            autoImport: false,
            styles: "none"
        }),
        vueJsx()
        //dts()
    ],
    define: { "process.env": {} },
    build: {
        lib: {
            entry: {
                index: resolve(__dirname, "src/index.ts"),
                integrations: resolve(__dirname, "src/integrations.ts")
            },
            // name: "vq-vuetify",
            fileName: (format, entryName) => `${entryName}.js`,
            formats: ["es"]
        },
        rolldownOptions: {
            external: (id) =>
                [
                    "vue",
                    "vuetify",
                    "vee-validate",
                    "@qnx/composables",
                    "axios",
                    "pinia",
                    "yup",
                    "@tinymce/tinymce-vue"
                ].some((pkg) => id === pkg || id.startsWith(pkg + "/"))
        }
    }
});
