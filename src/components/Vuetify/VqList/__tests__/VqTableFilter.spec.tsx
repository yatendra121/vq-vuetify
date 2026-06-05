import { mount, flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { createVuetify } from "vuetify";
import { createPinia, setActivePinia, type Pinia } from "pinia";

import { VqTableFilter } from "../VqTableFilter";
import { VqTextField } from "../../VqTextField";
import { useFormFilterStore } from "../../../../store/reactivity/formFiler";

// VqTableFilter wraps its slot in a vee-validate <Form> + VqTableFilterHandler.
// The handler mirrors the form's values into the form-filter store under
// `${id}_filter`, which is the contract VqDataTable / VqList rely on.
describe("VqTableFilter + VqTableFilterHandler", () => {
    const vuetify = createVuetify();
    let pinia: Pinia;

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
    });

    const mountFilter = () =>
        mount(VqTableFilter, {
            props: { id: "users" },
            slots: { default: () => <VqTextField name="search" /> },
            global: { plugins: [vuetify, pinia] }
        });

    it("registers a `${id}_filter` entry in the store on mount", async () => {
        mountFilter();
        await flushPromises();

        const store = useFormFilterStore();
        expect(store.forms["users_filter"]).toBeDefined();
        expect(store.forms["users_filter"].values).toHaveProperty("search");
    });

    it("mirrors field changes into the filter store's values", async () => {
        const wrapper = mountFilter();
        await flushPromises();

        await wrapper.find("input").setValue("ann");
        await flushPromises();

        const store = useFormFilterStore();
        expect(store.forms["users_filter"].values.search).toBe("ann");
    });

    it("removes the filter entry when unmounted", async () => {
        const wrapper = mountFilter();
        await flushPromises();
        const store = useFormFilterStore();
        expect(store.forms["users_filter"]).toBeDefined();

        wrapper.unmount();
        expect(store.forms["users_filter"]).toBeUndefined();
    });
});
