import { reactive } from "vue";

type DataObject = Record<string, any>;

export type FormFilterData = {
    values: DataObject;
    resetRequired: boolean;
    reloadRequired: boolean;
};
type FormFilterDataState = { [key: string]: FormFilterData };

const store = reactive({
    forms: {} as FormFilterDataState,
    addForm(key: string, values: DataObject) {
        store.forms[key] = {
            values,
            resetRequired: false,
            reloadRequired: false
        };
    },
    removeForm(key: string) {
        delete store.forms[key];
    },
    setReloadValue(key: string, val: boolean) {
        if (store.forms[key]) store.forms[key].reloadRequired = val;
    },
    setResetValue(key: string, val: boolean) {
        if (store.forms[key]) store.forms[key].resetRequired = val;
    }
});

export const useFormFilterStore = () => store;
