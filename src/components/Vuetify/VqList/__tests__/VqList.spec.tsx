import { mount, flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import { createPinia, setActivePinia, type Pinia } from "pinia";

vi.mock("@qnx/composables/axios", () => ({
    useAsyncAxios: vi.fn()
}));

import { useAsyncAxios } from "@qnx/composables/axios";
import { VqList } from "../VqList";

const page = (items: unknown[], total: number) => ({ data: { data: items, total } });

describe("VqList", () => {
    const vuetify = createVuetify();
    let pinia: Pinia;

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
        vi.mocked(useAsyncAxios).mockReset();
    });

    const mountList = (id: string, pageSize = 2) =>
        mount(VqList, {
            props: { id, action: "posts", pageSize },
            slots: {
                default: (arg: any) => (
                    <div>
                        <span class="count">{arg.items.length}</span>
                        <span class="finished">{String(arg.finished)}</span>
                        <button class="more" onClick={arg.loadMore}>
                            more
                        </button>
                    </div>
                )
            },
            global: { plugins: [vuetify, pinia] }
        });

    it("fetches the first page on mount and exposes items via the default slot", async () => {
        vi.mocked(useAsyncAxios).mockResolvedValueOnce(page([{ id: 1 }, { id: 2 }], 5) as never);

        const wrapper = mountList("a");
        await flushPromises();

        expect(useAsyncAxios).toHaveBeenCalledTimes(1);
        expect(vi.mocked(useAsyncAxios).mock.calls[0][0]).toContain("posts?");
        expect(wrapper.find(".count").text()).toBe("2");
        expect(wrapper.find(".finished").text()).toBe("false");

        wrapper.unmount();
    });

    it("marks the list finished once page_size * page covers the total", async () => {
        vi.mocked(useAsyncAxios).mockResolvedValueOnce(page([{ id: 1 }, { id: 2 }], 2) as never);

        const wrapper = mountList("b");
        await flushPromises();

        expect(wrapper.find(".finished").text()).toBe("true");
        wrapper.unmount();
    });

    it("appends the next page when loadMore is invoked", async () => {
        vi.mocked(useAsyncAxios)
            .mockResolvedValueOnce(page([{ id: 1 }, { id: 2 }], 5) as never)
            .mockResolvedValueOnce(page([{ id: 3 }, { id: 4 }], 5) as never);

        const wrapper = mountList("c");
        await flushPromises();
        expect(wrapper.find(".count").text()).toBe("2");

        await wrapper.find(".more").trigger("click");
        await flushPromises();

        expect(useAsyncAxios).toHaveBeenCalledTimes(2);
        expect(wrapper.find(".count").text()).toBe("4");
        wrapper.unmount();
    });
});
