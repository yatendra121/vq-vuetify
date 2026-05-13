import { useAsyncAxios } from "@qnx/composables/axios";
import { objectToQueryString } from "@qnx/composables";
import {
    useListRepository,
    __peekListItem,
    __insertListItem,
    __prependListItem,
    __silentlyDeleteListItem
} from "../list";

export interface UseVqCrudOptions {
    /** Base URL segment — `users`, `users/items`, etc. Trailing slash optional. */
    resource: string;
    /**
     * Id of a paired `<VqList>` / `<VqDataTable>`. When set, successful
     * mutations propagate into the mounted list state so the table re-renders
     * without a refetch.
     */
    listId?: string;
    /**
     * Apply the mutation locally before the HTTP request and roll back on
     * failure. Only meaningful when `listId` is set and a list is mounted.
     * Defaults to `false`.
     */
    optimistic?: boolean;
}

export interface ListParams {
    page?: number;
    itemsPerPage?: number;
    [key: string]: unknown;
}

export interface ListResponse<T> {
    data: T[];
    total: number;
}

export interface UseVqCrudReturn<T> {
    list(params?: ListParams): Promise<ListResponse<T>>;
    get(id: string | number): Promise<T>;
    create(data: Partial<T>): Promise<T>;
    update(id: string | number, data: Partial<T>): Promise<T>;
    remove(id: string | number): Promise<void>;
}

interface Identifiable {
    id: string | number;
}

const trimSlash = (s: string) => s.replace(/\/+$/, "");

let tempCounter = 0;
const nextTempId = () => `__vq_tmp_${++tempCounter}`;

/**
 * REST conventions wrapper. Pairs with `<VqList>` / `<VqDataTable>` via the
 * shared `listId` so writes flow into the mounted list state without a
 * follow-up refetch. Optional optimistic mode applies the mutation locally
 * first and rolls back on HTTP failure.
 *
 * ```ts
 * const users = useVqCrud<User>({ resource: 'users', listId: 'users-table', optimistic: true });
 *
 * await users.create({ name: 'Alice' });
 * await users.update('42', { name: 'Updated' });
 * await users.remove('42');
 * ```
 */
export const useVqCrud = <T extends Identifiable>(
    options: UseVqCrudOptions
): UseVqCrudReturn<T> => {
    const base = trimSlash(options.resource);
    const filterKey = options.listId ? `${options.listId}_filter` : undefined;
    const optimistic = !!options.optimistic;

    const list = async (params?: ListParams): Promise<ListResponse<T>> => {
        const url = params ? `${base}?${objectToQueryString(params, "")}` : base;
        const response = await useAsyncAxios<{ data: ListResponse<T> }>(url, { method: "GET" });
        return response.data;
    };

    const get = async (id: string | number): Promise<T> => {
        const response = await useAsyncAxios<{ data: T }>(`${base}/${id}`, { method: "GET" });
        return response.data;
    };

    const create = async (data: Partial<T>): Promise<T> => {
        if (optimistic && filterKey) {
            const tempId = nextTempId();
            // Cast: caller may not have provided an id, we stamp a temporary one.
            const optimisticItem = { ...(data as object), id: tempId } as T;
            __prependListItem(filterKey, optimisticItem);
            try {
                const response = await useAsyncAxios<{ data: T }>(base, {
                    method: "POST",
                    data
                });
                // Replace temp item with server-confirmed one.
                __silentlyDeleteListItem(filterKey, tempId);
                __prependListItem(filterKey, response.data);
                return response.data;
            } catch (e) {
                __silentlyDeleteListItem(filterKey, tempId);
                throw e;
            }
        }

        const response = await useAsyncAxios<{ data: T }>(base, { method: "POST", data });
        if (filterKey) __prependListItem(filterKey, response.data);
        return response.data;
    };

    const update = async (id: string | number, data: Partial<T>): Promise<T> => {
        const snapshot = filterKey ? __peekListItem(filterKey, id) : undefined;

        if (optimistic && snapshot) {
            const repo = useListRepository(filterKey!);
            const merged = { ...(snapshot.item as object), ...(data as object) } as T;
            repo.updateListItemValue(String(id), merged);
            try {
                const response = await useAsyncAxios<{ data: T }>(`${base}/${id}`, {
                    method: "PUT",
                    data
                });
                // Apply server response (may have additional server-side fields).
                repo.updateListItemValue(String(id), response.data);
                return response.data;
            } catch (e) {
                // Roll back to the snapshot.
                repo.updateListItemValue(String(id), snapshot.item);
                throw e;
            }
        }

        const response = await useAsyncAxios<{ data: T }>(`${base}/${id}`, {
            method: "PUT",
            data
        });
        if (filterKey) {
            const repo = useListRepository(filterKey);
            repo.updateListItemValue(String(id), response.data);
        }
        return response.data;
    };

    const remove = async (id: string | number): Promise<void> => {
        const snapshot = filterKey ? __peekListItem(filterKey, id) : undefined;

        if (optimistic && snapshot) {
            const repo = useListRepository(filterKey!);
            repo.deleteListItemValue(String(id));
            try {
                await useAsyncAxios<unknown>(`${base}/${id}`, { method: "DELETE" });
            } catch (e) {
                // Reinsert at the original index.
                __insertListItem(filterKey!, snapshot.item, snapshot.index);
                throw e;
            }
            return;
        }

        await useAsyncAxios<unknown>(`${base}/${id}`, { method: "DELETE" });
        if (filterKey) {
            const repo = useListRepository(filterKey);
            repo.deleteListItemValue(String(id));
        }
    };

    return { list, get, create, update, remove };
};
