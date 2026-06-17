import { defineStore } from "pinia";

export interface List<T> {
    items: T[];
    totalItems: number;
    finished: boolean;
    loading: boolean;
}

/**
 * Holds every VqList / VqDataTable dataset keyed by `<id>_filter`. Backed by
 * Pinia (not a module-level global) so each app instance — including separate
 * SSR requests — gets its own isolated state instead of sharing one map.
 */
export const useListDataStore = defineStore("list_data_lib", {
    state: () => ({ lists: {} as Record<string, List<any>> })
});
