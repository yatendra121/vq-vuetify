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
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: [
                "vue",
                "vuetify",
                "vuetify/components",
                "vee-validate",
                "axios",
                "pinia",
                "@qnx/composables",
                "@qnx/composables/axios",
                "@tinymce/tinymce-vue",
                "vuetify/labs/VDataTable"
            ],
            output: {
                //format: 'esm',
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    vue: "Vue"
                }
            }
        }
    }

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

//git tag <tagname>
//git push origin --tags
