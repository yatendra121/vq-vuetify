//import { createApp } from "vue";
//import App from "./App.vue";
//import vuetify from './plugins/vuetify'
//import { loadFonts } from './plugins/webfontloader'
import VQTextField from "./components/VQTextField.vue";

//loadFonts()

//createApp(App).use(vuetify).mount("#app");

export default {
  install: (app: any) => {
    app.component("vq-text-field", VQTextField);
    // const Helloworld = resolveComponent("./components/HelloWorld.vue");
    //return () => h(Helloworld);
  },
};
