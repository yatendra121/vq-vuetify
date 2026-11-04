import { mount, flushPromises, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import {
    VAutocomplete,
    VColorPicker,
    VDatePicker,
    VFileInput,
    VMenu,
    VMessages,
    VTextField,
    VTimePicker
} from "vuetify/components";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { mixed, object, string } from "yup";
import { ref } from "vue";

vi.mock("@qnx/composables/axios", () => ({
    useAsyncAxios: vi.fn(),
    useErrorResponse: vi.fn()
}));

import { useAsyncAxios, useErrorResponse } from "@qnx/composables/axios";
import { VqForm } from "../VqForm/VqForm";
import { VqDatePicker } from "../VqDatePicker";
import { VqOtpInput } from "../VqOtpInput";
import { VqFileInput } from "../VqFileInput";
import { VqAutocomplete } from "../VqAutocomplete";
import { VqColorPicker } from "../VqColorPicker";
import { VqTimePicker } from "../VqTimePicker";
import { VqSubmitBtn } from "../../Basic/SubmitButton";
import { useFormStore } from "../../../store/reactivity/form";

const pickers: Record<string, any> = {
    VqDatePicker: VDatePicker,
    VqTimePicker: VTimePicker,
    VqColorPicker: VColorPicker
};

// vee-validate debounces schema validation by 5ms, past what flushPromises waits.
const settle = async () => {
    await flushPromises();
    await new Promise((r) => setTimeout(r, 20));
    await flushPromises();
};

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
            // Assigning undefined would set the literal string "undefined".
            if (originalTz === undefined) delete process.env.TZ;
            else process.env.TZ = originalTz;
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

        describe("value stored after picking a date", () => {
            beforeEach(() => {
                process.env.TZ = "Asia/Kolkata";
            });

            const pick = async (props: Record<string, unknown>, picked: unknown) => {
                vi.mocked(useAsyncAxios).mockResolvedValue({ data: {} } as never);
                const wrapper = inForm(() => <VqDatePicker name="d" {...props} />);
                wrapper.findComponent(VMenu).vm.$emit("update:modelValue", true);
                await flushPromises();
                wrapper.findComponent(VDatePicker).vm.$emit("update:modelValue", picked);
                await flushPromises();
                await wrapper.find("form").trigger("submit");
                await settle();
                return vi.mocked(useAsyncAxios).mock.calls[0][1].data as { d: unknown };
            };

            it("stays a Date by default, as existing consumers expect", async () => {
                const picked = new Date(2024, 0, 15);
                const { d } = await pick({}, picked);
                expect(d).toEqual(picked);
                // Why dateOnly exists: local midnight serializes to the previous day.
                expect(JSON.stringify(d)).toBe('"2024-01-14T18:30:00.000Z"');
            });

            it("is a calendar-day string with dateOnly, even east of Greenwich", async () => {
                const { d } = await pick({ dateOnly: true }, new Date(2024, 0, 15));
                expect(d).toBe("2024-01-15");
            });

            it("maps every date in multiple mode with dateOnly", async () => {
                const { d } = await pick({ dateOnly: true, multiple: true }, [
                    new Date(2024, 0, 15),
                    new Date(2024, 0, 16)
                ]);
                expect(d).toEqual(["2024-01-15", "2024-01-16"]);
            });
        });

        it("applies fieldProps to the text field", () => {
            const wrapper = inForm(() => (
                <VqDatePicker name="d" fieldProps={{ variant: "outlined" }} />
            ));
            expect(wrapper.findComponent(VTextField).props("variant")).toBe("outlined");
        });
    });

    describe.each([
        ["VqDatePicker", VqDatePicker],
        ["VqTimePicker", VqTimePicker],
        ["VqColorPicker", VqColorPicker]
    ])("%s keyboard", (name, Picker: any) => {
        it.each([" ", "ArrowDown"])("opens on %j", async (key) => {
            const wrapper = inForm(() => <Picker name="p" />);
            await wrapper.find("input").trigger("keydown", { key });
            await flushPromises();
            expect(wrapper.findComponent(VMenu).props("modelValue")).toBe(true);
        });

        it("leaves Enter and other keys alone", async () => {
            const wrapper = inForm(() => <Picker name="p" />);
            await wrapper.find("input").trigger("keydown", { key: "Enter" });
            await wrapper.find("input").trigger("keydown", { key: "a" });
            await flushPromises();
            expect(wrapper.findComponent(VMenu).props("modelValue")).toBe(false);
        });

        it("puts id and placeholder on the text field, without a Vue warning", () => {
            const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
            const wrapper = inForm(() => <Picker id="dob" name="p" placeholder="Pick one" />);

            expect(wrapper.find("input").attributes("id")).toBe("dob");
            expect(wrapper.find("input").attributes("placeholder")).toBe("Pick one");
            expect(warn.mock.calls.flat().join(" ")).not.toContain("Extraneous");
            warn.mockRestore();
        });

        it("does not warn about attrs that go to the unopened picker", () => {
            const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
            inForm(() => <Picker name="p" {...{ elevation: 4 }} />);
            expect(warn.mock.calls.flat().join(" ")).not.toContain("Extraneous");
            warn.mockRestore();
        });

        it("still sends other attrs to the picker, and not to the text field", async () => {
            const wrapper = inForm(() => (
                <Picker id="dob" name="p" {...{ "data-test": "x", elevation: 4 }} />
            ));
            expect(wrapper.find("input").attributes("data-test")).toBeUndefined();

            wrapper.findComponent(VMenu).vm.$emit("update:modelValue", true);
            await flushPromises();

            const picker = wrapper.findComponent(pickers[name]) as unknown as VueWrapper<any>;
            expect(picker.props("elevation")).toBe(4);
            expect(picker.attributes("data-test")).toBe("x");
            expect(picker.attributes("id")).toBeUndefined();
        });

        it("lets fieldProps override id and placeholder", () => {
            const wrapper = inForm(() => (
                <Picker id="a" name="p" fieldProps={{ id: "b" }} />
            ));
            expect(wrapper.find("input").attributes("id")).toBe("b");
        });

        it("still runs a consumer's onKeydown from fieldProps", async () => {
            const onKeydown = vi.fn();
            const wrapper = inForm(() => <Picker name="p" fieldProps={{ onKeydown }} />);
            await wrapper.find("input").trigger("keydown", { key: " " });
            await flushPromises();
            expect(onKeydown).toHaveBeenCalledTimes(1);
            expect(wrapper.findComponent(VMenu).props("modelValue")).toBe(true);
        });
    });

    describe("VqFileInput", () => {
        const required = "Attachment is required";
        const file = new File(["x"], "a.txt");
        const mountFile = (props: Record<string, unknown>) =>
            inForm(() => <VqFileInput name="avatar" />, props);

        it.each([
            ["name", object({ avatar: mixed().required(required) })],
            ["name.file", object({ avatar: object({ file: mixed().required(required) }) })]
        ])("shows a schema error reported on `%s`", async (_label, validationSchema) => {
            const wrapper = mountFile({ validationSchema });

            await wrapper.find("form").trigger("submit");
            await settle();

            expect(useAsyncAxios).not.toHaveBeenCalled();
            expect(wrapper.text()).toContain(required);
        });

        it.each(["avatar", "avatar.file", "avatar[file]"])(
            "shows a server error reported on `%s`",
            async (key) => {
                vi.mocked(useAsyncAxios).mockRejectedValue(new Error("422") as never);
                vi.mocked(useErrorResponse).mockReturnValue({
                    getErrorResponse: async () => ({
                        eResponse: ref({ errors: { [key]: ["Too large"] }, message: "bad" })
                    })
                } as never);
                const wrapper = mountFile({});

                await wrapper.find("form").trigger("submit");
                await settle();

                expect(wrapper.text()).toContain("Too large");
            }
        );

        it("keeps the existing payload key and literal schema by default", async () => {
            vi.mocked(useAsyncAxios).mockResolvedValue({ data: {} } as never);
            const wrapper = mountFile({
                validationSchema: object({ "avatar[file]": mixed().required(required) })
            });

            await wrapper.find("form").trigger("submit");
            await settle();
            expect(useAsyncAxios).not.toHaveBeenCalled();
            expect(wrapper.text()).toContain(required);

            wrapper.findComponent(VFileInput).vm.$emit("update:modelValue", file);
            await settle();
            expect(wrapper.text()).not.toContain(required);

            await wrapper.find("form").trigger("submit");
            await settle();
            expect(vi.mocked(useAsyncAxios).mock.calls[0][1].data).toEqual({
                "avatar[file]": file
            });
        });

        it("stores the value at `name` with rawName, so a `name` schema can pass", async () => {
            vi.mocked(useAsyncAxios).mockResolvedValue({ data: {} } as never);
            const wrapper = inForm(() => <VqFileInput name="avatar" rawName />, {
                validationSchema: object({ avatar: mixed().required(required) })
            });

            await wrapper.find("form").trigger("submit");
            await settle();
            expect(useAsyncAxios).not.toHaveBeenCalled();
            expect(wrapper.text()).toContain(required);

            wrapper.findComponent(VFileInput).vm.$emit("update:modelValue", file);
            await settle();
            expect(wrapper.text()).not.toContain(required);

            await wrapper.find("form").trigger("submit");
            await settle();
            expect(vi.mocked(useAsyncAxios).mock.calls[0][1].data).toEqual({ avatar: file });
        });

        it("clears a server error on `name` when no schema is set", async () => {
            vi.mocked(useAsyncAxios).mockRejectedValue(new Error("422") as never);
            vi.mocked(useErrorResponse).mockReturnValue({
                getErrorResponse: async () => ({
                    eResponse: ref({ errors: { avatar: ["Too large"] }, message: "bad" })
                })
            } as never);
            const wrapper = mountFile({});
            await wrapper.find("form").trigger("submit");
            await settle();
            expect(wrapper.text()).toContain("Too large");

            wrapper.findComponent(VFileInput).vm.$emit("update:modelValue", file);
            await settle();

            expect(wrapper.text()).not.toContain("Too large");
        });

        it("still works outside a form without a warning", () => {
            const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
            mount(VqFileInput, {
                props: { name: "avatar" },
                global: { plugins: [vuetify] }
            });
            expect(warn.mock.calls.flat().join(" ")).not.toContain("injection");
            warn.mockRestore();
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

        it("adds no message row, and so no layout shift, while valid", () => {
            const wrapper = inForm(() => <VqOtpInput name="otp" />);
            expect(wrapper.findComponent(VMessages).exists()).toBe(false);
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
