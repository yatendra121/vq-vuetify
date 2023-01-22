declare const _default: import("vue").DefineComponent<{
    name: {
        type: StringConstructor;
        required: true;
    };
    label: {
        type: StringConstructor;
        default: () => string;
    };
    placeholder: {
        type: StringConstructor;
        default: () => string;
    };
    height: {
        type: NumberConstructor;
        default: () => number;
    };
    isDark: {
        type: BooleanConstructor;
        default: () => boolean;
    };
    baseUrl: {
        type: StringConstructor;
        default: () => string;
    };
}, {
    plugins: string;
    toolbar: string;
    errorMessage: import("vue").Ref<string | undefined>;
    value: import("vue").Ref<unknown>;
    baseUrl: string;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    name: {
        type: StringConstructor;
        required: true;
    };
    label: {
        type: StringConstructor;
        default: () => string;
    };
    placeholder: {
        type: StringConstructor;
        default: () => string;
    };
    height: {
        type: NumberConstructor;
        default: () => number;
    };
    isDark: {
        type: BooleanConstructor;
        default: () => boolean;
    };
    baseUrl: {
        type: StringConstructor;
        default: () => string;
    };
}>>, {
    label: string;
    placeholder: string;
    height: number;
    isDark: boolean;
    baseUrl: string;
}>;
export default _default;
//# sourceMappingURL=index.vue.d.ts.map