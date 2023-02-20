import * as components from "./components";
import type { App } from "vue";

//Export components
export * from "./components";

//Export utilities & composables
export * from "./composables";
export { useVqList } from "./components/Vuetify/VqList/VqList";

//Instance of main components of vq vuetify
export default {
  install: (app: App) => {
    for (const key in components) {
      //@ts-ignore
      app.component(key, components[key]);
    }
  },
};
