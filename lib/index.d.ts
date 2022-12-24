import { AxiosInstance } from 'axios';
import * as vue from 'vue';

declare const setAxiosInstance: (instance: AxiosInstance) => void;
//# sourceMappingURL=index.d.ts.map

declare const VqTextField: vue.DefineComponent<{
    name: {
        type: StringConstructor;
        required: true;
    };
}, () => JSX.Element, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    name: {
        type: StringConstructor;
        required: true;
    };
}>>, {}>;
type VqTextField = InstanceType<typeof VqTextField>;

declare const VqAutoComplete: vue.DefineComponent<{
    name: {
        type: StringConstructor;
        required: true;
    };
}, () => JSX.Element, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.VNodeProps & vue.AllowedComponentProps & vue.ComponentCustomProps, Readonly<vue.ExtractPropTypes<{
    name: {
        type: StringConstructor;
        required: true;
    };
}>>, {}>;
type VqAutoComplete = InstanceType<typeof VqAutoComplete>;

export { VqAutoComplete, VqTextField, setAxiosInstance };

// /<reference types="vite/client" />
import type {
  ComponentPublicInstance,
  FunctionalComponent,
  UnwrapNestedRefs,
  VNodeChild,
} from "vue";

declare global {
  namespace JSX {
    interface ElementChildrenAttribute {
      $children: {};
    }
  }
}

declare module "vue" {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>;
}

declare module "@vue/runtime-core" {
  export interface GlobalComponents {    VqTextField: typeof import('src/components')['VqTextField']
    VqAutoComplete: typeof import('src/components')['VqAutoComplete']
  }
}
