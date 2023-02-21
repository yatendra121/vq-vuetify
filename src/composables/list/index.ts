import { reactive } from 'vue'

interface List<T> {
    items: T[]
    finished: boolean
    loading: boolean
}

//
const allList = reactive<{ [key: string]: List<any> }>({})

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
            finished: false,
            loading: false
        })

        allList[key] = objData

        return allList[key]
    }

    /**
     * Using for dalete a existing single list
     * @returns void
     */
    const removeList = () => {
        delete allList[key]
    }

    /**
     * Using for colecting a list if it is not exist then create & return
     * @returns A List
     */
    const collectListValues = <T>(): List<T> => {
        return allList[key] ?? createNewList<T>()
    }

    /**
     * Using for get index of an item
     * @param itemId
     * @returns
     */
    const getItemIndex = (itemId: string | number) => {
        return allList[key]?.items.findIndex((item: any) => item?.id === itemId)
    }

    /**
     * Using for update an value of a single list
     * @param itemId
     * @param value
     * @param itemKey
     */
    const updateListItemValue = (itemId: string, value: unknown, itemKey?: string) => {
        const itemIndex = getItemIndex(itemId)
        if (typeof itemIndex === 'number') {
            if (typeof itemKey === 'string') allList[key].items[itemIndex][itemKey] = value
            else allList[key].items[itemIndex] = value
        } else console.error('Item id not exist')
    }

    /**
     * Using for dalete an value of a single list
     * @param itemId
     */
    const deleteListItemValue = (itemId: string) => {
        const itemIndex = getItemIndex(itemId)

        if (typeof itemIndex === 'number') {
            allList[key]?.items.splice(itemIndex, 1)
        } else console.error('Item id not exist')
    }

    return {
        removeList,
        collectListValues,
        updateListItemValue,
        deleteListItemValue
    }
}

export const updateItemKeyValue = (
    filterListId: string,
    itemId: string,
    key: string,
    value: any
) => {
    const { updateListItemValue } = useListRepository(filterListId + '_filter')
    updateListItemValue(itemId, value, key)
}

export const updateItemValue = (filterListId: string, itemId: string, value: any) => {
    const { updateListItemValue } = useListRepository(filterListId + '_filter')
    updateListItemValue(itemId, value)
}

export const deleteItemValue = (filterListId: string, itemId: string) => {
    const { deleteListItemValue } = useListRepository(filterListId + '_filter')
    deleteListItemValue(itemId)
}
