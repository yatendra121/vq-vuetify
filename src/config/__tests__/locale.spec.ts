import { afterEach, describe, expect, it } from "vitest";
import { resetVqLocale, setVqLocale, useVqLocale } from "../locale";

describe("VqLocale", () => {
    afterEach(() => {
        resetVqLocale();
    });

    it("starts with English defaults", () => {
        const locale = useVqLocale();
        expect(locale.submit).toBe("Submit");
        expect(locale.loadMore).toBe("Load More");
        expect(locale.confirmTitle).toBe("Confirmation");
    });

    it("setVqLocale overrides only the keys passed", () => {
        setVqLocale({ submit: "Enviar", loadMore: "Cargar más" });
        const locale = useVqLocale();
        expect(locale.submit).toBe("Enviar");
        expect(locale.loadMore).toBe("Cargar más");
        // unchanged
        expect(locale.confirmTitle).toBe("Confirmation");
    });

    it("setVqLocale mutates the singleton observed by every caller", () => {
        const a = useVqLocale();
        const b = useVqLocale();
        setVqLocale({ cancel: "Annuler" });
        expect(a.cancel).toBe("Annuler");
        expect(b.cancel).toBe("Annuler");
    });

    it("resetVqLocale restores every default", () => {
        setVqLocale({
            submit: "X",
            loadMore: "Y",
            confirmTitle: "Z",
            confirmDeleteDescription: "Z",
            confirm: "Z",
            cancel: "Z",
            changeStatusTooltip: "Z",
            submitErrorMessage: "Z"
        });
        resetVqLocale();
        const locale = useVqLocale();
        expect(locale.submit).toBe("Submit");
        expect(locale.loadMore).toBe("Load More");
        expect(locale.confirmTitle).toBe("Confirmation");
        expect(locale.confirmDeleteDescription).toBe("Are you sure to want delete this record?");
        expect(locale.confirm).toBe("Confirm");
        expect(locale.cancel).toBe("Cancel");
        expect(locale.changeStatusTooltip).toBe("Change Status");
        expect(locale.submitErrorMessage).toBe("Please check input values.");
    });
});
