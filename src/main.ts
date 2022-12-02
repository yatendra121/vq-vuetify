import setAxiosInstance from "./plugins/axios";
//import { defineAsyncComponent } from "vue";
import { VqTextField } from "./components/VqTextField";
// const VQTextField = defineAsyncComponent(
//     () => import(/* webpackChunkName: "vq-vuetify" */ './components/VqTextField')
// )
//const VQFileInput = defineAsyncComponent(
//    () =>
//        import(/* webpackChunkName: "vq-vuetify" */ './components/VqFileInput.vue')
//)
// const VqAutoComplete = defineAsyncComponent(
//     () =>
//         import(/* webpackChunkName: "vq-vuetify" */ './components/VqAutoComplete')
// )
// const VqForm = defineAsyncComponent(
//     () => import(/* webpackChunkName: "vq-vuetify" */ './components/VqForm')
// )
// const VQTextEditor = defineAsyncComponent(
//     () => import(/* webpackChunkName: "vq-vuetify" */ './Tinymce/index.vue')
// )

export default {
  install: (app: any) => {
    app.component("VqTextField", VqTextField);
    // app.component('VqFileInput', VQFileInput)
    // app.component('VqAutoComplete', VqAutoComplete)
    // app.component('VqForm', VqForm)
    //  app.component('VqTextEditor', VQTextEditor)
  },
};

export { setAxiosInstance };
