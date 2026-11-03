import { defineComponent } from "vue";
import { VSnackbarQueue } from "./VSnackbarQueue";
import { useMessageStore } from "../../store/reactivity/message";

/**
 * Renders the messages pushed through `useMessageInstance()`. Mount it once,
 * near the root of the app.
 */
export const VqMessageQueue = defineComponent({
    name: "VqMessageQueue",
    setup() {
        const messageStore = useMessageStore();

        return () => (
            <VSnackbarQueue
                timeout={2500}
                items={messageStore.items}
                onRemove={() => messageStore.removeMessage()}
            />
        );
    }
});

 
export type VqMessageQueue = typeof VqMessageQueue;
