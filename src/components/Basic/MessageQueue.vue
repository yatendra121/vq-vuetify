<template>
    <VSnackbarQueue @remove="removeMessage" :timeout="2500" :items="items"></VSnackbarQueue>
</template>
<script>
import { defineComponent, toRefs } from 'vue'
import VSnackbarQueue from './VSnackbarQueue.vue'
import { useMessageStore } from '../../store/reactivity/message'
export default defineComponent({
    name: 'MessageQueue',
    components: {
        VSnackbarQueue
    },
    setup() {
        const messageStore = useMessageStore()

        const { items, removeMessage } = toRefs(messageStore)

        return { items, removeMessage }
    }
})
</script>
