import { useMessageStore } from '../../store/reactivity/message'

/**
 * Returns helpers for pushing snackbar messages. The Pinia store is resolved
 * on every call (not cached on a module-level singleton) so it always binds to
 * the active app instance — correct under SSR, tests, and multiple apps.
 *
 * Must be called where an active Pinia is available (e.g. component `setup`).
 */
const useMessageInstance = () => {
    const messageStore = useMessageStore()
    return {
        success: (message: string) => messageStore.addMessage({ message, color: 'success' }),
        warning: (message: string) => messageStore.addMessage({ message, color: 'warning' }),
        error: (message: string) => messageStore.addMessage({ message, color: 'error' })
    }
}

export { useMessageInstance }
