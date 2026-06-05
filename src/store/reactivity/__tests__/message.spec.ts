import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useMessageStore } from "../message";

describe("useMessageStore", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it("starts empty with the id counter at 1", () => {
        const store = useMessageStore();
        expect(store.items).toEqual([]);
        expect(store.id).toBe(1);
    });

    it("addMessage appends items with auto-incrementing ids", () => {
        const store = useMessageStore();
        store.addMessage({ message: "saved", color: "success" });
        store.addMessage({ message: "careful", color: "warning" });

        expect(store.items).toEqual([
            { id: 1, message: "saved", color: "success" },
            { id: 2, message: "careful", color: "warning" }
        ]);
        expect(store.id).toBe(3);
    });

    it("itemsArray getter mirrors items", () => {
        const store = useMessageStore();
        store.addMessage({ message: "hi", color: "info" });
        expect(store.itemsArray).toEqual(store.items);
        expect(store.itemsArray).toHaveLength(1);
    });

    it("removeMessage removes the oldest item (FIFO)", () => {
        const store = useMessageStore();
        store.addMessage({ message: "first", color: "success" });
        store.addMessage({ message: "second", color: "error" });

        store.removeMessage();

        expect(store.items).toEqual([{ id: 2, message: "second", color: "error" }]);
    });

    it("removeMessage on an empty queue is a safe no-op", () => {
        const store = useMessageStore();
        expect(() => store.removeMessage()).not.toThrow();
        expect(store.items).toEqual([]);
    });
});
