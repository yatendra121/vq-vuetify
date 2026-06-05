import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    useListRepository,
    updateItemKeyValue,
    updateItemValue,
    deleteItemValue
} from "../index";

// The repository is backed by a module-level reactive singleton keyed by
// string, so every test removes the keys it touches to stay isolated.
const seed = (key: string, items: any[], totalItems = items.length) => {
    const repo = useListRepository(key);
    const list = repo.collectListValues<any>();
    list.items = items;
    list.totalItems = totalItems;
    return { repo, list };
};

describe("useListRepository", () => {
    let errorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        errorSpy.mockRestore();
        ["a", "b", "c", "d", "e", "f", "users_filter", "posts_filter"].forEach((k) =>
            useListRepository(k).removeList()
        );
    });

    it("collectListValues creates a fresh list with sane defaults", () => {
        const list = useListRepository("a").collectListValues<any>();
        expect(list).toEqual({ items: [], totalItems: 0, finished: false, loading: false });
    });

    it("collectListValues returns the same list instance on subsequent calls", () => {
        const repo = useListRepository("b");
        const first = repo.collectListValues<any>();
        first.items.push({ id: "1" });
        const second = repo.collectListValues<any>();
        expect(second).toBe(first);
        expect(second.items).toHaveLength(1);
    });

    it("removeList drops the list so the next collect recreates it empty", () => {
        const repo = useListRepository("c");
        const first = repo.collectListValues<any>();
        first.items.push({ id: "1" });
        repo.removeList();
        const recreated = repo.collectListValues<any>();
        expect(recreated.items).toHaveLength(0);
        expect(recreated).not.toBe(first);
    });

    it("updateListItemValue replaces the whole item when no key is given", () => {
        const { repo, list } = seed("d", [{ id: "1", name: "ann" }]);
        repo.updateListItemValue("1", { id: "1", name: "bob" });
        expect(list.items[0]).toEqual({ id: "1", name: "bob" });
    });

    it("updateListItemValue updates a single field when a key is given", () => {
        const { repo, list } = seed("d", [{ id: "1", name: "ann", active: false }]);
        repo.updateListItemValue("1", true, "active");
        expect(list.items[0]).toEqual({ id: "1", name: "ann", active: true });
    });

    it("deleteListItemValue removes the matching item and decrements totalItems", () => {
        const { repo, list } = seed("e", [{ id: "1" }, { id: "2" }], 2);
        repo.deleteListItemValue("1");
        expect(list.items).toEqual([{ id: "2" }]);
        expect(list.totalItems).toBe(1);
    });

    it("logs an error (and does not throw) when operating on a non-existent list", () => {
        const repo = useListRepository("f"); // never collected -> no list
        expect(() => repo.updateListItemValue("1", "x")).not.toThrow();
        expect(() => repo.deleteListItemValue("1")).not.toThrow();
        expect(errorSpy).toHaveBeenCalledWith("Item id not exist");
    });

    describe("global filter-scoped helpers (append `_filter` to the id)", () => {
        it("updateItemKeyValue updates a single field on the *_filter list", () => {
            const { list } = seed("users_filter", [{ id: "1", status: "off" }]);
            updateItemKeyValue("users", "1", "status", "on");
            expect(list.items[0].status).toBe("on");
        });

        it("updateItemValue replaces the whole item on the *_filter list", () => {
            const { list } = seed("users_filter", [{ id: "1", name: "ann" }]);
            updateItemValue("users", "1", { id: "1", name: "bob" });
            expect(list.items[0]).toEqual({ id: "1", name: "bob" });
        });

        it("deleteItemValue removes the item from the *_filter list", () => {
            const { list } = seed("posts_filter", [{ id: "1" }, { id: "2" }], 2);
            deleteItemValue("posts", "1");
            expect(list.items).toEqual([{ id: "2" }]);
            expect(list.totalItems).toBe(1);
        });
    });
});
