import { defineStore } from "pinia";
type DataObject = Record<string, any>;

export type FormFilterData = {
    values: DataObject;
    resetRequired: boolean;
    reloadRequired: boolean;
};
type FormFilterDataState = { [key: string]: FormFilterData };

export const useFormFilterStore = defineStore("form_filter_values_lib", {
    state: () => ({ forms: {} }) as { forms: FormFilterDataState },
    actions: {
        addForm(key: string, values: DataObject) {
            const newForm = {
                values,
                resetRequired: false,
                reloadRequired: false
            };
            this.forms[key] = newForm;
        },
        removeForm(key: string) {
            delete this.forms[key];
        },
        updateValues(key: string, values: DataObject) {
            if (this.forms[key]) this.forms[key].values = values;
        },
        setReloadValue(key: string, val: boolean) {
            if (this.forms[key]) this.forms[key].reloadRequired = val;
        },
        setResetValue(key: string, val: boolean) {
            if (this.forms[key]) this.forms[key].resetRequired = val;
        }
    }
});
