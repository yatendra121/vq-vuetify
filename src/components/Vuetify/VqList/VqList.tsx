import {
    defineComponent,
    reactive,
    onMounted,
    onBeforeUnmount,
    PropType,
    computed,
    watch,
    toRaw,
    toRefs,
    provide,
    readonly,
    toRef,
    h,
    VNode
} from "vue";

import { VList } from "vuetify/components";
import { useAsyncAxios } from "@qnx/composables/axios";
import { useListRepository } from "../../../composables/list";
import { useListFilter } from "../../../composables/list/filter";
import { buildListQuery } from "../../../composables/list/query";
import type { ComponentInstance, HttpMethod, TemplateComponent } from "../../../types/component";

type TValue = unknown;
const VqListImpl = defineComponent({
    name: "VqList",
    props: {
        /**
         * Identifies the list. A `VqTableFilter` with the same `id` filters it, and
         * the row helpers (`updateItemValue`, `deleteItemValue`) take it as their first argument.
         */
        id: {
            type: String as PropType<string>,
            required: true
        },
        /**
         * URL the items are fetched from. The query string carries the filter values,
         * `page` and `page_size`; the response must be `{ data: { data: Item[], total: number } }`.
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
        /** Items fetched per page; changing it reloads from the first page. */
        pageSize: {
            type: Number as PropType<number>,
            default: () => 10
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
        provide("tableListId", readonly(toRef(props, "id")));

        //Collect global values of list based on filter id
        const { removeList, collectListValues } = useListRepository(filterId.value);
        const { items, finished, loading } = toRefs(collectListValues<TValue>());

        onBeforeUnmount(() => {
            abortController?.abort();
            removeList();
        });

        const listOptions = reactive({
            page: 1,
            page_size: props.pageSize
        });

        const reloadFromFirstPage = () => {
            listOptions.page = 1;
            fetchPage();
        };

        const { values: formFilterData } = useListFilter(filterId.value, {
            onChange: reloadFromFirstPage,
            onReload: reloadFromFirstPage,
            onReset: reloadFromFirstPage,
            debounce: () => props.filterDebounce
        });

        watch(
            () => props.pageSize,
            (val) => {
                listOptions.page_size = val;
                reloadFromFirstPage();
            }
        );
        watch(() => props.action, reloadFromFirstPage);

        // Aborting a request rejects its promise with a CanceledError; that is
        // expected (a newer request superseded it) and must not surface as an
        // error. Anything else is a real failure consumers should see.
        const isAbortError = (e: unknown) => (e as { name?: string })?.name === "CanceledError";

        const fetchPage = () => {
            fetchItems()
                .then((res) => {
                    items.value = listOptions.page === 1 ? res.data : [...items.value, ...res.data];

                    finished.value = listOptions.page_size * listOptions.page >= (res?.total ?? 0);
                    listOptions.page++;
                })
                .catch((e) => {
                    if (isAbortError(e)) return;
                    console.error(e);
                    emit("error", e);
                });
        };

        // Public: a repeat call (scroll handlers fire often) must not abort the
        // in-flight page or request past the end.
        const loadMore = () => {
            if (loading.value || finished.value) return;
            fetchPage();
        };

        let abortController: AbortController | undefined;
        const fetchItems = async () => {
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
                        ...toRaw(listOptions)
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

        onMounted(fetchPage);

        provide("vqList", {
            loading,
            finished,
            tableListId: props.id,
            loadMore
        });

        return () => {
            const { default: defaultSlot, "load-more": loadMoreSlot, ...listSlots } = slots;
            const slotProps = {
                items: items.value,
                loadMore,
                finished: finished.value,
                loading: loading.value
            };
            // Only take over VList's default slot when given content, so it can
            // still render `items` itself (item-title / item-value attrs).
            const content =
                defaultSlot || loadMoreSlot
                    ? {
                          default: () => [defaultSlot?.(slotProps), loadMoreSlot?.(slotProps)]
                      }
                    : {};

            return (
                <>
                    <VList
                        items={items.value}
                        v-slots={{ ...listSlots, ...content }}
                        {...attrs}
                    ></VList>
                </>
            );
        };
    }
});


type VListInstance<TItem = any> = ComponentInstance<
    typeof VList<unknown, unknown, unknown, readonly TItem[]>
>;

/** Props of VqList's `default` and `load-more` slots. */
export interface VqListSlotProps<TItem = any> {
    /** Every item loaded so far. */
    items: TItem[];
    /** Fetches the next page; ignored while loading or once finished. */
    loadMore: () => void;
    /** All items are loaded. */
    finished: boolean;
    /** A page is being fetched. */
    loading: boolean;
}

/** VqList's template type, with items of type `TItem` in its slots. */
export type VqListComponent<TItem = any> = typeof VqListImpl &
    TemplateComponent<
        Omit<VListInstance<TItem>["$props"], "items"> &
            ComponentInstance<typeof VqListImpl>["$props"],
        Omit<VListInstance<TItem>["$slots"], "default"> & {
            default?: (props: VqListSlotProps<TItem>) => VNode[];
            "load-more"?: (props: VqListSlotProps<TItem>) => VNode[];
        }
    >;

/**
 * A `v-list` that fetches its own items from `action` page by page; `loadMore` (from
 * the slots or `VqListLoadMoreBtn`) appends the next page. Takes every VList prop,
 * event and slot except `items`, which it supplies itself.
 *
 * For typed items in slots, use `useVqList<Item>()`.
 */
export const VqList = VqListImpl as VqListComponent;
export type VqList = typeof VList & typeof VqListImpl;

/**
 * Creating composable function types to create strong typed component
 */
export type ExtractComponentProps<TComponent> = TComponent extends new () => {
    $props: infer P;
}
    ? P
    : never;

type GenericProps = ExtractComponentProps<typeof VqListImpl>;

/**
 * Returns `VqList` typed for items of `TItem`, so `items` in the `default` and
 * `load-more` slots is `TItem[]` instead of `any[]`.
 *
 * @example
 * const UserList = useVqList<User>();
 * // <UserList id="users" action="users" v-slot="{ items }">
 * //     <v-list-item v-for="user in items" :key="user.id" :title="user.name" />
 * // </UserList>
 */
export function useVqList<TItem = unknown>() {
    const wrapper = defineComponent((props: GenericProps, { slots }) => {
        // Returning functions in `setup` means this is the render function
        return () => {
            // Event handlers will also be passed in the `props` object
            return h(VqListImpl, props, slots);
        };
    });
    return wrapper as unknown as VqListComponent<TItem>;
}
