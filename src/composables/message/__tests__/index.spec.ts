import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useMessageInstance } from "../index";
import { useMessageStore } from "../../../store/reactivity/message";

// `useMessageInstance` resolves the message store from the active pinia on
// every call, so a fresh pinia per test gives each case an isolated store.
describe("useMessageInstance", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it("binds to the active pinia store on every call", () => {
        useMessageInstance().success("hi");
        expect(useMessageStore().items).toHaveLength(1);
    });

    it("success() adds a message with the success color", () => {
        useMessageInstance().success("saved");
        expect(useMessageStore().items).toEqual([{ id: 1, message: "saved", color: "success" }]);
    });

    it("warning() adds a message with the warning color", () => {
        useMessageInstance().warning("careful");
        expect(useMessageStore().items).toEqual([{ id: 1, message: "careful", color: "warning" }]);
    });

    it("error() adds a message with the error color", () => {
        useMessageInstance().error("boom");
        expect(useMessageStore().items).toEqual([{ id: 1, message: "boom", color: "error" }]);
    });

    it("queues multiple messages in call order", () => {
        const msg = useMessageInstance();
        msg.success("a");
        msg.error("b");
        expect(useMessageStore().items.map((m) => [m.message, m.color])).toEqual([
            ["a", "success"],
            ["b", "error"]
        ]);
    });
});
