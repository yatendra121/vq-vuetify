import { reactive } from "vue";

export type FormData = {
    busy: boolean;
};
type FormDataState = { [key: string]: FormData };

const store = reactive({
    forms: {} as FormDataState,
    addForm(key: string) {
        store.forms[key] = reactive({ busy: false });
    },
    removeForm(key: string) {
        delete store.forms[key];
    },
    changeBusy(key: string, val: boolean) {
        if (val && store.forms[key]) store.forms[key].busy = val;
        else
            setTimeout(() => {
                if (store.forms[key]) store.forms[key].busy = val;
            }, 100);
    }
});

export const useFormStore = () => store;
