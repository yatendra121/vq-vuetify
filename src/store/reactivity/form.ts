import { defineStore } from "pinia";
import { reactive } from "vue";
export type FormData = {
    busy: boolean;
};
type FormDataState = { [key: string]: FormData };

export const useFormStore = defineStore("form_data_lib", {
    state: () => ({ forms: {} }) as { forms: FormDataState },
    actions: {
        addForm(key: string) {
            const newForm = {
                busy: false
            };
            this.forms[key] = reactive(newForm);
        },
        removeForm(key: string) {
            delete this.forms[key];
        },
        changeBusy(key: string, val: boolean) {
            if (val && this.forms[key]) this.forms[key].busy = val;
            else
                setTimeout(() => {
                    if (this.forms[key]) this.forms[key].busy = val;
                }, 100);
        }
    }
});
