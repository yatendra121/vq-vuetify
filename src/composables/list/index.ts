import { reactive } from "vue";
import { useListDataStore, type List } from "../../store/reactivity/list";

/**
 * This function is using for internal uses only
 * Using for interact with reactive list data
 * @param key
 * @returns Object
 */
export const useListRepository = (key: string) => {
    // Resolve per-app state lazily so it is not shared across SSR requests.
    const allList = useListDataStore().lists;

    /**
     * Using for create a new list
     * @returns A single list
     */
    const createNewList = <T>(): List<T> => {
        const objData = reactive<List<T>>({
            items: [],
            totalItems: 0,
            finished: false,
            loading: false
        });

        allList[key] = objData;

        return allList[key];
    };

    /**
     * Using for dalete a existing single list
     * @returns void
     */
    const removeList = () => {
        delete allList[key];
    };

    /**
     * Using for colecting a list if it is not exist then create & return
     * @returns A List
     */
    const collectListValues = <T>(): List<T> => {
        return allList[key] ?? createNewList<T>();
    };

    /**
     * Using for get index of an item
     * @param itemId
     * @returns
     */
    const getItemIndex = (itemId: string | number) => {
        return allList[key]?.items.findIndex((item: { id?: unknown } | null | undefined) => item?.id === itemId) ?? -1;
    };

    /**
     * Using for update an value of a single list
     * @param itemId
     * @param value
     * @param itemKey
     */
    const updateListItemValue = (itemId: string | number, value: unknown, itemKey?: string) => {
        const itemIndex = getItemIndex(itemId);
        if (itemIndex >= 0) {
            if (typeof itemKey === "string") allList[key].items[itemIndex][itemKey] = value;
            else allList[key].items[itemIndex] = value;
        } else console.error("Item id not exist");
    };

    /**
     * Using for dalete an value of a single list
     * @param itemId
     */
    const deleteListItemValue = (itemId: string | number) => {
        const itemIndex = getItemIndex(itemId);

        if (itemIndex >= 0) {
            allList[key]?.items.splice(itemIndex, 1);
            allList[key].totalItems = (allList[key]?.totalItems ?? 0) - 1;
        } else console.error("Item id not exist");
    };

    return {
        removeList,
        collectListValues,
        updateListItemValue,
        deleteListItemValue
    };
};

// A union of [key, value] pairs, so the value is checked against its own key's type.
type KeyValueArgs<TItem> = {
    [K in keyof TItem & string]: [key: K, value: TItem[K]];
}[keyof TItem & string];

/**
 * Sets one key of a loaded row in the `VqDataTable` or `VqList` with `id`, without
 * refetching. Logs an error if no row has that `id`.
 *
 * Pass the row type to have `key` suggested and `value` checked against it.
 *
 * @example
 * updateItemKeyValue<User>("users", user.id, "status", "active");
 */
export const updateItemKeyValue = <TItem = any>(
    filterListId: string,
    itemId: string | number,
    ...[key, value]: KeyValueArgs<TItem>
) => {
    const { updateListItemValue } = useListRepository(filterListId + "_filter");
    updateListItemValue(itemId, value, key);
};

/**
 * Replaces a loaded row in the `VqDataTable` or `VqList` with `id`, without
 * refetching. Logs an error if no row has that `id`.
 *
 * Pass the row type to have `value` checked against it: `updateItemValue<User>(...)`.
 */
export const updateItemValue = <TItem = any>(
    filterListId: string,
    itemId: string | number,
    value: TItem
) => {
    const { updateListItemValue } = useListRepository(filterListId + "_filter");
    updateListItemValue(itemId, value);
};

/**
 * Removes a loaded row from the `VqDataTable` or `VqList` with `id`, without
 * refetching. Logs an error if no row has that `id`.
 */
export const deleteItemValue = (filterListId: string, itemId: string | number) => {
    const { deleteListItemValue } = useListRepository(filterListId + "_filter");
    deleteListItemValue(itemId);
};
