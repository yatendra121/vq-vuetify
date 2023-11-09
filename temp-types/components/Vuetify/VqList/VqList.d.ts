import { PropType, VNode } from "vue";
import { VList } from "vuetify/components";
export declare const VqList: import("vue").DefineComponent<{
    id: {
        type: PropType<string>;
        required: true;
    };
    action: {
        type: PropType<string>;
        required: true;
    };
    pageSize: {
        type: PropType<number>;
        default: () => number;
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    id: {
        type: PropType<string>;
        required: true;
    };
    action: {
        type: PropType<string>;
        required: true;
    };
    pageSize: {
        type: PropType<number>;
        default: () => number;
    };
}>>, {
    pageSize: number;
}, {}>;
export type VqList = typeof VList & typeof VqList;
/**
 * Creating composable function types to create strong typed component
 */
export type ExtractComponentProps<TComponent> = TComponent extends new () => {
    $props: infer P;
} ? P : never;
interface GenericProps extends ExtractComponentProps<typeof VqList>, ExtractComponentProps<typeof VqList> {
}
interface GenericSlotsProps<TValue> {
    items: TValue[];
}
/**
 * Creating composable function to create strong typed component with VqList
 */
export declare function useVqList<TValue = unknown>(): ((props: GenericProps & {}) => any) & (new () => {
    $emit: (e: "changed", value: TValue) => void;
    $slots: {
        default: (arg: GenericSlotsProps<TValue>) => VNode[];
    };
});
export {};
//# sourceMappingURL=VqList.d.ts.map