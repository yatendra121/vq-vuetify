import { defineAsyncComponent } from 'vue'
const VQTextField = defineAsyncComponent(
    () => import(/* webpackChunkName: "vq-vuetify" */ './components/VqTextField')
)
const VQFileInput = defineAsyncComponent(
    () =>
        import(/* webpackChunkName: "vq-vuetify" */ './components/VqFileInput.vue')
)
const VqAutoComplete = defineAsyncComponent(
    () =>
        import(/* webpackChunkName: "vq-vuetify" */ './components/VqAutoComplete')
)
const VqForm = defineAsyncComponent(
    () => import(/* webpackChunkName: "vq-vuetify" */ './components/VqForm')
)
// const VQTextEditor = defineAsyncComponent(
//     () => import(/* webpackChunkName: "vq-vuetify" */ './Tinymce/index.vue')
// )


export default {
    install: (app: any) => {
        app.component('VqTextField', VQTextField)
        app.component('VqFileInput', VQFileInput)
        app.component('VqAutoComplete', VqAutoComplete)
        app.component('VqForm', VqForm)
      //  app.component('VqTextEditor', VQTextEditor)
    }
}

