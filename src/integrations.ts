import * as components from './components/integrations'
export { setConfig } from './components/Tinymce/config'

import type { App } from 'vue'

export * from './components/integrations'

//Instance of additional components of vq vuetify
export default {
    install: (app: App) => {
        for (const key in components) {
            //@ts-ignore
            app.component(key, components[key])
        }
    }
}
