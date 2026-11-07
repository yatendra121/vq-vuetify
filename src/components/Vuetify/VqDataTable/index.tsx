import {
    computed,
    defineComponent,
    readonly,
    toRef,
    h,
    toRaw,
    reactive,
    toRefs,
    PropType,
    provide,
    watch,
    onBeforeUnmount
} from "vue";

import { VDataTableServer } from "vuetify/components";
import { useAsyncAxios } from "@qnx/composables/axios";
import { useListRepository } from "../../../composables/list";
import { useListFilter } from "../../../composables/list/filter";
import { buildListQuery } from "../../../composables/list/query";
import type { ComponentInstance, HttpMethod, TemplateComponent } from "../../../types/component";

type TValue = unknown;
interface SortByValue {
    key: string;
    order: "asc" | "desc";
}

const VqDataTableImpl = defineComponent({
    name: "VqDataTable",
    props: {
        /**
         * Identifies the table. A `VqTableFilter` with the same `id` filters it, and
         * the row helpers (`updateItemValue`, `deleteItemValue`) take it as their first argument.
         */
        id: {
            type: String as PropType<string>,
            required: true
        },
        /**
         * URL the rows are fetched from. The query string carries the filter values,
         * `page`, `itemsPerPage` and `sortBy`; the response must be `{ data: { data: Row[], total: number } }`.
         */
        action: {
            type: String as PropType<string>,
            required: true
        },
        /** HTTP method of the request. */
        method: {
            type: String as PropType<HttpMethod>,
            default: () => "GET"
        },
        /** Page shown first; later changes move the table to that page. */
        page: {
            type: Number as PropType<number>,
            default: () => 1
        },
        /** Rows per page. */
        itemsPerPage: {
            type: Number as PropType<number>,
            default: () => 10
        },
        /** Initial sort; the user can change it from the column headers. */
        sortBy: {
            type: Array as PropType<SortByValue[]>,
            default: () => [{ key: "name", order: "asc" }]
        },
        /** Delay in ms before a filter change refetches. */
        filterDebounce: {
            type: Number as PropType<number>,
            default: () => 0
        }
    },
    emits: {
        /** A request failed. Superseded (aborted) requests don't emit. */
        error: (_error: unknown) => true
    },
    setup(props, { attrs, slots, emit }) {
        const filterId = computed(() => {
            return `${props.id}_filter`;
        });

        const defaultOptions = reactive({
            page: props.page,
            itemsPerPage: props.itemsPerPage,
            sortBy: props.sortBy
        });

        provide("tableListId", readonly(toRef(props, "id")));

        //Collect global values of list based on filter id
        const { removeList, collectListValues } = useListRepository(filterId.value);
        const { items, loading, totalItems } = toRefs(collectListValues<TValue>());
        //const totalItems = ref(0);

        watch(
            () => props.page,
            (val) => (defaultOptions.page = val)
        );
        watch(
            () => props.itemsPerPage,
            (val) => (defaultOptions.itemsPerPage = val)
        );
        // An inline `:sort-by="[...]"` is a new array on every parent render; only a
        // real change may replace the sort the user picked in the table header.
        watch(
            () => props.sortBy,
            (val, oldVal) => {
                if (JSON.stringify(val) !== JSON.stringify(oldVal)) defaultOptions.sortBy = val;
            }
        );

        const reloadFromFirstPage = () => {
            // Moving the table to page 1 makes it emit update:options, which loads
            // that page; loading here as well would send the same request twice.
            if (defaultOptions.page !== 1) defaultOptions.page = 1;
            else loadItems(defaultOptions);
        };

        // A different endpoint has different rows, so the current page may not exist.
        watch(() => props.action, reloadFromFirstPage);

        const { values: formFilterData } = useListFilter(filterId.value, {
            onChange: reloadFromFirstPage,
            onReload: () => loadItems(defaultOptions),
            onReset: reloadFromFirstPage,
            debounce: () => props.filterDebounce
        });

        // Aborting a request rejects its promise with a CanceledError; that is
        // expected (a newer request superseded it) and must not surface as an
        // error. Anything else is a real failure consumers should see.
        const isAbortError = (e: unknown) => (e as { name?: string })?.name === "CanceledError";

        const loadItems = (options: {
            page: number;
            itemsPerPage: number;
            sortBy: SortByValue[];
        }) => {
            fetchItems(options)
                .then(({ data, total }) => {
                    items.value = data;
                    totalItems.value = total;
                })
                .catch((e) => {
                    if (isAbortError(e)) return;
                    console.error(e);
                    emit("error", e);
                });
        };

        let abortController: AbortController | undefined;
        const fetchItems = async ({
            page,
            itemsPerPage,
            sortBy
        }: {
            page: number;
            itemsPerPage: number;
            sortBy: SortByValue[];
        }) => {
            abortController?.abort();
            const controller = new AbortController();
            abortController = controller;

            loading.value = true;
            try {
                const response = await useAsyncAxios<{
                    data: { data: unknown[]; total: number };
                }>(
                    `${props.action}?${buildListQuery({
                        ...toRaw(formFilterData.value ?? {}),
                        page: page,
                        itemsPerPage: itemsPerPage,
                        sortBy: sortBy.map((item: SortByValue) => ({
                            [item.key]: item.order
                        }))
                    })}`,
                    {
                        method: props.method,
                        signal: controller.signal
                    }
                );
                return response.data;
            } finally {
                // Only the latest request owns the shared loading flag, so a
                // superseded request can't switch the spinner off prematurely.
                if (abortController === controller) loading.value = false;
            }
        };

        const updateOptions = (options: {
            page: number;
            itemsPerPage: number;
            sortBy: SortByValue[];
        }) => {
            loadItems(options);
        };

        onBeforeUnmount(() => {
            abortController?.abort();
            removeList();
        });

        return () => (
            <>
                <VDataTableServer
                    loading={loading.value ? "primary" : false}
                    page={defaultOptions.page}
                    itemsPerPage={defaultOptions.itemsPerPage}
                    sortBy={defaultOptions.sortBy}
                    items={items.value}
                    itemsLength={totalItems.value}
                    onUpdate:options={updateOptions}
                    onUpdate:page={(val: number) => (defaultOptions.page = val)}
                    onUpdate:itemsPerPage={(val: number) => (defaultOptions.itemsPerPage = val)}
                    onUpdate:sortBy={(val: SortByValue[]) => (defaultOptions.sortBy = val)}
                    v-slots={slots}
                    {...attrs}
                ></VDataTableServer>
            </>
        );
    }
});


