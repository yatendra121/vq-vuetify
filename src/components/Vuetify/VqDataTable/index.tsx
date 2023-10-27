import {
    VNode,
    computed,
    defineComponent,
    readonly,
    ref,
    toRef,
    h,
    toRaw,
    reactive,
    toRefs,
    PropType,
    provide,
    watch,
    onBeforeUnmount,
    onMounted
} from "vue";
import { VDataTableServer } from "vuetify/labs/VDataTable";
import axios, { CancelTokenSource } from "axios";
import { objectToQueryString, useAsyncAxios } from "@qnx/composables/axios";
import { useListRepository } from "../../../composables/list";
import { useFormFilterStore } from "../../../store/reactivity/formFiler";

type TValue = unknown;
interface SortByValue {
    key: string;
    order: "asc" | "desc";
}

export const VqDataTable = defineComponent({
    name: "VqTextarea",
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
        }
    },
    components: {
        VDataTableServer
    },
    setup(props, { attrs, slots }) {
        const filterId = computed(() => {
            return `${props.id}_filter`;
        });

        const defaultOptions = reactive({
            page: props.page,
            itemsPerPage: props.itemsPerPage,
            sortBy: reactive(props.sortBy)
        });

        provide("tableListId", readonly(toRef(props, "id")));

        //Collect global values of list based on filter id
        const { removeList, collectListValues } = useListRepository(filterId.value);
        const { items, loading } = toRefs(collectListValues<TValue>());
        const totalItems = ref(0);

        const formFilterStore = useFormFilterStore();

        const formFilterData = computed<Object>(() => {
            return formFilterStore.forms[filterId.value]?.values;
        });

        watch(
            () => formFilterData.value,
            (_newVal, oldVal) => {
                if (oldVal === undefined) return;
                fetchItems(defaultOptions).then(({ data, total }) => {
                    items.value = data;
                    totalItems.value = total;
                });
            },
            { deep: true }
        );

        let cancelToken: CancelTokenSource;
        const fetchItems = async ({
            page,
            itemsPerPage,
            sortBy
        }: {
            page: number;
            itemsPerPage: number;
            sortBy: SortByValue[];
        }) => {
            try {
                cancelToken?.cancel();
                cancelToken = axios.CancelToken.source();

                loading.value = true;

                const response = await useAsyncAxios<{
                    data: { data: unknown[]; total: number };
                }>(
                    `${props.action}?${objectToQueryString(
                        {
                            ...toRaw(formFilterData.value ?? {}),
                            page: page,
                            itemsPerPage: itemsPerPage,
                            sortBy: sortBy.map((item: SortByValue) => ({
                                [item.key]: item.order
                            }))
                        },
                        ""
                    )}`,
                    {
                        method: props.method
                    },
                    { cancelToken }
                );
                loading.value = false;
                return response.data;
            } catch (e: any) {
                // loading.value = false;
                throw new Error(e.message);
            }
        };

        const updateOptions = (options: {
            page: number;
            itemsPerPage: number;
            sortBy: SortByValue[];
        }) => {
            fetchItems(options).then(({ data, total }) => {
                items.value = data;
                totalItems.value = total;
            });
        };

        // onMounted(() => {
        //     fetchItems(defaultOptions).then(({data,total}) => {
        // items.value = data;
        // totalItems.value = total
        //     });
        // });

        onBeforeUnmount(() => {
            removeList();
        });

        return () => (
            <>
                <VDataTableServer
                    loading={loading.value ? "primary" : false}
                    // page={props.page}
                    // itemsPerPage={props.itemsPerPage}
                    // sortBy={props.sortBy}
                    items={items.value}
                    itemsLength={totalItems.value}
                    onUpdate:options={updateOptions}
                    onUpdate:itemsPerPage={(val: number) => (defaultOptions.itemsPerPage = val)}
                    onUpdate:sortBy={(val: any[]) => (defaultOptions.sortBy = val)}
                    v-slots={slots}
                    {...attrs}
                ></VDataTableServer>
            </>
        );
    }
});

// eslint-disable-next-line no-redeclare
export type VqDataTable = typeof VDataTableServer & typeof VqDataTable;

/**
 * Creating composable function types to create strong typed component
 */
export type ExtractComponentProps<TComponent> = TComponent extends new () => {
    $props: infer P;
}
    ? P
    : never;

interface GenericProps
    extends ExtractComponentProps<typeof VqDataTable>,
        ExtractComponentProps<typeof VqDataTable> {}

interface GenericSlotsProps<TValue> {
    item: { columns: TValue };
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
                (e: "changed", value: TValue): void;
            };
            $slots: {
                item: (arg: GenericSlotsProps<TValue>) => VNode[];
            };
        };
    };
}
