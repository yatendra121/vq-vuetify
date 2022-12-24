import { defineStore } from 'pinia'
type DataObject = Record<string, any>

export type FormFilterData = {
    values: DataObject
    resetRequired: boolean
    reloadRequired: boolean
}
type FormFilterDataState = { [key: string]: FormFilterData }

export const useFormFilterStore = defineStore({
    id: 'form_filter_values_lib',
    state: () => ({ forms: {} } as { forms: FormFilterDataState }),
    actions: {
        addForm(key: string, values: DataObject) {
            const newForm = {
                values,
                resetRequired: false,
                reloadRequired: false
            }
            this.forms[key] = newForm
        },
        removeForm(key: string) {
            delete this.forms[key]
        },
        setReloadValue(key: string, val: boolean) {
            this.forms[key].reloadRequired = val
        },
        setResetValue(key: string, val: boolean) {
            this.forms[key].resetRequired = val
        }
    }
})
