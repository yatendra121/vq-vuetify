import { VqSubmitBtn } from "../SubmitButton";
import { useFormStore } from "../../../store/reactivity/form";

import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { createVuetify } from "vuetify";
import { createPinia, setActivePinia, type Pinia } from "pinia";
import { ref } from "vue";

describe("VqSubmitBtn", () => {
    const vuetify = createVuetify();
    let pinia: Pinia;

    beforeEach(() => {
        pinia = createPinia();
        setActivePinia(pinia);
    });

    const mountBtn = (options: Record<string, any> = {}) =>
        mount(VqSubmitBtn, {
            global: { plugins: [vuetify, pinia], ...(options.global ?? {}) },
            ...options
        });

    it("falls back to the localized 'Submit' label", () => {
        const wrapper = mountBtn();
        expect(wrapper.text()).toContain("Submit");
    });

    it("renders the `text` prop when provided", () => {
        const wrapper = mountBtn({ props: { text: "Save changes" } });
        expect(wrapper.text()).toContain("Save changes");
        expect(wrapper.text()).not.toContain("Submit");
    });

    it("prefers the default slot over the text prop", () => {
        const wrapper = mountBtn({
            props: { text: "Save changes" },
            slots: { default: () => "Go!" }
        });
        expect(wrapper.text()).toContain("Go!");
        expect(wrapper.text()).not.toContain("Save changes");
    });

    it("is not loading when no form id is injected", () => {
        const wrapper = mountBtn();
        expect(wrapper.find(".v-btn").classes()).not.toContain("v-btn--loading");
    });

    it("shows the loading state when the injected form is busy", () => {
        const store = useFormStore();
        store.addForm("create-user");
        store.changeBusy("create-user", true);

        const wrapper = mountBtn({
            global: { plugins: [vuetify, pinia], provide: { formId: ref("create-user") } }
        });

        expect(wrapper.find(".v-btn").classes()).toContain("v-btn--loading");
    });

    it("renders a submit-type button", () => {
        const wrapper = mountBtn();
        expect(wrapper.find("button").attributes("type")).toBe("submit");
    });
});
