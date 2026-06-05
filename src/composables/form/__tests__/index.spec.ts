import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useFormFilterRepository } from "../index";
import { useFormFilterStore } from "../../../store/reactivity/formFiler";

describe("useFormFilterRepository", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it("reload() flips reloadRequired on the matching filter form", () => {
        const store = useFormFilterStore();
        store.addForm("users", {});

        useFormFilterRepository("users").reload();

        expect(store.forms["users"].reloadRequired).toBe(true);
        expect(store.forms["users"].resetRequired).toBe(false);
    });

    it("reset() flips resetRequired on the matching filter form", () => {
        const store = useFormFilterStore();
        store.addForm("users", {});

        useFormFilterRepository("users").reset();

        expect(store.forms["users"].resetRequired).toBe(true);
        expect(store.forms["users"].reloadRequired).toBe(false);
    });

    it("is a no-op when the filter form has not been registered", () => {
        const store = useFormFilterStore();
        const repo = useFormFilterRepository("missing");

        expect(() => {
            repo.reload();
            repo.reset();
        }).not.toThrow();
        expect(store.forms["missing"]).toBeUndefined();
    });
});
