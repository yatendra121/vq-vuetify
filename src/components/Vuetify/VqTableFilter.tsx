import { computed, defineComponent, PropType } from "vue";
import { Form } from "vee-validate";
import { VqTableFilterHandler } from "../../components/Vuetify/VqTableFilterHandler";

//types
import type { Form as VFormType } from "vee-validate";

export const VqTableFilter = defineComponent({
  components: {
    Form,
    VqTableFilterHandler,
  },
  props: {
    id: {
      type: String as PropType<string>,
      required: true,
      default: () => "",
    },
  },
  setup(props, { attrs, slots }) {
    const filterId = computed(() => {
      return `${props.id}_filter`;
    });

    return () => (
      <>
        <Form
          //@ts-ignore
          id={filterId.value}
          {...attrs}
        >
          <VqTableFilterHandler id={filterId.value} v-slots={slots}>
            <>{slots.default?.()}</>
          </VqTableFilterHandler>
        </Form>
      </>
    );
  },
});

// eslint-disable-next-line no-redeclare
export type VqTableFilter = typeof VFormType & typeof VqTableFilter;
