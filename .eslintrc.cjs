/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/eslint-config-typescript"],
    overrides: [
        {
            files: ["*.tsx"],
            rules: {
                "no-unused-vars": "off",
                "@typescript-eslint/no-unused-vars": "off"
            }
        }
    ],
    parserOptions: {
        ecmaVersion: "latest"
    }
};
// '@vue/eslint-config-prettier'
