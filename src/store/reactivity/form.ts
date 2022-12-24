import { defineStore } from 'pinia'
export type FormData = {
    busy: boolean
}
type FormDataState = { [key: string]: FormData }

export const useFormStore = defineStore({
    id: 'form_data_lib',
    state: () => ({ forms: {} } as { forms: FormDataState }),
    actions: {
        addForm(key: string) {
            const newForm = {
                busy: false
            }
            this.forms[key] = newForm
        },
        removeForm(key: string) {
            delete this.forms[key]
        },
        changeBusy(key: string, val: boolean) {
            if (this.forms[key] === undefined) return
            if (val) this.forms[key].busy = val
            else
                setTimeout(() => {
                    this.forms[key].busy = val
                }, 200)
        }
    }
})
