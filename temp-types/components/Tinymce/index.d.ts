import TinyEditor from "@tinymce/tinymce-vue";
export declare const VqTextEditor: import("vue").DefineComponent<{
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
    filesPath: {
        type: StringConstructor;
        default: () => string;
    };
}, () => JSX.Element, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
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
    filesPath: {
        type: StringConstructor;
        default: () => string;
    };
}>>, {
    label: string;
    placeholder: string;
    height: number;
    baseUrl: string;
    isDark: boolean;
    filesPath: string;
}, {}>;
export type VqTextEditor = typeof TinyEditor & typeof VqTextEditor;
//# sourceMappingURL=index.d.ts.map