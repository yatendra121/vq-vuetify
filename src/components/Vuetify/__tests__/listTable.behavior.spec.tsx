import { mount, flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { defineComponent, ref } from "vue";
import { VDataTableServer } from "vuetify/components";

vi.mock("@qnx/composables/axios", () => ({
    useAsyncAxios: vi.fn()
}));

import { useAsyncAxios } from "@qnx/composables/axios";
import { VqDataTable } from "../VqDataTable";
import { VqList } from "../VqList/VqList";
import { VqTableFilter } from "../VqList/VqTableFilter";
import { VqTextField } from "../VqTextField";
import { VqDatatableItemAction } from "../VqDatatableItemAction";
import { useFormFilterRepository } from "../../../composables/form";
import { useFormFilterStore } from "../../../store/reactivity/formFiler";
import { useListDataStore } from "../../../store/reactivity/list";

const page = (items: unknown[], total: number) => ({ data: { data: items, total } });
const urls = () => vi.mocked(useAsyncAxios).mock.calls.map(([url]) => decodeURIComponent(url));

describe("list & table behaviour", () => {
    const vuetify = createVuetify();
    let pinia: Pinia;

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
        vi.mocked(useAsyncAxios).mockReset();
        vi.mocked(useAsyncAxios).mockResolvedValue(page([], 0) as never);
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    const plugins = () => ({ global: { plugins: [vuetify, pinia] } });
    const mountTable = (props: Record<string, unknown> = {}) =>
        mount(VqDataTable, { props: { id: "t", action: "users", ...props }, ...plugins() });
    const mountList = (props: Record<string, unknown> = {}, slots: Record<string, any> = {}) =>
        mount(VqList, {
            props: { id: "l", action: "posts", pageSize: 2, ...props },
            slots,
            ...plugins()
        });

    describe("reload()", () => {
        it("refetches a table that has no VqTableFilter", async () => {
            mountTable();
            await flushPromises();
            const before = urls().length;

            useFormFilterRepository("t_filter").reload();
            await flushPromises();

            expect(urls().length).toBe(before + 1);
        });

        it("keeps the table on its current page", async () => {
            vi.mocked(useAsyncAxios).mockResolvedValue(page([{ id: 1 }], 50) as never);
            mountTable({ page: 3 });
            await flushPromises();

            useFormFilterRepository("t_filter").reload();
            await flushPromises();

            expect(urls().at(-1)).toContain("page=3");
        });

        it("refetches a list that has no VqTableFilter, from page 1", async () => {
            vi.mocked(useAsyncAxios).mockResolvedValue(page([{ id: 1 }, { id: 2 }], 9) as never);
            mountList();
            await flushPromises();

            useFormFilterRepository("l_filter").reload();
            await flushPromises();

            expect(urls()).toHaveLength(2);
            expect(urls()[1]).toContain("page=1");
        });

        it("reset() goes back to the table's first page", async () => {
            vi.mocked(useAsyncAxios).mockResolvedValue(page([{ id: 1 }], 50) as never);
            mountTable({ page: 3 });
            await flushPromises();

            useFormFilterRepository("t_filter").reset();
            await flushPromises();

            expect(urls().at(-1)).toContain("page=1");
        });

        it("still works after a filter has been unmounted", async () => {
            const filter = mount(VqTableFilter, {
                props: { id: "t" },
                slots: { default: () => <VqTextField name="search" /> },
                ...plugins()
            });
            mountTable();
            await flushPromises();

            filter.unmount();
            await flushPromises();
            const before = urls().length;

            useFormFilterRepository("t_filter").reload();
            await flushPromises();

            expect(urls().length).toBe(before + 1);
        });

        it("VqDatatableItemAction refreshes its table after confirming", async () => {
            mountTable();
            await flushPromises();
            const before = urls().length;

            vi.mocked(useAsyncAxios).mockResolvedValue({ message: "Done" } as never);
            const action = mount(VqDatatableItemAction, {
                props: { id: "t", action: "users/delete", itemId: 7 },
                ...plugins()
            });
            await action.find(".v-btn").trigger("click");
            await flushPromises();

            vi.mocked(useAsyncAxios).mockResolvedValueOnce({ message: "Done" } as never);
            vi.mocked(useAsyncAxios).mockResolvedValue(page([], 0) as never);
            Array.from(document.body.querySelectorAll<HTMLElement>(".v-btn"))
                .find((b) => b.textContent?.trim() === "Confirm")!
                .click();
            await flushPromises();

            expect(urls()[before]).toBe("users/delete/7");
            expect(urls().length).toBeGreaterThan(before + 1);
            action.unmount();
        });

        it("cleans up the store entry a list created", async () => {
            const wrapper = mountList();
            await flushPromises();
            expect(useFormFilterStore().forms["l_filter"]).toBeDefined();

            wrapper.unmount();
            expect(useFormFilterStore().forms["l_filter"]).toBeUndefined();
            expect(useListDataStore().lists["l_filter"]).toBeUndefined();
        });
    });

    describe("VqDataTable", () => {
        it("follows later changes to itemsPerPage", async () => {
            const wrapper = mountTable();
            await flushPromises();

            await wrapper.setProps({ itemsPerPage: 25 });
            await flushPromises();

            expect(urls().at(-1)).toContain("itemsPerPage=25");
        });

        it("follows later changes to page", async () => {
            vi.mocked(useAsyncAxios).mockResolvedValue(page([{ id: 1 }], 50) as never);
            const wrapper = mountTable();
            await flushPromises();

            await wrapper.setProps({ page: 4 });
            await flushPromises();

            expect(urls().at(-1)).toContain("page=4");
        });

        it("keeps the user's sort when an inline sortBy is re-created by a parent render", async () => {
            const tick = ref(0);
            const Host = defineComponent({
                setup() {
                    return () => (
                        <div>
                            <i>{tick.value}</i>
                            <VqDataTable
                                id="t"
                                action="users"
                                sortBy={[{ key: "a", order: "asc" }]}
                            />
                        </div>
                    );
                }
            });
            const wrapper = mount(Host, plugins());
            await flushPromises();

            const inner = wrapper.findComponent(VDataTableServer);
            inner.vm.$emit("update:sortBy", [{ key: "b", order: "desc" }]);
            await flushPromises();
            const before = urls().length;

            tick.value++;
            await flushPromises();

            expect(inner.props("sortBy")).toEqual([{ key: "b", order: "desc" }]);
            expect(urls().length).toBe(before);
        });

        it("applies a sortBy prop whose contents really changed", async () => {
            const wrapper = mountTable({ sortBy: [{ key: "a", order: "asc" }] });
            await flushPromises();

            await wrapper.setProps({ sortBy: [{ key: "b", order: "desc" }] });
            await flushPromises();

            expect(wrapper.findComponent(VDataTableServer).props("sortBy")).toEqual([
                { key: "b", order: "desc" }
            ]);
        });

        it("sends no sort at all for an empty sortBy", async () => {
            mountTable({ sortBy: [] });
            await flushPromises();
            expect(urls()[0]).not.toContain("sortBy");
        });

        it("refetches when action changes", async () => {
            const wrapper = mountTable();
            await flushPromises();

            await wrapper.setProps({ action: "admins" });
            await flushPromises();

            expect(urls().at(-1)).toContain("admins?");
        });

        it("returns to the first page when action changes", async () => {
            const wrapper = mountTable({ page: 3 });
            await flushPromises();

            await wrapper.setProps({ action: "admins" });
            await flushPromises();

            expect(decodeURIComponent(urls().at(-1)!)).toContain("page=1&");
        });

        it("steps back to the last real page when the current one is empty", async () => {
            vi.mocked(useAsyncAxios)
                .mockResolvedValueOnce(page([], 21) as never)
                .mockResolvedValue(page([{ id: 1 }], 21) as never);

            mountTable({ page: 5, itemsPerPage: 10 });
            await flushPromises();

            expect(urls().at(-1)).toContain("page=3");
        });
    });

    describe("VqList", () => {
        it("renders the load-more slot the README documents", async () => {
            const wrapper = mountList({}, { "load-more": () => <button class="more" /> });
            await flushPromises();
            expect(wrapper.find(".more").exists()).toBe(true);
        });

        it("lets VList render items itself when no slot is given", async () => {
            vi.mocked(useAsyncAxios).mockResolvedValue(page([{ title: "Hello" }], 1) as never);
            const wrapper = mountList();
            await flushPromises();
            expect(wrapper.text()).toContain("Hello");
        });

        it("forwards other VList slots", async () => {
            vi.mocked(useAsyncAxios).mockResolvedValue(page([{ title: "Hello" }], 1) as never);
            const wrapper = mountList({}, { title: () => <b class="custom">custom</b> });
            await flushPromises();
            expect(wrapper.find(".custom").exists()).toBe(true);
        });

        it("forwards the method prop", async () => {
            mountList({ method: "POST" });
            await flushPromises();
            expect(vi.mocked(useAsyncAxios).mock.calls[0][1]).toMatchObject({ method: "POST" });
        });

        it("loadMore does nothing while a page is loading or the list is finished", async () => {
            let loadMore = () => {};
            let resolve: (value: unknown) => void = () => {};
            vi.mocked(useAsyncAxios).mockReturnValueOnce(
                new Promise((r) => (resolve = r)) as never
            );
            mountList(
                {},
                {
                    default: (slot: any) => {
                        loadMore = slot.loadMore;
                        return null;
                    }
                }
            );
            await flushPromises();

            loadMore();
            await flushPromises();
            expect(urls()).toHaveLength(1);

            resolve(page([{ id: 1 }, { id: 2 }], 2));
            await flushPromises();

            loadMore();
            await flushPromises();
            expect(urls()).toHaveLength(1);
        });

        it("refetches from page 1 when pageSize changes", async () => {
            vi.mocked(useAsyncAxios).mockResolvedValue(page([{ id: 1 }, { id: 2 }], 9) as never);
            const wrapper = mountList();
            await flushPromises();

            await wrapper.setProps({ pageSize: 5 });
            await flushPromises();

            expect(urls().at(-1)).toContain("page=1");
            expect(urls().at(-1)).toContain("page_size=5");
        });
    });

    describe("VqTableFilter", () => {
        const Pair = defineComponent({
            props: { debounce: { type: Number, default: 0 } },
            setup(props) {
                return () => (
                    <div>
                        <VqTableFilter id="l" {...{ initialValues: { status: 0 } }}>
                            <VqTextField name="search" />
                        </VqTableFilter>
                        <VqList
                            id="l"
                            action="posts"
                            filterDebounce={props.debounce}
                            v-slots={{ default: () => null }}
                        />
                    </div>
                );
            }
        });

        it("does not natively submit (reload the page) on Enter", async () => {
            const submit = vi
                .spyOn(HTMLFormElement.prototype, "submit")
                .mockImplementation(() => {});
            const wrapper = mount(VqTableFilter, {
                props: { id: "l" },
                slots: { default: () => <VqTextField name="search" /> },
                ...plugins()
            });

            await wrapper.find("form").trigger("submit");
            await flushPromises();

            expect(submit).not.toHaveBeenCalled();
            submit.mockRestore();
        });

        it("calls a consumer's @submit handler once", async () => {
            const onSubmit = vi.fn();
            const wrapper = mount(VqTableFilter, {
                props: { id: "l" },
                attrs: { onSubmit },
                slots: { default: () => <VqTextField name="search" /> },
                ...plugins()
            });

            await wrapper.find("form").trigger("submit");
            await new Promise((r) => setTimeout(r, 20));
            await flushPromises();

            expect(onSubmit).toHaveBeenCalledTimes(1);
        });

        it("sends a 0 filter value to the server", async () => {
            mount(Pair, plugins());
            await flushPromises();
            expect(urls()[0]).toContain("status=0");
        });

        it("refetches on every filter change by default", async () => {
            const wrapper = mount(Pair, plugins());
            await flushPromises();
            const before = urls().length;

            await wrapper.find("input").setValue("a");
            await flushPromises();

            expect(urls().length).toBe(before + 1);
        });

        it("debounces filter changes when filterDebounce is set", async () => {
            const wrapper = mount(Pair, { props: { debounce: 30 }, ...plugins() });
            await flushPromises();
            const before = urls().length;

            await wrapper.find("input").setValue("a");
            await flushPromises();
            await wrapper.find("input").setValue("ab");
            await flushPromises();
            expect(urls().length).toBe(before);

            await new Promise((r) => setTimeout(r, 60));
            await flushPromises();

            expect(urls().length).toBe(before + 1);
            expect(urls().at(-1)).toContain("search=ab");
        });
    });
});
