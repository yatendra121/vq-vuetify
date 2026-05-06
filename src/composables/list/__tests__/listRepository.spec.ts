import { describe, it, expect } from "vitest";
import {
    useListRepository,
    updateItemKeyValue,
    updateItemValue,
    deleteItemValue
} from "..";

describe("useListRepository", () => {
    it("gives each caller its own list state", () => {
        const a = useListRepository("isolated_a");
        const b = useListRepository("isolated_b");

        const listA = a.collectListValues<{ id: string }>();
        const listB = b.collectListValues<{ id: string }>();

        listA.items.push({ id: "1" });
        expect(listB.items).toHaveLength(0);

        a.removeList();
        b.removeList();
    });

    it("two instances with the same id do not share items or loading state", () => {
        const first = useListRepository("collision_users_filter");
        const second = useListRepository("collision_users_filter");

        const firstList = first.collectListValues<{ id: string }>();
        const secondList = second.collectListValues<{ id: string }>();

        firstList.items.push({ id: "1" });
        firstList.loading = true;
        firstList.totalItems = 1;

        expect(secondList.items).toHaveLength(0);
        expect(secondList.loading).toBe(false);
        expect(secondList.totalItems).toBe(0);

        first.removeList();
        second.removeList();
    });

    it("global helpers update every live instance for a filterListId", () => {
        const a = useListRepository("propagate_users_filter");
        const b = useListRepository("propagate_users_filter");

        const listA = a.collectListValues<{ id: string; name: string }>();
        const listB = b.collectListValues<{ id: string; name: string }>();

        listA.items.push({ id: "42", name: "old" });
        listB.items.push({ id: "42", name: "old" });
        listA.totalItems = 1;
        listB.totalItems = 1;

        updateItemKeyValue("propagate_users", "42", "name", "new");

        expect(listA.items[0].name).toBe("new");
        expect(listB.items[0].name).toBe("new");

        deleteItemValue("propagate_users", "42");

        expect(listA.items).toHaveLength(0);
        expect(listB.items).toHaveLength(0);
        expect(listA.totalItems).toBe(0);
        expect(listB.totalItems).toBe(0);

        a.removeList();
        b.removeList();
    });

    it("removeList drops the instance from the global registry", () => {
        const a = useListRepository("removed_users_filter");
        const b = useListRepository("removed_users_filter");

        const listA = a.collectListValues<{ id: string; name: string }>();
        const listB = b.collectListValues<{ id: string; name: string }>();

        listA.items.push({ id: "1", name: "hello" });
        listB.items.push({ id: "1", name: "hello" });

        a.removeList();

        // After removeList, only listB receives global mutations.
        updateItemValue("removed_users", "1", { id: "1", name: "world" });

        expect(listA.items[0].name).toBe("hello");
        expect(listB.items[0].name).toBe("world");

        b.removeList();
    });

    it("updateItemValue replaces the entire item when no key is given", () => {
        const a = useListRepository("replace_filter");
        const list = a.collectListValues<{ id: string; n: number }>();
        list.items.push({ id: "x", n: 1 });
        list.totalItems = 1;

        updateItemValue("replace", "x", { id: "x", n: 99 });

        expect(list.items[0].n).toBe(99);
        a.removeList();
    });
});
