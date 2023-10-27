// /<reference types="vite/client" />
import type { ComponentPublicInstance, FunctionalComponent } from 'vue'

declare global {
    namespace JSX {
        interface ElementChildrenAttribute {
            $children: {}
        }
    }
}

declare module 'vue' {
    export type JSXComponent<Props = any> =
        | { new (): ComponentPublicInstance<Props> }
        | FunctionalComponent<Props>
}

declare module 'vue' {
    export interface GlobalComponents {
        // @generate-components
    }
}
