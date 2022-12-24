import * as components from './components'

//Export utilities & composables
export * from './plugins'
//export * from './utils'
export * from './composables'
export { components }

//Instance of all vq vuetify
export default {
    install: (app: any) => {
        for (const key in components) {
            //@ts-ignore
            app.component(key, components[key])
        }
    }
}
