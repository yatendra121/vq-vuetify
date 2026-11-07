import { useFormFilterStore } from '../../store/reactivity/formFiler'

/**
 * Returns `reload` (refetch; a table stays on its page) and `reset` (back to the first page)
 * for the `VqDataTable` or `VqList` with `id`, from anywhere in the app.
 *
 * @param formKey `${id}_filter`, where `id` is the table's or list's `id`.
 * @example
 * const { reload } = useFormFilterRepository("users_filter");
 */
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

export { useFormFilterRepository }
