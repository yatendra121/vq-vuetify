declare const _default: import("vue").DefineComponent<{
    items: {
        type: ArrayConstructor;
        required: true;
    };
    value: {
        type: BooleanConstructor;
        default: boolean;
    };
    timeout: {
        type: NumberConstructor;
        default: number;
    };
    color: {
        type: StringConstructor;
        default: string;
    };
    top: {
        type: BooleanConstructor;
        default: boolean;
    };
    right: {
        type: BooleanConstructor;
        default: boolean;
    };
    absolute: {
        type: BooleanConstructor;
        default: boolean;
    };
    autoHeight: {
        type: BooleanConstructor;
        default: boolean;
    };
    bottom: {
        type: BooleanConstructor;
        default: boolean;
    };
    left: {
        type: BooleanConstructor;
        default: boolean;
    };
    multiLine: {
        type: BooleanConstructor;
        default: boolean;
    };
    vertical: {
        type: BooleanConstructor;
        default: boolean;
    };
}, {
    mdiInformation: string;
    removeItem: (p: any) => void;
}, any, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "remove"[], "remove", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    items: {
        type: ArrayConstructor;
        required: true;
    };
    value: {
        type: BooleanConstructor;
        default: boolean;
    };
    timeout: {
        type: NumberConstructor;
        default: number;
    };
    color: {
        type: StringConstructor;
        default: string;
    };
    top: {
        type: BooleanConstructor;
        default: boolean;
    };
    right: {
        type: BooleanConstructor;
        default: boolean;
    };
    absolute: {
        type: BooleanConstructor;
        default: boolean;
    };
    autoHeight: {
        type: BooleanConstructor;
        default: boolean;
    };
    bottom: {
        type: BooleanConstructor;
        default: boolean;
    };
    left: {
        type: BooleanConstructor;
        default: boolean;
    };
    multiLine: {
        type: BooleanConstructor;
        default: boolean;
    };
    vertical: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onRemove?: ((...args: any[]) => any) | undefined;
}, {
    value: boolean;
    timeout: number;
    color: string;
    top: boolean;
    right: boolean;
    absolute: boolean;
    autoHeight: boolean;
    bottom: boolean;
    left: boolean;
    multiLine: boolean;
    vertical: boolean;
}>;
export default _default;
//# sourceMappingURL=VSnackbarQueue.vue.d.ts.map