import { mount, flushPromises } from "@vue/test-utils";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import { createPinia, setActivePinia, type Pinia } from "pinia";

// Mock only the async HTTP subpath. `@qnx/composables` (ApiResponse, used by
// the confirm handler) stays real.
vi.mock("@qnx/composables/axios", () => ({
    useAsyncAxios: vi.fn()
}));

import { useAsyncAxios } from "@qnx/composables/axios";
import { VqDatatableItemAction } from "../VqDatatableItemAction";

// The row-action button opens a teleported confirmation dialog; confirming it
// issues `${action}/${itemId}` via useAsyncAxios and (on success) reloads the
// owning filter + flashes a success message.
describe("VqDatatableItemAction", () => {
    const vuetify = createVuetify();
    let pinia: Pinia;

    beforeAll(() => {
        // The message singleton captures the active store on first construction,
        // so keep one stable pinia for the whole file.
        pinia = createPinia();
        setActivePinia(pinia);
    });

    beforeEach(() => {
        setActivePinia(pinia);
        vi.mocked(useAsyncAxios).mockReset();
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    const mountAction = (props: Record<string, unknown> = {}) =>
        mount(VqDatatableItemAction, {
            props: { id: "users", action: "users/delete", itemId: "7", ...props },
            global: { plugins: [vuetify, pinia] }
        });

    it("renders the row-action trigger button", () => {
        const wrapper = mountAction();
        expect(wrapper.find(".v-btn").exists()).toBe(true);
        wrapper.unmount();
    });

    it("opens the confirmation dialog when the trigger is clicked", async () => {
        const wrapper = mountAction();
        await wrapper.find(".v-btn").trigger("click");
        await flushPromises();

        // VDialog teleports its content to the overlay container in document.body.
        expect(document.body.textContent).toContain("Confirmation");
        expect(document.body.textContent).toContain("Confirm");
        wrapper.unmount();
    });

    it("requests `${action}/${itemId}` with the configured method on confirm", async () => {
        vi.mocked(useAsyncAxios).mockResolvedValue({ data: { message: "Deleted" } } as never);

        const wrapper = mountAction({ method: "DELETE" });
        await wrapper.find(".v-btn").trigger("click");
        await flushPromises();

        const confirmBtn = Array.from(
            document.body.querySelectorAll<HTMLElement>(".v-btn")
        ).find((b) => b.textContent?.trim() === "Confirm");
        expect(confirmBtn).toBeTruthy();

        confirmBtn!.click();
        await flushPromises();

        expect(useAsyncAxios).toHaveBeenCalledTimes(1);
        const [calledAction, config] = vi.mocked(useAsyncAxios).mock.calls[0];
        expect(calledAction).toBe("users/delete/7");
        expect(config).toMatchObject({ method: "DELETE" });
        wrapper.unmount();
    });
});
