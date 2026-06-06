import { mount, flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import { VAutocomplete } from "vuetify/components";

vi.mock("@qnx/composables/axios", () => ({
    useAsyncAxios: vi.fn()
}));

import { useAsyncAxios } from "@qnx/composables/axios";
import { VqAutocomplete } from "../index";

// When given an `action`, VqAutocomplete fetches its option list on mount via
// useAsyncAxios and feeds `res.data.data` into the underlying VAutocomplete.
describe("VqAutocomplete (remote items)", () => {
    const vuetify = createVuetify();

    beforeEach(() => {
        vi.mocked(useAsyncAxios).mockReset();
    });

    const mountAutocomplete = (props: Record<string, unknown>) =>
        mount(VqAutocomplete, {
            props: { name: "country", ...props },
            global: { plugins: [vuetify] }
        });

    it("fetches options from `action` on mount and passes them to VAutocomplete", async () => {
        const options = [
            { title: "Alpha", value: 1 },
            { title: "Beta", value: 2 }
        ];
        vi.mocked(useAsyncAxios).mockResolvedValue({ data: { data: options } } as never);

        const wrapper = mountAutocomplete({ action: "countries" });
        await flushPromises();

        expect(useAsyncAxios).toHaveBeenCalledTimes(1);
        expect(vi.mocked(useAsyncAxios).mock.calls[0][0]).toBe("countries");

        const inner = wrapper.findComponent(VAutocomplete);
        expect(inner.props("items")).toEqual(options);
        expect(inner.props("loading")).toBe(false);
    });

    it("does not fetch when no `action` is provided", async () => {
        const wrapper = mountAutocomplete({ items: [{ title: "Static", value: 9 }] });
        await flushPromises();

        expect(useAsyncAxios).not.toHaveBeenCalled();
        expect(wrapper.findComponent(VAutocomplete).props("items")).toEqual([
            { title: "Static", value: 9 }
        ]);
    });

    it("logs and recovers when the fetch rejects", async () => {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        vi.mocked(useAsyncAxios).mockRejectedValue(new Error("network down") as never);

        const wrapper = mountAutocomplete({ action: "countries" });
        await flushPromises();

        expect(errorSpy).toHaveBeenCalledWith("network down");
        // loading is cleared in finally even on failure
        expect(wrapper.findComponent(VAutocomplete).props("loading")).toBe(false);

        errorSpy.mockRestore();
    });
});
