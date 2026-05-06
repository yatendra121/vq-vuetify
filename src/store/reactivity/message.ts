import { reactive } from "vue";

export interface MessageItem {
    id: number;
    message: string;
    color: string;
}

export interface MessageItemWithoutId {
    message: string;
    color: string;
}

const store = reactive({
    items: [] as MessageItem[],
    id: 1,
    addMessage(item: MessageItemWithoutId) {
        store.items.push({ id: store.id++, ...item });
    },
    removeMessage() {
        store.items.splice(0, 1);
    }
});

export const useMessageStore = () => store;
