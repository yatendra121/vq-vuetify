import { VqListLoadMoreBtn } from "../VqListLoadMoreBtn";

import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import { ref } from "vue";

describe("VqListLoadMoreBtn", () => {
    const vuetify = createVuetify();

    const mountBtn = (injection: Record<string, any>) =>
        mount(VqListLoadMoreBtn, {
            global: { plugins: [vuetify], provide: { vqList: injection } }
        });

    it("renders the localized 'Load More' button when the list is not finished", () => {
        const wrapper = mountBtn({
            loading: ref(false),
            finished: ref(false),
            tableListId: "users",
            loadMore: vi.fn()
        });
        expect(wrapper.find(".v-btn").exists()).toBe(true);
        expect(wrapper.text()).toContain("Load More");
    });

    it("calls loadMore from the injection when clicked", async () => {
        const loadMore = vi.fn();
        const wrapper = mountBtn({
            loading: ref(false),
            finished: ref(false),
            tableListId: "users",
            loadMore
        });

        await wrapper.find(".v-btn").trigger("click");
        expect(loadMore).toHaveBeenCalledTimes(1);
    });

    it("hides the button once the list is finished", () => {
        const wrapper = mountBtn({
            loading: ref(false),
            finished: ref(true),
            tableListId: "users",
            loadMore: vi.fn()
        });
        expect(wrapper.find(".v-btn").exists()).toBe(false);
    });

    it("reflects the loading state as a disabled, loading button", () => {
        const wrapper = mountBtn({
            loading: ref(true),
            finished: ref(false),
            tableListId: "users",
            loadMore: vi.fn()
        });
        const classes = wrapper.find(".v-btn").classes();
        expect(classes).toContain("v-btn--loading");
        expect(classes).toContain("v-btn--disabled");
    });
});
