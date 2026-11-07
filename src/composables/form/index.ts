import { useFormFilterStore } from '../../store/reactivity/formFiler'

/**
 * Returns `reload` (refetch; a table stays on its page) and `reset` (back to the first page)
 * for the `VqDataTable` or `VqList` with `id`, from anywhere in the app.
 *
 * @param formKey `${id}_filter`, where `id` is the table's or list's `id`.
 * @see useVqListControls, which takes the `id` itself.
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

/**
 * Returns `reload` (refetch; a table stays on its page) and `reset` (back to the first
 * page) for the `VqDataTable` or `VqList` with this `id`, from anywhere in the app.
 * Same as `useFormFilterRepository(id + "_filter")`, without the suffix to remember.
 *
 * @param id The `id` of the table or list.
 * @example
 * const { reload } = useVqListControls("users");
 */
const useVqListControls = (id: string) => useFormFilterRepository(`${id}_filter`)

export { useFormFilterRepository, useVqListControls }
