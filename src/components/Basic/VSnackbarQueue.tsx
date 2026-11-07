import { defineComponent, PropType } from "vue";
import { VBtn, VSnackbar } from "vuetify/components";
import { useVqLocale } from "../../config/locale";
import type { MessageItem } from "../../store/reactivity/message";

export const VSnackbarQueue = defineComponent({
    name: "VSnackbarQueue",
    props: {
        items: {
            type: Array as PropType<MessageItem[]>,
            required: true
        },
        timeout: {
            type: Number,
            default: 50000
        },
        absolute: {
            type: Boolean,
            default: true
        },
        vertical: {
            type: Boolean,
            default: false
        }
    },
    emits: ["remove"],
    setup(props, { emit }) {
        const locale = useVqLocale();

        return () => (
            <div>
                {props.items.map((item, i) => (
                    <VSnackbar
                        key={item.id}
                        modelValue={i === 0}
                        onUpdate:modelValue={() => emit("remove", item.id)}
                        timeout={props.timeout}
                        color={item.color}
                        absolute={props.absolute}
                        location="top center"
                        vertical={props.vertical}
                        transition="scale-transition"
                        v-slots={{
                            default: () => item.message,
                            actions: () => (
                                <VBtn
                                    color="white"
                                    variant="text"
                                    {...{ onClick: () => emit("remove", item.id) }}
                                >
                                    {props.items.length > 1
                                        ? `${locale.next}(${props.items.length - 1})`
                                        : locale.close}
                                </VBtn>
                            )
                        }}
                    ></VSnackbar>
                ))}
            </div>
        );
    }
});
