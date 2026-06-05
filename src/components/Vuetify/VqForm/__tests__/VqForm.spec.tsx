import { mount, flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { defineComponent, inject, type Ref } from "vue";

// Mock the async HTTP layer so submission is deterministic and offline.
vi.mock("@qnx/composables/axios", () => ({
    useAsyncAxios: vi.fn(),
    useErrorResponse: vi.fn(() => ({ getErrorResponse: vi.fn() }))
}));

import { useAsyncAxios } from "@qnx/composables/axios";
import { VqForm } from "../VqForm";
import { VqTextField } from "../../VqTextField";
import { useFormStore } from "../../../../store/reactivity/form";

const FormIdProbe = defineComponent({
    setup() {
        const formId = inject<Readonly<Ref<string | undefined>>>("formId");
        return () => <span class="probe">{formId?.value}</span>;
    }
});

describe("VqForm", () => {
    const vuetify = createVuetify();
    let pinia: Pinia;

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
        vi.mocked(useAsyncAxios).mockReset();
    });

    const mountForm = (props: Record<string, unknown>, slots: Record<string, any> = {}) =>
        mount(VqForm, {
            props: { id: "create-user", action: "users/create", ...props },
            slots,
            global: { plugins: [vuetify, pinia] }
        });

    it("renders a <form> carrying the id and the default slot", () => {
        const wrapper = mountForm({}, { default: () => <button class="child">Go</button> });
        const form = wrapper.find("form");
        expect(form.exists()).toBe(true);
        expect(form.attributes("id")).toBe("create-user");
        expect(wrapper.find(".child").exists()).toBe(true);
    });

    it("registers the form in the store on mount and provides its id", () => {
        const wrapper = mountForm({}, { default: () => <FormIdProbe /> });
        const store = useFormStore();
        expect(store.forms["create-user"]).toEqual({ busy: false });
        expect(wrapper.find(".probe").text()).toBe("create-user");
    });

    it("posts via useAsyncAxios and calls the success handler with the response", async () => {
        const response = { data: { id: 1 }, ok: true };
        vi.mocked(useAsyncAxios).mockResolvedValue(response as never);
        const successResponseHandler = vi.fn();

        const wrapper = mountForm(
            { method: "POST", initialValues: { email: "a@b.c" }, successResponseHandler },
            { default: () => <VqTextField name="email" /> }
        );

        await wrapper.find("form").trigger("submit");
        await flushPromises();

        expect(useAsyncAxios).toHaveBeenCalledTimes(1);
        const [calledAction, calledConfig] = vi.mocked(useAsyncAxios).mock.calls[0];
        expect(calledAction).toBe("users/create");
        expect(calledConfig).toMatchObject({ method: "POST", data: { email: "a@b.c" } });
        expect(successResponseHandler).toHaveBeenCalledTimes(1);
        expect(successResponseHandler.mock.calls[0][0]).toBe(response);
    });

    it("routes rejections to the error handler", async () => {
        const err = new Error("boom");
        vi.mocked(useAsyncAxios).mockRejectedValue(err as never);
        const errorResponseHandler = vi.fn();

        const wrapper = mountForm({ errorResponseHandler });

        await wrapper.find("form").trigger("submit");
        await flushPromises();

        expect(errorResponseHandler).toHaveBeenCalledTimes(1);
        expect(errorResponseHandler.mock.calls[0][0]).toBe(err);
    });
});
