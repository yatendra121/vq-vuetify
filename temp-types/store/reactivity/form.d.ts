export type FormData = {
    busy: boolean;
};
type FormDataState = {
    [key: string]: FormData;
};
export declare const useFormStore: import("pinia").StoreDefinition<"form_data_lib", {
    forms: FormDataState;
}, {}, {
    addForm(key: string): void;
    removeForm(key: string): void;
    changeBusy(key: string, val: boolean): void;
}>;
export {};
//# sourceMappingURL=form.d.ts.map