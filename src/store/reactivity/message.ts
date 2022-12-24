import { defineStore } from 'pinia'

export interface MessageItem {
    id: number
    message: string
    color: string
}

export interface MessageItemWithoutId {
    message: string
    color: string
}

export type MessageState = {
    items: MessageItem[]
    id: number
}

export const useMessageStore = defineStore({
    id: 'message_lib',
    state: () =>
        ({
            items: [],
            id: 1
        } as MessageState),
    getters: {
        itemsArray(): MessageItem[] {
            return this.items
        }
    },
    actions: {
        addMessage(item: MessageItemWithoutId) {
            this.items.push({ id: this.id++, ...item })
        },
        removeMessage() {
            this.items.splice(0, 1)
        }
    }
})
