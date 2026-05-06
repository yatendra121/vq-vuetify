import { reactive } from "vue";

interface List<T> {
    items: T[];
    totalItems: number;
    finished: boolean;
    loading: boolean;
}

const allLists = new Map<string, Set<List<any>>>();

const updateAcrossInstances = (
    key: string,
    itemId: string,
    value: unknown,
    itemKey?: string
) => {
    const set = allLists.get(key);
    if (!set || set.size === 0) {
        console.error("Item id not exist");
        return;
    }
    let touched = false;
    for (const inst of set) {
        const idx = inst.items.findIndex((item: any) => item?.id === itemId);
        if (idx >= 0) {
            if (typeof itemKey === "string") inst.items[idx][itemKey] = value;
            else inst.items[idx] = value;
            touched = true;
        }
    }
    if (!touched) console.error("Item id not exist");
};

const deleteAcrossInstances = (key: string, itemId: string) => {
    const set = allLists.get(key);
    if (!set || set.size === 0) {
        console.error("Item id not exist");
        return;
    }
    let touched = false;
    for (const inst of set) {
        const idx = inst.items.findIndex((item: any) => item?.id === itemId);
        if (idx >= 0) {
            inst.items.splice(idx, 1);
            inst.totalItems = inst.totalItems - 1;
            touched = true;
        }
    }
    if (!touched) console.error("Item id not exist");
};

/**
 * Per-component list state. Each call returns fresh reactive state and
 * registers it in a shared Map<key, Set<list>> so that two components
 * mounted with the same id don't clobber each other's items/loading.
 */
export const useListRepository = (key: string) => {
    const list = reactive<List<unknown>>({
        items: [],
        totalItems: 0,
        finished: false,
        loading: false
    });

    let registered = false;

    const register = () => {
        if (registered) return;
        let set = allLists.get(key);
        if (!set) {
            set = new Set();
            allLists.set(key, set);
        }
        set.add(list);
        registered = true;
    };

    const removeList = () => {
        const set = allLists.get(key);
        set?.delete(list);
        if (set && set.size === 0) allLists.delete(key);
        registered = false;
    };

    const collectListValues = <T>(): List<T> => {
        register();
        return list as List<T>;
    };

    return {
        removeList,
        collectListValues,
        updateListItemValue: (itemId: string, value: unknown, itemKey?: string) =>
            updateAcrossInstances(key, itemId, value, itemKey),
        deleteListItemValue: (itemId: string) => deleteAcrossInstances(key, itemId)
    };
};

export const updateItemKeyValue = (
    filterListId: string,
    itemId: string,
    key: string,
    value: any
) => {
    updateAcrossInstances(filterListId + "_filter", itemId, value, key);
};

export const updateItemValue = (filterListId: string, itemId: string, value: any) => {
    updateAcrossInstances(filterListId + "_filter", itemId, value);
};

export const deleteItemValue = (filterListId: string, itemId: string) => {
    deleteAcrossInstances(filterListId + "_filter", itemId);
};
