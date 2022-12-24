import { PropType } from "vue";
import type { VList } from "vuetify/components";
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
}>;
export type VqList = typeof VList & typeof VqList;
//# sourceMappingURL=VqList.d.ts.map