import { reactive } from 'vue'

const allList: {
    [key: string]: {
        items: any[]
        finished: boolean
        loading: boolean
    }
} = reactive({})

export const useListRepository = (key: string) => {
    const createNewList = () => {
        const objData = reactive({
            items: [],
            finished: false,
            loading: false
        })
        // const items: Ref<any[]> = ref([])
        // const finished: Ref<boolean> = ref(false)
        // const loading: Ref<boolean> = ref(false)

        allList[key] = objData

        return allList[key]
    }

    const removeList = () => {
        delete allList[key]
    }

    const collectListValues = () => {
        return allList[key] ?? createNewList()
    }

    const updateListItemValue = (
        itemId: string,
        value: any,
        itemKey?: string
    ) => {
        const itemIndex = allList[key]?.items.findIndex(
            (item: any) => item.id === itemId
        )
        if (typeof itemIndex === 'number') {
            if (typeof itemKey === 'string')
                allList[key].items[itemIndex][itemKey] = value
            else allList[key].items[itemIndex] = value
        }
    }

    const deleteListItemValue = (itemId: string) => {
        const itemIndex = allList[key]?.items.findIndex(
            (item: any) => item.id === itemId
        )

        allList[key]?.items.splice(itemIndex, 1)
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

export const updateItemValue = (
    filterListId: string,
    itemId: string,
    value: any
) => {
    const { updateListItemValue } = useListRepository(filterListId + '_filter')
    updateListItemValue(itemId, value)
}

export const deleteItemValue = (filterListId: string, itemId: string) => {
    const { deleteListItemValue } = useListRepository(filterListId + '_filter')
    deleteListItemValue(itemId)
}
