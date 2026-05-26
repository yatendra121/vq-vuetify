import * as components from "./components/integrations";
export { setConfig } from "./components/Tinymce/config";

import type { App, Component } from "vue";

export * from "./components/integrations";

//Instance of additional components of vq vuetify
export default {
    install: (app: App) => {
        const all = components as Record<string, Component>;
        for (const key of Object.keys(all)) {
            if (key.startsWith("Vq")) app.component(key, all[key]);
        }
    }
};
