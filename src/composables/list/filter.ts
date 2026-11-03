import { computed, onBeforeUnmount, onScopeDispose, watch } from "vue";
import { useFormFilterStore } from "../../store/reactivity/formFiler";

interface UseListFilterOptions {
    /** Filter values changed. */
    onChange: () => void;
    /** `reload()` was requested through useFormFilterRepository. */
    onReload: () => void;
    /** `reset()` was requested through useFormFilterRepository. */
    onReset: () => void;
    /** Delay in ms before `onChange` runs; `0` runs it straight away. */
    debounce: () => number;
}

/**
 * Internal — wires VqList / VqDataTable to the filter store: current filter
 * values, reload/reset requests, and filter changes.
 */
export const useListFilter = (filterId: string, options: UseListFilterOptions) => {
    const store = useFormFilterStore();

    // reload()/reset() are flags on the store entry, so the entry has to exist
    // even when no VqTableFilter is mounted for this list.
    store.ensureForm(filterId);
    const stopKeepingEntry = watch(
        () => store.forms[filterId],
        (form) => {
            if (!form) store.ensureForm(filterId);
        },
        { flush: "sync" }
    );

    const values = computed(() => store.forms[filterId]?.values);

    watch(
        () => store.forms[filterId]?.reloadRequired,
        (required) => {
            if (!required) return;
            store.setReloadValue(filterId, false);
            options.onReload();
        }
    );

    watch(
        () => store.forms[filterId]?.resetRequired,
        (required) => {
            if (!required) return;
            store.setResetValue(filterId, false);
            options.onReset();
        }
    );

    let timer: ReturnType<typeof setTimeout> | undefined;
    const clearTimer = () => clearTimeout(timer);

    watch(
        values,
        (_newVal, oldVal) => {
            // undefined -> values is the filter registering itself, not a change.
            if (oldVal === undefined) return;
            clearTimer();
            const delay = options.debounce();
            if (delay > 0) timer = setTimeout(options.onChange, delay);
            else options.onChange();
        },
        { deep: true }
    );

    onScopeDispose(clearTimer);

    onBeforeUnmount(() => {
        stopKeepingEntry();
        // Only drop the entry this list created; a mounted filter still owns its own.
        if (store.forms[filterId]?.values === undefined) store.removeForm(filterId);
    });

    return { values };
};
