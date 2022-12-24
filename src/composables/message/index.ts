import { useMessageStore } from '../../store/reactivity/message'

class Message {
    // eslint-disable-next-line no-use-before-define
    static instance: Message

    // eslint-disable-next-line no-useless-constructor
    private constructor() {}

    private messageStore = useMessageStore()

    static getInstance(): Message {
        if (!Message.instance) {
            Message.instance = new Message()
        }
        return Message.instance
    }

    /**
     * Returns the id of the [[BaseTx]]
     */
    success(message: string) {
        this.messageStore.addMessage({ message, color: 'success' })
    }

    /**
     * Returns the id of the [[BaseTx]]
     */
    warning(message: string) {
        this.messageStore.addMessage({ message, color: 'warning' })
    }

    /**
     * Returns the id of the [[BaseTx]]
     */
    error(message: string) {
        this.messageStore.addMessage({ message, color: 'error' })
    }
}
const useMessageInstance = () => {
    return Message.getInstance()
}

export { useMessageInstance }
