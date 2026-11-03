import pluginVue from "eslint-plugin-vue";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";

export default defineConfigWithVueTs(
    { ignores: ["dist/**", "temp-types/**", "node_modules/**", ".claude/**", "src/shims.d.ts"] },
    pluginVue.configs["flat/essential"],
    vueTsConfigs.recommended,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
        }
    }
);
