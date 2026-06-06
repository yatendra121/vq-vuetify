import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useFormFilterStore } from "../formFiler";

describe("useFormFilterStore", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it("starts with an empty forms map", () => {
        const store = useFormFilterStore();
        expect(store.forms).toEqual({});
    });

    it("addForm creates an entry with the values and default flags", () => {
        const store = useFormFilterStore();
        store.addForm("users", { search: "ann" });

        expect(store.forms["users"]).toEqual({
            values: { search: "ann" },
            resetRequired: false,
            reloadRequired: false
        });
    });

    it("addForm overwrites an existing key", () => {
        const store = useFormFilterStore();
        store.addForm("users", { search: "ann" });
        store.addForm("users", { search: "bob" });

        expect(store.forms["users"].values).toEqual({ search: "bob" });
    });

    it("removeForm deletes the entry", () => {
        const store = useFormFilterStore();
        store.addForm("users", { search: "ann" });
        store.removeForm("users");

        expect(store.forms["users"]).toBeUndefined();
    });

    it("updateValues replaces the values of an existing form", () => {
        const store = useFormFilterStore();
        store.addForm("users", { search: "ann" });
        store.updateValues("users", { search: "bob", page: 2 });

        expect(store.forms["users"].values).toEqual({ search: "bob", page: 2 });
    });

    it("updateValues is a no-op when the key does not exist", () => {
        const store = useFormFilterStore();
        store.updateValues("missing", { search: "x" });

        expect(store.forms["missing"]).toBeUndefined();
    });

    it("setReloadValue toggles reloadRequired only for an existing form", () => {
        const store = useFormFilterStore();
        store.addForm("users", {});

        store.setReloadValue("users", true);
        expect(store.forms["users"].reloadRequired).toBe(true);

        store.setReloadValue("users", false);
        expect(store.forms["users"].reloadRequired).toBe(false);

        // no-op for unknown key (must not create one)
        store.setReloadValue("missing", true);
        expect(store.forms["missing"]).toBeUndefined();
    });

    it("setResetValue toggles resetRequired only for an existing form", () => {
        const store = useFormFilterStore();
        store.addForm("users", {});

        store.setResetValue("users", true);
        expect(store.forms["users"].resetRequired).toBe(true);

        store.setResetValue("users", false);
        expect(store.forms["users"].resetRequired).toBe(false);

        store.setResetValue("missing", true);
        expect(store.forms["missing"]).toBeUndefined();
    });
});
