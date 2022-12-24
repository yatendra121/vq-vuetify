export interface MessageItem {
    id: number;
    message: string;
    color: string;
}
export interface MessageItemWithoutId {
    message: string;
    color: string;
}
export type MessageState = {
    items: MessageItem[];
    id: number;
};
export declare const useMessageStore: import("pinia").StoreDefinition<"message_lib", MessageState, {
    itemsArray(): MessageItem[];
}, {
    addMessage(item: MessageItemWithoutId): void;
    removeMessage(): void;
}>;
//# sourceMappingURL=message.d.ts.map