import { mount, flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { defineComponent, nextTick } from "vue";
import { object, string } from "yup";

vi.mock("@qnx/composables/axios", () => ({
    useAsyncAxios: vi.fn(),
    useErrorResponse: vi.fn()
}));

import { useAsyncAxios, useErrorResponse } from "@qnx/composables/axios";
import { VqForm, useVqForm } from "../VqForm";
import { VqTextField } from "../../VqTextField";
import { useFormStore } from "../../../../store/reactivity/form";

const required = object({ email: string().required("Email is required") });

// vee-validate debounces schema validation by 5ms, past what flushPromises waits.
const settle = async () => {
    await flushPromises();
    await new Promise((r) => setTimeout(r, 20));
    await flushPromises();
};

describe("VqForm behaviour", () => {
    const vuetify = createVuetify();
    let pinia: Pinia;

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
        vi.mocked(useAsyncAxios).mockReset();
        vi.mocked(useErrorResponse).mockReset();
    });

    const mountForm = (props: Record<string, unknown> = {}) =>
        mount(VqForm, {
            props: { id: "f", action: "users", ...props },
            slots: { default: () => <VqTextField name="email" /> },
            global: { plugins: [vuetify, pinia] }
        });

    it("emits submitedClientError when client validation fails, without a request", async () => {
        const wrapper = mountForm({ validationSchema: required });

        await wrapper.find("form").trigger("submit");
        await settle();

        expect(useAsyncAxios).not.toHaveBeenCalled();
        expect(wrapper.emitted("submitedClientError")).toHaveLength(1);
        expect(wrapper.text()).toContain("Email is required");
    });

    it("emits submitedRequestError instead of an unhandled rejection on a 500", async () => {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        const failure = new Error("Server Error");
        vi.mocked(useAsyncAxios).mockRejectedValue(failure as never);
        vi.mocked(useErrorResponse).mockReturnValue({
            getErrorResponse: vi.fn().mockRejectedValue(new Error("Server Error"))
        } as never);

        const wrapper = mountForm();
        await wrapper.find("form").trigger("submit");
        await flushPromises();

        expect(wrapper.emitted("submitedRequestError")?.[0]).toEqual([failure]);
        expect(useFormStore().forms["f"].busy).toBe(false);
        errorSpy.mockRestore();
    });

    it("ignores a second submit while the first request is running", async () => {
        let resolve: (value: unknown) => void = () => {};
        vi.mocked(useAsyncAxios).mockReturnValue(new Promise((r) => (resolve = r)) as never);

        const wrapper = mountForm();
        await wrapper.find("form").trigger("submit");
        await flushPromises();
        await wrapper.find("form").trigger("submit");
        await flushPromises();

        expect(useAsyncAxios).toHaveBeenCalledTimes(1);

        resolve({ data: {} });
        await flushPromises();
        expect(useFormStore().forms["f"].busy).toBe(false);
    });

    it("does not report a throwing success handler as a failed request", async () => {
        vi.mocked(useAsyncAxios).mockResolvedValue({ data: {} } as never);
        const rejections: unknown[] = [];
        const onRejection = (reason: unknown) => rejections.push(reason);
        process.on("unhandledRejection", onRejection);
        const errorResponseHandler = vi.fn();
        const boom = new Error("handler bug");

        const wrapper = mountForm({
            errorResponseHandler,
            successResponseHandler: () => {
                throw boom;
            }
        });
        await wrapper.find("form").trigger("submit");
        await flushPromises();
        await new Promise((r) => setTimeout(r));
        process.off("unhandledRejection", onRejection);

        expect(errorResponseHandler).not.toHaveBeenCalled();
        expect(useFormStore().forms["f"].busy).toBe(false);
    });

    it("follows a validationSchema that changes after mount", async () => {
        vi.mocked(useAsyncAxios).mockResolvedValue({ data: {} } as never);
        const wrapper = mountForm({ validationSchema: required });

        await wrapper.setProps({ validationSchema: object({ email: string() }) });
        await wrapper.find("form").trigger("submit");
        await settle();

        expect(useAsyncAxios).toHaveBeenCalledTimes(1);
    });

    it("clears a field error once the value is corrected", async () => {
        const wrapper = mountForm({ validationSchema: required });
        await wrapper.find("form").trigger("submit");
        await settle();
        expect(wrapper.text()).toContain("Email is required");

        await wrapper.find("input").setValue("a@b.c");
        await settle();

        expect(wrapper.text()).not.toContain("Email is required");
    });

    it("does not re-validate while the user first types", async () => {
        const wrapper = mountForm({ validationSchema: required });

        await wrapper.find("input").setValue("a");
        await wrapper.find("input").setValue("");
        await settle();

        expect(wrapper.text()).not.toContain("Email is required");
    });

    describe("valuesSchema", () => {
        const submittedValues = async (initialValues: object, valuesSchema: object) => {
            vi.mocked(useAsyncAxios).mockResolvedValue({ data: {} } as never);
            const wrapper = mountForm({ initialValues, valuesSchema });
            await wrapper.find("form").trigger("submit");
            await flushPromises();
            return vi.mocked(useAsyncAxios).mock.calls[0][1].data as Record<string, unknown>;
        };

        it("maps nested values to flat fields", async () => {
            const values = await submittedValues({ user: { name: "ann" } }, { name: "user.name" });
            expect(values.name).toBe("ann");
        });

        it("leaves a missing path undefined instead of the schema object", async () => {
            const values = await submittedValues({ user: {} }, { name: "user.name" });
            expect(values.name).toBeUndefined();
        });

        it("keeps array order for wildcard paths", async () => {
            const values = await submittedValues(
                { tags: [{ id: 1 }, { id: 2 }, { id: 3 }] },
                { tagIds: "tags.*.id" }
            );
            expect(values.tagIds).toEqual([1, 2, 3]);
        });

        it("does not throw on a wildcard over a missing array", async () => {
            const values = await submittedValues({}, { tagIds: "tags.*.id" });
            expect(values.tagIds).toBeUndefined();
        });
    });
});

