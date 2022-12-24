export type ConfirmState = {
    show: boolean;
    title: string;
    description: string;
    callback: () => void | Promise<void>;
};
export declare const useConfirmStore: import("pinia").StoreDefinition<"confirm", ConfirmState, {}, {
    setConfirmValues(item: ConfirmState): void;
    showDialoag(): void;
    close(val: boolean): void;
}>;
//# sourceMappingURL=confirm.d.ts.map