import { reactive } from "vue";

interface List<T> {
    items: T[];
    totalItems: number;
    finished: boolean;
    loading: boolean;
}

//
const allList = reactive<{ [key: string]: List<any> }>({});

/**
 * This function is using for internal uses only
 * Using for interact with reactive allList data
 * @param key
 * @returns Object
 */
export const useListRepository = (key: string) => {
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
        return allList[key]?.items.findIndex((item: any) => item?.id === itemId);
    };

    /**
     * Using for update an value of a single list
     * @param itemId
     * @param value
     * @param itemKey
     */
    const updateListItemValue = (itemId: string, value: unknown, itemKey?: string) => {
        const itemIndex = getItemIndex(itemId);
        if (typeof itemIndex === "number") {
            if (typeof itemKey === "string") allList[key].items[itemIndex][itemKey] = value;
            else allList[key].items[itemIndex] = value;
        } else console.error("Item id not exist");
    };

    /**
     * Using for dalete an value of a single list
     * @param itemId
     */
    const deleteListItemValue = (itemId: string) => {
        const itemIndex = getItemIndex(itemId);

        if (typeof itemIndex === "number") {
            allList[key]?.items.splice(itemIndex, 1);
            allList[key].totalItems = allList[key]?.totalItems - 1;
        } else console.error("Item id not exist");
    };

    return {
        removeList,
        collectListValues,
        updateListItemValue,
        deleteListItemValue
    };
};

export const updateItemKeyValue = (
    filterListId: string,
    itemId: string,
    key: string,
    value: any
) => {
    const { updateListItemValue } = useListRepository(filterListId + "_filter");
    updateListItemValue(itemId, value, key);
};

export const updateItemValue = (filterListId: string, itemId: string, value: any) => {
    const { updateListItemValue } = useListRepository(filterListId + "_filter");
    updateListItemValue(itemId, value);
};

export const deleteItemValue = (filterListId: string, itemId: string) => {
    const { deleteListItemValue } = useListRepository(filterListId + "_filter");
    deleteListItemValue(itemId);
};

/**
 * Non-creating peek for the mounted list at `key`. Returns undefined if no
 * list is mounted for that id — callers (e.g. useVqCrud) should skip sync
 * in that case rather than instantiating an orphan list.
 *
 * Exported for use by `useVqCrud`. Not part of the user-facing API.
 */
export const __peekListItem = (key: string, itemId: string | number) => {
    const list = allList[key];
    if (!list) return undefined;
    const index = list.items.findIndex((item: any) => item?.id === itemId);
    if (index < 0) return undefined;
    return { item: list.items[index], index, list };
};

/**
 * Insert an item at a specific index (or push if no index). Used by
 * useVqCrud to roll back an optimistic remove. No-op if no list mounted.
 */
export const __insertListItem = (key: string, item: unknown, atIndex?: number) => {
    const list = allList[key];
    if (!list) return;
    if (typeof atIndex === "number") list.items.splice(atIndex, 0, item);
    else list.items.push(item);
    list.totalItems += 1;
};

/**
 * Prepend an item to the mounted list at `key`. Used by useVqCrud for
 * optimistic create. No-op if no list mounted.
 */
export const __prependListItem = (key: string, item: unknown) => {
    const list = allList[key];
    if (!list) return;
    list.items.unshift(item);
    list.totalItems += 1;
};

/**
 * Delete an item by id without logging a "not exist" error — used by
 * useVqCrud after replacing a temp item with the server-confirmed one.
 */
export const __silentlyDeleteListItem = (key: string, itemId: string | number) => {
    const list = allList[key];
    if (!list) return;
    const index = list.items.findIndex((item: any) => item?.id === itemId);
    if (index < 0) return;
    list.items.splice(index, 1);
    list.totalItems = Math.max(0, list.totalItems - 1);
};
