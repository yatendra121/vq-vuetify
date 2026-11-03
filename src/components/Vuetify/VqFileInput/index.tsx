import { computed, defineComponent } from "vue";
import { useVqField } from "../../../composables/field";
import { VFileInput } from "vuetify/components";

export const VqFileInput = defineComponent({
    name: "VqFileInput",
    props: {
        name: {
            type: String,
            required: true
        }
    },
    setup(props, { attrs, slots }) {
        const name = computed(() => `${props.name}[file]`);
        const { value, errorMessage } = useVqField(name);

        return () => (
            <>
                <VFileInput
                    multiple={false}
                    error={!!errorMessage.value}
                    v-model={value.value}
                    error-messages={errorMessage.value}
                    messages={errorMessage.value}
                    v-slots={slots}
                    {...attrs}
                ></VFileInput>
            </>
        );
    }
});

 
export type VqFileInput = typeof VFileInput & typeof VqFileInput;
