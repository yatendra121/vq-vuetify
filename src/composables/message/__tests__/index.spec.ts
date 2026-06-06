import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useMessageInstance } from "../index";
import { useMessageStore } from "../../../store/reactivity/message";

// `useMessageInstance` returns a process-wide singleton that captures the
// message store on first construction. We therefore install a single pinia
// for the whole file, force the singleton to bind to it, and reset the
// store's contents between tests rather than swapping pinia instances.
describe("useMessageInstance", () => {
    beforeAll(() => {
        setActivePinia(createPinia());
        useMessageInstance(); // bind the singleton's store to this pinia
    });

    beforeEach(() => {
        const store = useMessageStore();
        store.items.splice(0);
        store.id = 1;
    });

    it("returns the same singleton instance on every call", () => {
        expect(useMessageInstance()).toBe(useMessageInstance());
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
