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
import axios, { CancelTokenSource } from "axios";
import { useAsyncAxios, objectToQueryString } from "@qnx/composables/axios";
import { useListRepository } from "../../../composables/list";
import { useFormFilterStore } from "../../../store/reactivity/formFiler";

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
        pageSize: {
            type: Number as PropType<number>,
            default: () => 10
        }
    },
    components: {
        VList
    },
    setup(props, { attrs, slots }) {
        const filterId = computed(() => {
            return `${props.id}_filter`;
        });
        provide("tableListId", readonly(toRef(props, "id")));

        //Collect global values of list based on filter id
        const { removeList, collectListValues } = useListRepository(filterId.value);
        const { items, finished, loading } = toRefs(collectListValues<TValue>());

        onBeforeUnmount(() => {
            removeList();
        });

        const listOptions = reactive({
            page: 1,
            page_size: props.pageSize
        });

        const formFilterStore = useFormFilterStore();
        const { setReloadValue } = useFormFilterStore();

        const formFilterData = computed<Object>(() => {
            return formFilterStore.forms[filterId.value]?.values;
        });

        const reloadRequired = computed<boolean>(() => {
            return formFilterStore.forms[filterId.value]?.reloadRequired ?? false;
        });

        const resetRequired = computed<boolean>(() => {
            return formFilterStore.forms[filterId.value]?.resetRequired ?? false;
        });

        watch(reloadRequired, (newVal) => {
            if (newVal) {
                listOptions.page = 1;
                setReloadValue(filterId.value, false);
                loadMore();
            }
        });

        watch(resetRequired, (newVal) => {
            if (newVal) {
                setReloadValue(filterId.value, false);
                listOptions.page = 1;
                loadMore();
            }
        });

        watch(
            () => formFilterData.value,
            //@ts-ignore
            (newVal, oldVal) => {
                if (oldVal === undefined) return;
                listOptions.page = 1;
                loadMore();
            },
            { deep: true }
        );

        const loadMore = () => {
            fetchItems()
                .then((res) => {
                    items.value = listOptions.page === 1 ? res.data : [...items.value, ...res.data];

                    finished.value = listOptions.page_size * listOptions.page >= (res?.total ?? 0);
                    listOptions.page++;
                })
                .catch(() => {});
        };

        let cancelToken: CancelTokenSource;
        const fetchItems = async () => {
            try {
                cancelToken?.cancel();
                cancelToken = axios.CancelToken.source();

                loading.value = true;

                const response = await useAsyncAxios<{
                    data: { data: any; total: number };
                }>(
                    `${props.action}?${objectToQueryString(
                        { ...toRaw(listOptions), ...toRaw(formFilterData.value ?? {}) },
                        ""
                    )}`,
                    {
                        method: "GET"
                    },
                    { cancelToken }
                );
                loading.value = false;
                return response.data;
            } catch (e: any) {
                loading.value = false;
                throw new Error(e.message);
            }
        };

        onMounted(() => {
            loadMore();
        });

        provide("vqList", {
            loading,
            finished,
            tableListId: props.id,
            loadMore
        });

        return () => (
            <>
                <VList items={items.value} {...attrs}>
                    <>
                        {slots.default?.({
                            items: items.value,
                            loadMore,
                            finished: finished.value,
                            loading: loading.value
                        })}
                    </>
                    {/* {items.value.map((item, i) => (
            <v-list-item key={i} value={item}>
              <v-list-item-title v-text={item.name}></v-list-item-title>
              <v-list-item-subtitle v-text={item.email}></v-list-item-subtitle>
            </v-list-item>
          ))} */}
                </VList>
            </>
        );
    }
});

// eslint-disable-next-line no-redeclare
export type VqList = typeof VList & typeof VqList;

/**
 * Creating composable function types to create strong typed component
 */
export type ExtractComponentProps<TComponent> = TComponent extends new () => {
    $props: infer P;
}
    ? P
    : never;

interface GenericProps
    extends ExtractComponentProps<typeof VqList>,
        ExtractComponentProps<typeof VqList> {}

interface GenericSlotsProps<TValue> {
    items: TValue[];
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
                (e: "changed", value: TValue): void;
            };
            $slots: {
                default: (arg: GenericSlotsProps<TValue>) => VNode[];
            };
        };
    };
}
