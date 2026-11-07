import {
    VNode,
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

type TValue = unknown;
interface SortByValue {
    key: string;
    order: "asc" | "desc";
}

export const VqDataTable = defineComponent({
    name: "VqDataTable",
    props: {
        id: {
            type: String as PropType<string>,
            required: true
        },
        action: {
            type: String as PropType<string>,
            required: true
        },
        method: {
            type: String as PropType<string>,
            default: () => "GET"
        },
        page: {
            type: Number as PropType<number>,
            default: () => 1
        },
        itemsPerPage: {
            type: Number as PropType<number>,
            default: () => 10
        },
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
    emits: ["error"],
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
        watch(
            () => props.action,
            () => loadItems(defaultOptions)
        );

        const reloadFromFirstPage = () => {
            // Moving the table to page 1 makes it emit update:options, which loads
            // that page; loading here as well would send the same request twice.
            if (defaultOptions.page !== 1) defaultOptions.page = 1;
            else loadItems(defaultOptions);
        };

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
                    onUpdate:sortBy={(val: any[]) => (defaultOptions.sortBy = val)}
                    v-slots={slots}
                    {...attrs}
                ></VDataTableServer>
            </>
        );
    }
});

 
export type VqDataTable = typeof VDataTableServer & typeof VqDataTable;

/**
 * Creating composable function types to create strong typed component
 */
export type ExtractComponentProps<TComponent> = TComponent extends new () => {
    $props: infer P;
}
    ? P
    : never;

type GenericProps = ExtractComponentProps<typeof VqDataTable>;

interface GenericSlotsProps<TValue> {
    item: TValue;
    index: number;
}

/**
 * Creating composable function to create strong typed component with VqList
 */
export function useVqDataTable<TValue = unknown>() {
    const wrapper = defineComponent((props: GenericProps, { slots }) => {
        // Returning functions in `setup` means this is the render function
        return () => {
            // Event handlers will also be passed in the `props` object
            return h(VqDataTable, props, slots);
        };
    });
    return wrapper as typeof wrapper & {
        new (): {
            // Same trick as `$slots`, we override the emit information for that component
            $emit: {
                (e: "error", error: unknown): void;
            };
            $slots: {
                item: (arg: GenericSlotsProps<TValue>) => VNode[];
            };
        };
    };
}

/**
 * Prepends the `#` column that `VqSerialNo` renders.
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

export const VqSerialNo = defineComponent({
    name: "VqSerialNo",
    props: {
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