type VDataTableServerInstance<TItem = any> = ComponentInstance<
    typeof VDataTableServer<readonly TItem[], unknown>
>;

/** VqDataTable's template type, with rows of type `TItem` in VDataTableServer's slots. */
export type VqDataTableComponent<TItem = any> = typeof VqDataTableImpl &
    TemplateComponent<
        Omit<VDataTableServerInstance<TItem>["$props"], "items" | "itemsLength"> &
            ComponentInstance<typeof VqDataTableImpl>["$props"],
        VDataTableServerInstance<TItem>["$slots"]
    >;

/**
 * A server-side `v-data-table` that fetches its own rows from `action`, refetching on
 * paging, sorting and changes to its `VqTableFilter`. Takes every VDataTableServer prop,
 * event and slot except `items` and `itemsLength`, which it supplies itself.
 *
 * For typed rows in slots, use `useVqDataTable<Row>()`.
 */
export const VqDataTable = VqDataTableImpl as VqDataTableComponent;
export type VqDataTable = typeof VDataTableServer & typeof VqDataTableImpl;

/**
 * Creating composable function types to create strong typed component
 */
export type ExtractComponentProps<TComponent> = TComponent extends new () => {
    $props: infer P;
}
    ? P
    : never;

type GenericProps = ExtractComponentProps<typeof VqDataTableImpl>;

/**
 * Returns `VqDataTable` typed for rows of `TItem`, so slot props such as `item` in
 * `#item.name="{ item }"` are `TItem` instead of `any`.
 *
 * @example
 * const UserTable = useVqDataTable<User>();
 * // <UserTable id="users" action="users" :headers="headers">
 * //     <template #item.name="{ item }">{{ item.name }}</template>
 * // </UserTable>
 */
export function useVqDataTable<TItem = unknown>() {
    const wrapper = defineComponent((props: GenericProps, { slots }) => {
        // Returning functions in `setup` means this is the render function
        return () => {
            // Event handlers will also be passed in the `props` object
            return h(VqDataTableImpl, props, slots);
        };
    });
    return wrapper as unknown as VqDataTableComponent<TItem>;
}

/**
 * Prepends the `#` column that `VqSerialNo` renders.
 *
 * @example
 * const headers = collectVqHeaders([{ title: "Name", key: "name" }]);
 */
export function collectVqHeaders<T extends unknown[]>(headers: T) {
    return [
        {
            title: "#",
            sortable: false
        },
        ...headers
    ];
}

/** A `<td>` with the row's serial number, for the column `collectVqHeaders` adds. */
export const VqSerialNo = defineComponent({
    name: "VqSerialNo",
    props: {
        /** The number to show. */
        index: {
            type: Number as PropType<number>,
            required: true
        }
    },
    setup(props) {
        return () => (
            <>
                <td>{props.index}</td>
            </>
        );
    }
});

 
export type VqSerialNo = typeof VqSerialNo;
