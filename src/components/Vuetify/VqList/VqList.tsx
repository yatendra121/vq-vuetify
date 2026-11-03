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

type TValue = unknown;
export const VqList = defineComponent({
    name: "VqList",
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
    emits: ["error"],
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
                    data: { data: any; total: number };
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

 
export type VqList = typeof VList & typeof VqList;

/**
 * Creating composable function types to create strong typed component
 */
export type ExtractComponentProps<TComponent> = TComponent extends new () => {
    $props: infer P;
}
    ? P
    : never;

type GenericProps = ExtractComponentProps<typeof VqList>;

interface GenericSlotsProps<TValue> {
    items: TValue[];
    loadMore: () => void;
    finished: boolean;
    loading: boolean;
}

/**
 * Creating composable function to create strong typed component with VqList
 */
export function useVqList<TValue = unknown>() {
    const wrapper = defineComponent((props: GenericProps, { slots }) => {
        // Returning functions in `setup` means this is the render function
        return () => {
            // Event handlers will also be passed in the `props` object
            return h(VqList, props, slots);
        };
    });
    return wrapper as typeof wrapper & {
        new (): {
            // Same trick as `$slots`, we override the emit information for that component
            $emit: {
                (e: "error", error: unknown): void;
            };
            $slots: {
                default: (arg: GenericSlotsProps<TValue>) => VNode[];
                "load-more": (arg: GenericSlotsProps<TValue>) => VNode[];
            };
        };
    };
}
