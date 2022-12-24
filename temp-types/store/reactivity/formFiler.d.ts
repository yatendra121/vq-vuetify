type DataObject = Record<string, any>;
export type FormFilterData = {
    values: DataObject;
    resetRequired: boolean;
    reloadRequired: boolean;
};
type FormFilterDataState = {
    [key: string]: FormFilterData;
};
export declare const useFormFilterStore: import("pinia").StoreDefinition<"form_filter_values_lib", {
    forms: FormFilterDataState;
}, {}, {
    addForm(key: string, values: DataObject): void;
    removeForm(key: string): void;
    setReloadValue(key: string, val: boolean): void;
    setResetValue(key: string, val: boolean): void;
}>;
export {};
//# sourceMappingURL=formFiler.d.ts.map