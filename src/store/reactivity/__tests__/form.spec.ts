import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useFormStore } from "../form";

describe("useFormStore", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("starts with an empty forms map", () => {
        const store = useFormStore();
        expect(store.forms).toEqual({});
    });

    it("addForm registers a form that is not busy", () => {
        const store = useFormStore();
        store.addForm("create-user");
        expect(store.forms["create-user"]).toEqual({ busy: false });
    });

    it("removeForm deletes the form", () => {
        const store = useFormStore();
        store.addForm("create-user");
        store.removeForm("create-user");
        expect(store.forms["create-user"]).toBeUndefined();
    });

    it("changeBusy(key, true) sets busy synchronously", () => {
        const store = useFormStore();
        store.addForm("create-user");

        store.changeBusy("create-user", true);
        expect(store.forms["create-user"].busy).toBe(true);
    });

    it("changeBusy(key, false) clears busy after a 100ms debounce", () => {
        const store = useFormStore();
        store.addForm("create-user");
        store.changeBusy("create-user", true);

        store.changeBusy("create-user", false);
        // still busy immediately after the call
        expect(store.forms["create-user"].busy).toBe(true);

        vi.advanceTimersByTime(100);
        expect(store.forms["create-user"].busy).toBe(false);
    });

    it("changeBusy(key, true) is a no-op for an unknown form", () => {
        const store = useFormStore();
        store.changeBusy("missing", true);
        expect(store.forms["missing"]).toBeUndefined();
    });

    it("changeBusy(key, false) does not create a missing form after the debounce", () => {
        const store = useFormStore();
        store.changeBusy("missing", false);
        vi.advanceTimersByTime(100);
        expect(store.forms["missing"]).toBeUndefined();
    });
});
