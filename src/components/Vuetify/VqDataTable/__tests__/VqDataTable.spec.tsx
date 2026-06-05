import { mount, flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import { createPinia, setActivePinia, type Pinia } from "pinia";

vi.mock("@qnx/composables/axios", () => ({
    useAsyncAxios: vi.fn()
}));

import { useAsyncAxios } from "@qnx/composables/axios";
import { VqDataTable } from "../index";

// VDataTableServer emits `update:options` on mount, which drives the initial
// fetch through VqDataTable.fetchItems. We mock the async HTTP layer so we can
// assert (a) that a fetch happens and (b) that the documented itemsPerPage /
// sortBy props are honoured (the binding fix shipped in PR #14): the values we
// pass must surface in the request query string.
const page = (items: unknown[], total: number) => ({ data: { data: items, total } });

describe("VqDataTable", () => {
    const vuetify = createVuetify();
    let pinia: Pinia;

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
        vi.mocked(useAsyncAxios).mockReset();
    });

    const mountTable = (props: Record<string, unknown> = {}) =>
        mount(VqDataTable, {
            props: { id: "users", action: "users", ...props },
            global: { plugins: [vuetify, pinia] }
        });

    it("renders a VDataTableServer and fetches the first page on mount", async () => {
        vi.mocked(useAsyncAxios).mockResolvedValue(page([{ id: 1 }, { id: 2 }], 5) as never);

        const wrapper = mountTable();
        await flushPromises();

        expect(wrapper.find(".v-data-table").exists()).toBe(true);
        expect(useAsyncAxios).toHaveBeenCalled();
        expect(vi.mocked(useAsyncAxios).mock.calls[0][0]).toContain("users?");

        wrapper.unmount();
    });

    it("honours the itemsPerPage prop in the fetch query (binding fix)", async () => {
        vi.mocked(useAsyncAxios).mockResolvedValue(page([], 0) as never);

        const wrapper = mountTable({ itemsPerPage: 25 });
        await flushPromises();

        const url = String(vi.mocked(useAsyncAxios).mock.calls[0][0]);
        expect(url).toContain("itemsPerPage=25");
        expect(url).toContain("page=1");

        wrapper.unmount();
    });

    it("forwards the configured HTTP method to useAsyncAxios", async () => {
        vi.mocked(useAsyncAxios).mockResolvedValue(page([], 0) as never);

        const wrapper = mountTable({ method: "POST" });
        await flushPromises();

        const config = vi.mocked(useAsyncAxios).mock.calls[0][1];
        expect(config).toMatchObject({ method: "POST" });

        wrapper.unmount();
    });
});
