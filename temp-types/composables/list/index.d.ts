interface List<T> {
    items: T[];
    totalItems: number;
    finished: boolean;
    loading: boolean;
}
/**
 * This function is using for internal uses only
 * Using for interact with reactive allList data
 * @param key
 * @returns Object
 */
export declare const useListRepository: (key: string) => {
    removeList: () => void;
    collectListValues: <T>() => List<T>;
    updateListItemValue: (itemId: string, value: unknown, itemKey?: string) => void;
    deleteListItemValue: (itemId: string) => void;
};
export declare const updateItemKeyValue: (filterListId: string, itemId: string, key: string, value: any) => void;
export declare const updateItemValue: (filterListId: string, itemId: string, value: any) => void;
export declare const deleteItemValue: (filterListId: string, itemId: string) => void;
export {};
//# sourceMappingURL=index.d.ts.map