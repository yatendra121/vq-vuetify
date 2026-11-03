import { mount, flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import { VAutocomplete, VDatePicker, VMenu, VTextField } from "vuetify/components";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { object, string } from "yup";

vi.mock("@qnx/composables/axios", () => ({
    useAsyncAxios: vi.fn(),
    useErrorResponse: vi.fn()
}));

import { useAsyncAxios } from "@qnx/composables/axios";
import { VqForm } from "../VqForm/VqForm";
import { VqDatePicker } from "../VqDatePicker";
import { VqOtpInput } from "../VqOtpInput";
import { VqAutocomplete } from "../VqAutocomplete";
import { VqColorPicker } from "../VqColorPicker";
import { VqSubmitBtn } from "../../Basic/SubmitButton";
import { useFormStore } from "../../../store/reactivity/form";

describe("field wrappers behaviour", () => {
    const vuetify = createVuetify();
    let pinia: Pinia;

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
        vi.mocked(useAsyncAxios).mockReset();
    });

    const inForm = (field: () => any, props: Record<string, unknown> = {}) =>
        mount(VqForm, {
            props: { id: "f", action: "x", ...props },
            slots: { default: field },
            global: { plugins: [vuetify, pinia] }
        });

    describe("VqDatePicker", () => {
        const originalTz = process.env.TZ;
        afterEach(() => {
            process.env.TZ = originalTz;
        });

        it("shows a date-only value on its own calendar day west of Greenwich", () => {
            process.env.TZ = "America/New_York";
            const wrapper = inForm(() => <VqDatePicker name="d" />, {
                initialValues: { d: "2024-01-15" }
            });
            expect(wrapper.find("input").element.value).toBe("2024-01-15");
        });

        it("shows nothing for an unparseable value", () => {
            const wrapper = inForm(() => <VqDatePicker name="d" />, {
                initialValues: { d: "not a date" }
            });
            expect(wrapper.find("input").element.value).toBe("");
        });

        it("displays every selected date in multiple mode", () => {
            const wrapper = inForm(() => <VqDatePicker name="d" multiple />, {
                initialValues: { d: ["2024-01-15", "2024-01-16"] }
            });
            expect(wrapper.find("input").element.value).toBe("2024-01-15, 2024-01-16");
        });

        it("forwards multiple to VDatePicker", async () => {
            const wrapper = inForm(() => <VqDatePicker name="d" multiple />);
            wrapper.findComponent(VMenu).vm.$emit("update:modelValue", true);
            await flushPromises();
            expect(wrapper.findComponent(VDatePicker).props("multiple")).toBe(true);
        });

        it("applies fieldProps to the text field", () => {
            const wrapper = inForm(() => (
                <VqDatePicker name="d" fieldProps={{ variant: "outlined" }} />
            ));
            expect(wrapper.findComponent(VTextField).props("variant")).toBe("outlined");
        });
    });

    describe("VqColorPicker", () => {
        it("does not render an object value as [object Object]", () => {
            const wrapper = inForm(() => <VqColorPicker name="c" />, {
                initialValues: { c: { r: 1, g: 2, b: 3 } }
            });
            expect(wrapper.find("input").element.value).not.toContain("[object Object]");
        });
    });

    describe("VqOtpInput", () => {
        it("keeps a value from initialValues", async () => {
            const wrapper = inForm(() => <VqOtpInput name="otp" />, {
                initialValues: { otp: "123456" }
            });
            vi.mocked(useAsyncAxios).mockResolvedValue({ data: {} } as never);

            await wrapper.find("form").trigger("submit");
            await flushPromises();

            expect(vi.mocked(useAsyncAxios).mock.calls[0][1].data).toEqual({ otp: "123456" });
        });

        it("displays the validation message", async () => {
            const wrapper = inForm(() => <VqOtpInput name="otp" />, {
                validationSchema: object({ otp: string().required("Code is required") })
            });

            await wrapper.find("form").trigger("submit");
            // vee-validate debounces schema validation by 5ms.
            await new Promise((r) => setTimeout(r, 20));
            await flushPromises();

            expect(wrapper.text()).toContain("Code is required");
        });
    });

    describe("VqAutocomplete", () => {
        const mountField = (props: Record<string, unknown>) =>
            mount(VqAutocomplete, {
                props: { name: "c", ...props },
                global: { plugins: [vuetify] }
            });

        it("reflects later changes to the items prop", async () => {
            const wrapper = mountField({ items: ["a"] });
            await wrapper.setProps({ items: ["a", "b"] });
            expect(wrapper.findComponent(VAutocomplete).props("items")).toEqual(["a", "b"]);
        });

        it("refetches when action changes", async () => {
            vi.mocked(useAsyncAxios).mockResolvedValue({ data: { data: ["x"] } } as never);
            const wrapper = mountField({ action: "one" });
            await flushPromises();

            vi.mocked(useAsyncAxios).mockResolvedValue({ data: { data: ["y"] } } as never);
            await wrapper.setProps({ action: "two" });
            await flushPromises();

            expect(vi.mocked(useAsyncAxios).mock.calls[1][0]).toBe("two");
            expect(wrapper.findComponent(VAutocomplete).props("items")).toEqual(["y"]);
        });

        it("emits error when the fetch fails", async () => {
            const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
            const failure = new Error("down");
            vi.mocked(useAsyncAxios).mockRejectedValue(failure as never);

            const wrapper = mountField({ action: "one" });
            await flushPromises();

            expect(wrapper.emitted("error")?.[0]).toEqual([failure]);
            errorSpy.mockRestore();
        });

        it("does not emit error for an aborted fetch", async () => {
            vi.mocked(useAsyncAxios).mockRejectedValue(
                Object.assign(new Error("canceled"), { name: "CanceledError" }) as never
            );
            const wrapper = mountField({ action: "one" });
            await flushPromises();
            expect(wrapper.emitted("error")).toBeUndefined();
        });
    });

    describe("VqSubmitBtn", () => {
        const mountBtn = (options: Record<string, unknown> = {}) =>
            mount(VqSubmitBtn, { global: { plugins: [vuetify, pinia] }, ...options });

        it("shows loading for the form named by the form prop, outside any VqForm", () => {
            const store = useFormStore();
            store.addForm("outside");
            store.changeBusy("outside", true);

            const wrapper = mountBtn({ props: { form: "outside" } });

            expect(wrapper.find(".v-btn").classes()).toContain("v-btn--loading");
            expect(wrapper.find("button").attributes("form")).toBe("outside");
        });

        it("does not warn about a missing injection outside a form", () => {
            const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
            mountBtn();
            expect(warn.mock.calls.flat().join(" ")).not.toContain("injection");
            warn.mockRestore();
        });

        it("forwards named slots to VBtn", () => {
            const wrapper = mountBtn({ slots: { prepend: () => <i class="icon" /> } });
            expect(wrapper.find(".v-btn__prepend .icon").exists()).toBe(true);
            expect(wrapper.text()).toContain("Submit");
        });
    });
});
