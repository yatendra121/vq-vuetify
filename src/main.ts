import { createApp } from "vue";
import App from "./App.vue";
import Helloworld from "./components/HelloWorld.vue";
//Vue.component("Helloworld", Helloworld); // global registration - can be used anywhere

const app = createApp(App);
app.component("Helloworld", Helloworld);

app.mount("#app");