describe("useVqForm", () => {
    const vuetify = createVuetify();
    let pinia: Pinia;

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
        vi.mocked(useAsyncAxios).mockReset();
    });

    const mountComposable = (options: Record<string, unknown>) => {
        let form!: ReturnType<typeof useVqForm>;
        const Host = defineComponent({
            setup(_props, { attrs }) {
                form = useVqForm({ formId: "edit", ...options });
                const Wrapper = form.wrapper as any;
                return () => (
                    <Wrapper action="users" {...attrs}>
                        <VqTextField name="email" />
                    </Wrapper>
                );
            }
        });
        const onSuccess = vi.fn();
        const wrapper = mount(Host, {
            attrs: { onSubmitedSuccess: onSuccess },
            global: { plugins: [vuetify, pinia] }
        });
        return { wrapper, form, onSuccess };
    };

    it("applies plain-object initialValues without a watcher warning", async () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        const { wrapper } = mountComposable({ initialValues: { email: "a@b.c" } });
        await nextTick();

        expect(wrapper.find("input").element.value).toBe("a@b.c");
        expect(warn.mock.calls.flat().join(" ")).not.toContain("Invalid watch source");
        warn.mockRestore();
    });

    it("works with no initialValues at all", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        mountComposable({});
        expect(warn.mock.calls.flat().join(" ")).not.toContain("Invalid watch source");
        warn.mockRestore();
    });

    it("sets the form id so an outside VqSubmitBtn can target it", () => {
        const { wrapper } = mountComposable({});
        expect(wrapper.find("form").attributes("id")).toBe("edit");
    });

    it("emits submitedSuccess and exposes form state", async () => {
        vi.mocked(useAsyncAxios).mockResolvedValue({ data: {} } as never);
        const { wrapper, form, onSuccess } = mountComposable({
            initialValues: { email: "a@b.c" }
        });

        expect(form.values.email).toBe("a@b.c");

        await wrapper.find("form").trigger("submit");
        await flushPromises();

        expect(onSuccess).toHaveBeenCalledTimes(1);
    });
});
