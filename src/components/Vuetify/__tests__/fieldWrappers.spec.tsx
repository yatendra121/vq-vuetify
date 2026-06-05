import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { createVuetify } from "vuetify";

import { VqCheckbox } from "../VqCheckbox";
import { VqAutocomplete } from "../VqAutocomplete";
import { VqColorPicker } from "../VqColorPicker";
import { VqDatePicker } from "../VqDatePicker";
import { VqTimePicker } from "../VqTimePicker";
import { VqOtpInput } from "../VqOtpInput";
import { VqFileInput } from "../VqFileInput";
import { VqFileUpload } from "../VqFileUpload";

// Smoke coverage for the vee-validate field wrappers: each must mount with
// just the `name` prop (useField works standalone) and render its underlying
// Vuetify control without throwing. These guard against the broken-import /
// bad-render-shape class of regressions.
describe("vee-validate field wrappers", () => {
    const vuetify = createVuetify();

    const mountField = (component: any, props: Record<string, unknown> = {}) =>
        mount(component, {
            props: { name: "field", ...props },
            global: { plugins: [vuetify] }
        });

    it("VqCheckbox renders a Vuetify checkbox", () => {
        const wrapper = mountField(VqCheckbox);
        expect(wrapper.find(".v-checkbox").exists()).toBe(true);
        expect(wrapper.find("input").exists()).toBe(true);
    });

    it("VqAutocomplete renders a Vuetify autocomplete (no action -> no fetch)", () => {
        const wrapper = mountField(VqAutocomplete);
        expect(wrapper.find(".v-autocomplete").exists()).toBe(true);
    });

    it("VqColorPicker renders its text-field activator", () => {
        const wrapper = mountField(VqColorPicker, { label: "Colour" });
        expect(wrapper.find(".v-text-field").exists()).toBe(true);
    });

    it("VqDatePicker renders its text-field activator", () => {
        const wrapper = mountField(VqDatePicker, { label: "Date" });
        expect(wrapper.find(".v-text-field").exists()).toBe(true);
    });

    it("VqTimePicker renders its text-field activator", () => {
        const wrapper = mountField(VqTimePicker, { label: "Time" });
        expect(wrapper.find(".v-text-field").exists()).toBe(true);
    });

    it("VqOtpInput renders a Vuetify OTP input", () => {
        const wrapper = mountField(VqOtpInput);
        expect(wrapper.find(".v-otp-input").exists()).toBe(true);
    });

    it("VqFileInput renders a Vuetify file input", () => {
        const wrapper = mountField(VqFileInput);
        expect(wrapper.find(".v-file-input").exists()).toBe(true);
        expect(wrapper.find("input[type='file']").exists()).toBe(true);
    });

    it("VqFileUpload renders a Vuetify file upload", () => {
        const wrapper = mountField(VqFileUpload);
        expect(wrapper.find(".v-file-upload").exists()).toBe(true);
    });
});
