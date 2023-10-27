import { useFormFilterStore } from '../../store/reactivity/formFiler'

const useFormFilterRepository = (formKey: string) => {
    const formFilterStore = useFormFilterStore()
    const { setReloadValue, setResetValue } = formFilterStore

    const reload = () => {
        setReloadValue(formKey, true)
    }

    const reset = () => {
        setResetValue(formKey, true)
    }

    return {
        reload,
        reset
    }
}
const useFormRepository = () => {}

export { useFormRepository, useFormFilterRepository }
