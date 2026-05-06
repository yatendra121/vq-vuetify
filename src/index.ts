import * as components from "./components";
import type { App, Component } from "vue";

//Export components
export * from "./components";

//Export utilities & composables
export * from "./composables";
export { useVqList } from "./components/Vuetify/VqList/VqList";
export { useVqDataTable } from "./components/Vuetify/VqDataTable";
export { useVqForm } from "./components/Vuetify/VqForm/VqForm";

//Instance of main components of vq vuetify
export default {
    install: (app: App) => {
        const all = components as Record<string, Component>;
        for (const key of Object.keys(all)) {
            // The barrel re-exports composables (useVqForm) and helpers
            // (collectVqHeaders) too — only auto-register actual components.
            if (key.startsWith("Vq")) app.component(key, all[key]);
        }
    }
};
