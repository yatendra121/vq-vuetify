export declare const useListRepository: (key: string) => {
    removeList: () => void;
    collectListValues: () => {
        items: any[];
        finished: boolean;
        loading: boolean;
    };
    updateListItemValue: (itemId: string, value: any, itemKey?: string) => void;
    deleteListItemValue: (itemId: string) => void;
};
export declare const updateItemKeyValue: (filterListId: string, itemId: string, key: string, value: any) => void;
export declare const updateItemValue: (filterListId: string, itemId: string, value: any) => void;
export declare const deleteItemValue: (filterListId: string, itemId: string) => void;
//# sourceMappingURL=index.d.ts.map