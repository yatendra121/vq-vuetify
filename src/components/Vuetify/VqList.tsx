// @ts-nocheck
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
} from "vue";
import { objectToQueryString } from "../../composables/axios/formData";
import { useFormFilterStore } from "../../store/reactivity/formFiler";
import { useAsyncAxios } from "../../composables/axios";
import { useListRepository } from "../../composables/list";
import { CancelToken } from "axios";

//types
import type { VList } from "vuetify/components";

export const VqList = defineComponent({
  name: "VqList",
  props: {
    id: {
      type: String as PropType<string>,
      required: true,
    },
    action: {
      type: String as PropType<string>,
      required: true,
    },
    pageSize: {
      type: Number as PropType<number>,
      default: () => 3,
    },
  },
  setup(props, { attrs, slots }) {
    const filterId = computed(() => {
      return `${props.id}_filter`;
    });
    provide("tableListId", readonly(toRef(props, "id")));

    //Collect global values of list based on filter id
    const { removeList, collectListValues } = useListRepository(filterId.value);
    const { items, finished, loading } = toRefs(collectListValues());

    onBeforeUnmount(() => {
      removeList();
    });

    const listOptions = reactive({
      page: 1,
      page_size: props.pageSize,
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
          items.value =
            listOptions.page === 1 ? res.data : [...items.value, ...res.data];

          finished.value =
            listOptions.page_size * listOptions.page >= (res?.total ?? 0);
          listOptions.page++;
        })
        .catch(() => {});
    };

    let cancelToken = {
      cancel: () => {
        console.log("no cancel token assigned");
      },
    };
    const fetchItems: Promise<{ data: any; total: number }> = async () => {
      try {
        cancelToken.cancel();
        cancelToken = CancelToken.source();

        loading.value = true;

        const response = await useAsyncAxios<unknown>(
          `${props.action}?${objectToQueryString(
            { ...toRaw(listOptions), ...toRaw(formFilterData.value ?? {}) },
            ""
          )}`,
          {
            method: "GET",
          },
          { cancelToken }
        );
        loading.value = false;
        return response.data;
      } catch (e: Error) {
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
      loadMore,
    });

    return () => (
      <>
        <v-list items={items.value} {...attrs}>
          <>
            {slots.default?.({
              items: items.value,
              loadMore,
              finished: finished.value,
              loading: loading.value,
            })}
          </>
          {/* {items.value.map((item, i) => (
            <v-list-item key={i} value={item}>
              <v-list-item-title v-text={item.name}></v-list-item-title>
              <v-list-item-subtitle v-text={item.email}></v-list-item-subtitle>
            </v-list-item>
          ))} */}
        </v-list>
      </>
    );
  },
});

// eslint-disable-next-line no-redeclare
export type VqList = typeof VList & typeof VqList;
