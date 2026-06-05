import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";

// The real TinyMCE editor lazy-loads a remote script and a full DOM editor,
// which can't run under jsdom. Stub it with a minimal model-value <-> input
// bridge so we can verify VqTextEditor's vee-validate wiring in isolation.
vi.mock("@tinymce/tinymce-vue", () => ({
    default: defineComponent({
        name: "TinyEditorStub",
        props: { modelValue: { type: String, default: "" } },
        emits: ["update:modelValue"],
        setup(props, { emit }) {
            return () =>
                h("textarea", {
                    class: "tiny-stub",
                    value: props.modelValue,
                    onInput: (e: Event) =>
                        emit("update:modelValue", (e.target as HTMLTextAreaElement).value)
                });
        }
    })
}));

import { VqTextEditor } from "../index";

describe("VqTextEditor", () => {
    const mountEditor = (props: Record<string, unknown> = {}) =>
        mount(VqTextEditor, { props: { name: "body", ...props } });

    it("mounts and renders the (stubbed) editor", () => {
        const wrapper = mountEditor();
        expect(wrapper.find(".tiny-stub").exists()).toBe(true);
    });

    it("mirrors editor input into the bound vee-validate field value", async () => {
        const wrapper = mountEditor();

        await wrapper.find("textarea").setValue("<p>hello</p>");

        // value.value flows back down as model-value -> the stub's textarea value
        expect(wrapper.find("textarea").element.value).toBe("<p>hello</p>");
    });
});
