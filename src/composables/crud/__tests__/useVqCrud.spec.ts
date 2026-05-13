import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock @qnx/composables/axios before importing the composable under test.
const requestMock = vi.fn();
vi.mock("@qnx/composables/axios", () => ({
    useAsyncAxios: (url: string, args: { method?: string; data?: unknown }) =>
        requestMock(url, args)
}));

import { useListRepository } from "../../list";
import { useVqCrud } from "..";

interface User {
    id: string;
    name: string;
}

describe("useVqCrud", () => {
    beforeEach(() => {
        requestMock.mockReset();
    });

    describe("HTTP routing", () => {
        it("list() GETs the resource base and returns response.data", async () => {
            requestMock.mockResolvedValueOnce({ data: { data: [], total: 0 } });
            const api = useVqCrud<User>({ resource: "users" });
            const res = await api.list();
            expect(requestMock).toHaveBeenCalledWith("users", { method: "GET" });
            expect(res).toEqual({ data: [], total: 0 });
        });

        it("list() appends a query string when params are passed", async () => {
            requestMock.mockResolvedValueOnce({ data: { data: [], total: 0 } });
            const api = useVqCrud<User>({ resource: "users" });
            await api.list({ page: 2, itemsPerPage: 10 });
            const [url] = requestMock.mock.calls[0];
            expect(url).toContain("users?");
            expect(url).toContain("page=2");
        });

        it("get() hits /{resource}/{id}", async () => {
            requestMock.mockResolvedValueOnce({ data: { id: "7", name: "Ada" } });
            const api = useVqCrud<User>({ resource: "users" });
            const u = await api.get("7");
            expect(requestMock).toHaveBeenCalledWith("users/7", { method: "GET" });
            expect(u.name).toBe("Ada");
        });

        it("create() POSTs the body", async () => {
            requestMock.mockResolvedValueOnce({ data: { id: "1", name: "Ada" } });
            const api = useVqCrud<User>({ resource: "users" });
            await api.create({ name: "Ada" });
            expect(requestMock).toHaveBeenCalledWith("users", {
                method: "POST",
                data: { name: "Ada" }
            });
        });

        it("update() PUTs the body to /{resource}/{id}", async () => {
            requestMock.mockResolvedValueOnce({ data: { id: "1", name: "New" } });
            const api = useVqCrud<User>({ resource: "users" });
            await api.update("1", { name: "New" });
            expect(requestMock).toHaveBeenCalledWith("users/1", {
                method: "PUT",
                data: { name: "New" }
            });
        });

        it("remove() DELETEs /{resource}/{id}", async () => {
            requestMock.mockResolvedValueOnce({});
            const api = useVqCrud<User>({ resource: "users" });
            await api.remove("1");
            expect(requestMock).toHaveBeenCalledWith("users/1", { method: "DELETE" });
        });

        it("trims trailing slashes from the resource", async () => {
            requestMock.mockResolvedValueOnce({ data: { id: "1", name: "" } });
            const api = useVqCrud<User>({ resource: "users/" });
            await api.get("1");
            expect(requestMock).toHaveBeenCalledWith("users/1", { method: "GET" });
        });
    });

    describe("non-optimistic list sync", () => {
        it("create() prepends the server response to the mounted list", async () => {
            const repo = useListRepository("crud-create_filter");
            const list = repo.collectListValues<User>();

            requestMock.mockResolvedValueOnce({ data: { id: "1", name: "Ada" } });
            const api = useVqCrud<User>({ resource: "users", listId: "crud-create" });
            await api.create({ name: "Ada" });

            expect(list.items).toEqual([{ id: "1", name: "Ada" }]);
            expect(list.totalItems).toBe(1);

            repo.removeList();
        });

        it("update() replaces the row with the server response", async () => {
            const repo = useListRepository("crud-update_filter");
            const list = repo.collectListValues<User>();
            list.items.push({ id: "1", name: "Old" });
            list.totalItems = 1;

            requestMock.mockResolvedValueOnce({ data: { id: "1", name: "Server" } });
            const api = useVqCrud<User>({ resource: "users", listId: "crud-update" });
            await api.update("1", { name: "New" });

            expect(list.items[0]).toEqual({ id: "1", name: "Server" });

            repo.removeList();
        });

        it("remove() drops the row from the list after server confirms", async () => {
            const repo = useListRepository("crud-remove_filter");
            const list = repo.collectListValues<User>();
            list.items.push({ id: "1", name: "Ada" });
            list.totalItems = 1;

            requestMock.mockResolvedValueOnce({});
            const api = useVqCrud<User>({ resource: "users", listId: "crud-remove" });
            await api.remove("1");

            expect(list.items).toHaveLength(0);
            expect(list.totalItems).toBe(0);

            repo.removeList();
        });

        it("does nothing to a list that is not mounted", async () => {
            // No useListRepository() call — no list exists for this id.
            requestMock.mockResolvedValueOnce({ data: { id: "1", name: "Ada" } });
            const api = useVqCrud<User>({ resource: "users", listId: "missing-list" });
            await expect(api.create({ name: "Ada" })).resolves.toBeDefined();
        });
    });

    describe("optimistic mode", () => {
        it("create() inserts a temp row before the request and replaces it on success", async () => {
            const repo = useListRepository("crud-opt-create_filter");
            const list = repo.collectListValues<User>();

            let resolveRequest!: (value: unknown) => void;
            requestMock.mockImplementationOnce(
                () => new Promise((resolve) => (resolveRequest = resolve))
            );

            const api = useVqCrud<User>({
                resource: "users",
                listId: "crud-opt-create",
                optimistic: true
            });
            const promise = api.create({ name: "Ada" });

            // Optimistic row visible before resolve.
            expect(list.items).toHaveLength(1);
            expect((list.items[0] as User).name).toBe("Ada");
            expect(String((list.items[0] as User).id)).toMatch(/^__vq_tmp_/);

            resolveRequest({ data: { id: "real-1", name: "Ada" } });
            await promise;

            expect(list.items).toHaveLength(1);
            expect(list.items[0]).toEqual({ id: "real-1", name: "Ada" });
            expect(list.totalItems).toBe(1);

            repo.removeList();
        });

        it("create() removes the temp row when the request fails", async () => {
            const repo = useListRepository("crud-opt-create-fail_filter");
            const list = repo.collectListValues<User>();

            requestMock.mockRejectedValueOnce(new Error("boom"));
            const api = useVqCrud<User>({
                resource: "users",
                listId: "crud-opt-create-fail",
                optimistic: true
            });

            await expect(api.create({ name: "X" })).rejects.toThrow("boom");
            expect(list.items).toHaveLength(0);
            expect(list.totalItems).toBe(0);

            repo.removeList();
        });

        it("update() applies the patch immediately and reverts on failure", async () => {
            const repo = useListRepository("crud-opt-update_filter");
            const list = repo.collectListValues<User>();
            list.items.push({ id: "1", name: "Old" });
            list.totalItems = 1;

            let rejectRequest!: (e: unknown) => void;
            requestMock.mockImplementationOnce(
                () => new Promise((_, reject) => (rejectRequest = reject))
            );

            const api = useVqCrud<User>({
                resource: "users",
                listId: "crud-opt-update",
                optimistic: true
            });
            const promise = api.update("1", { name: "Optimistic" });

            // Optimistic update visible before request rejects.
            expect((list.items[0] as User).name).toBe("Optimistic");

            rejectRequest(new Error("server down"));
            await expect(promise).rejects.toThrow("server down");

            // Rolled back to original snapshot.
            expect(list.items[0]).toEqual({ id: "1", name: "Old" });

            repo.removeList();
        });

        it("remove() removes the row immediately and reinserts at the original index on failure", async () => {
            const repo = useListRepository("crud-opt-remove_filter");
            const list = repo.collectListValues<User>();
            list.items.push({ id: "0", name: "First" });
            list.items.push({ id: "1", name: "Target" });
            list.items.push({ id: "2", name: "Last" });
            list.totalItems = 3;

            let rejectRequest!: (e: unknown) => void;
            requestMock.mockImplementationOnce(
                () => new Promise((_, reject) => (rejectRequest = reject))
            );

            const api = useVqCrud<User>({
                resource: "users",
                listId: "crud-opt-remove",
                optimistic: true
            });
            const promise = api.remove("1");

            // Optimistic remove visible.
            expect(list.items.map((u) => (u as User).id)).toEqual(["0", "2"]);

            rejectRequest(new Error("network"));
            await expect(promise).rejects.toThrow("network");

            // Reinserted at index 1.
            expect(list.items.map((u) => (u as User).id)).toEqual(["0", "1", "2"]);

            repo.removeList();
        });
    });
});
