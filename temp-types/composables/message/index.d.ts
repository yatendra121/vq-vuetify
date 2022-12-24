declare class Message {
    static instance: Message;
    private constructor();
    private messageStore;
    static getInstance(): Message;
    /**
     * Returns the id of the [[BaseTx]]
     */
    success(message: string): void;
    /**
     * Returns the id of the [[BaseTx]]
     */
    warning(message: string): void;
    /**
     * Returns the id of the [[BaseTx]]
     */
    error(message: string): void;
}
declare const useMessageInstance: () => Message;
export { useMessageInstance };
//# sourceMappingURL=index.d.ts.map