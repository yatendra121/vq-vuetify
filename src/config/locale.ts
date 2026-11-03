import { reactive } from "vue";

/**
 * Strings the library renders for built-in UI bits. Override at app startup
 * with `setVqLocale({...})` to translate or rephrase any of them.
 */
export interface VqLocale {
    /** Default text on `<VqSubmitBtn>` when no slot/prop is provided. */
    submit: string;
    /** Default text on `<VqListLoadMoreBtn>`. */
    loadMore: string;
    /** Default title of the `<VqDatatableItemAction>` confirm dialog. */
    confirmTitle: string;
    /** Default body text of the `<VqDatatableItemAction>` confirm dialog. */
    confirmDeleteDescription: string;
    /** "Confirm" button text in the action dialog. */
    confirm: string;
    /** "Cancel" button text in the action dialog. */
    cancel: string;
    /** Tooltip on the row-action trigger button. */
    changeStatusTooltip: string;
    /** Snackbar message shown when the row action request fails. */
    submitErrorMessage: string;
    /** Title of the `<VqTimePicker>` picker. */
    selectTime: string;
    /** Action on the last snackbar in `<VqMessageQueue>`. */
    close: string;
    /** Action on a snackbar with more queued behind it; rendered as `Next(2)`. */
    next: string;
}

const defaults: VqLocale = {
    submit: "Submit",
    loadMore: "Load More",
    confirmTitle: "Confirmation",
    confirmDeleteDescription: "Are you sure to want delete this record?",
    confirm: "Confirm",
    cancel: "Cancel",
    changeStatusTooltip: "Change Status",
    submitErrorMessage: "Please check input values.",
    selectTime: "Select Time",
    close: "Close",
    next: "Next"
};

const locale = reactive<VqLocale>({ ...defaults });

/**
 * Override one or more locale strings. Reactively flows through every
 * mounted Vq* component (text recomputes when called).
 */
export const setVqLocale = (overrides: Partial<VqLocale>) => {
    Object.assign(locale, overrides);
};

/** Restore the bundled English defaults. */
export const resetVqLocale = () => {
    Object.assign(locale, defaults);
};

/** Internal — components read locale via this. */
export const useVqLocale = () => locale;
