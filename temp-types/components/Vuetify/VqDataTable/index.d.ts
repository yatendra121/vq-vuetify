import { VNode, PropType } from "vue";
import { VDataTableServer } from "vuetify/labs/VDataTable";
interface SortByValue {
    key: string;
    order: "asc" | "desc";
}
export declare const VqDataTable: import("vue").DefineComponent<{
    id: {
        type: PropType<string>;
        required: true;
    };
    action: {
        type: PropType<string>;
        required: true;
    };
    method: {
        type: PropType<string>;
        default: () => string;
    };
    page: {
        type: PropType<number>;
        default: () => number;
    };
    itemsPerPage: {
        type: PropType<number>;
        default: () => number;
    };
    sortBy: {
        type: PropType<SortByValue[]>;
        default: () => {
            key: string;
            order: string;
        }[];
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
    method: {
        type: PropType<string>;
        default: () => string;
    };
    page: {
        type: PropType<number>;
        default: () => number;
    };
    itemsPerPage: {
        type: PropType<number>;
        default: () => number;
    };
    sortBy: {
        type: PropType<SortByValue[]>;
        default: () => {
            key: string;
            order: string;
        }[];
    };
}>>, {
    method: string;
    page: number;
    sortBy: SortByValue[];
    itemsPerPage: number;
}, {}>;
export type VqDataTable = typeof VDataTableServer & typeof VqDataTable;
/**
 * Creating composable function types to create strong typed component
 */
export type ExtractComponentProps<TComponent> = TComponent extends new () => {
    $props: infer P;
} ? P : never;
interface GenericProps extends ExtractComponentProps<typeof VqDataTable>, ExtractComponentProps<typeof VqDataTable> {
}
interface GenericSlotsProps<TValue> {
    item: TValue;
    index: number;
}
/**
 * Creating composable function to create strong typed component with VqList
 */
export declare function useVqDataTable<TValue = unknown>(): ((props: GenericProps & {}) => any) & (new () => {
    $emit: (e: "changed", value: TValue) => void;
    $slots: {
        item: (arg: GenericSlotsProps<TValue>) => VNode[];
    };
});
/**
 * this function is
 * @param headers
 * @returns
 */
export declare function collectVqHeaders<T extends unknown[]>(headers: T): (T[number] | {
    title: string;
    sortable: boolean;
})[];
export declare const VqSerialNo: import("vue").DefineComponent<{
    index: {
        type: PropType<number>;
        required: true;
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    index: {
        type: PropType<number>;
        required: true;
    };
}>>, {}, {}>;
export type VqSerialNo = typeof VqSerialNo;
export {};
//# sourceMappingURL=index.d.ts.map