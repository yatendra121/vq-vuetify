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

    it("joins baseUrl and filesPath with exactly one slash", () => {
        const script = (props: Record<string, unknown>) =>
            mountEditor(props).find("textarea").attributes("tinymce-script-src");

        expect(script({ baseUrl: "/tinymce", filesPath: "tinymce.min.js" })).toBe(
            "/tinymce/tinymce.min.js"
        );
        expect(script({ baseUrl: "/tinymce/", filesPath: "/tinymce.min.js" })).toBe(
            "/tinymce/tinymce.min.js"
        );
    });

    it("keeps filesPath relative when baseUrl is empty", () => {
        const wrapper = mountEditor({ baseUrl: "", filesPath: "static/tinymce.min.js" });
        expect(wrapper.find("textarea").attributes("tinymce-script-src")).toBe(
            "static/tinymce.min.js"
        );
    });

    it("renders the label prop", () => {
        expect(mountEditor({ label: "Body" }).find("label").text()).toBe("Body");
        expect(mountEditor().find("label").exists()).toBe(false);
    });

    it("does not render an empty error paragraph", () => {
        expect(mountEditor().find("p").exists()).toBe(false);
    });

    it("forwards extra attrs to the editor", () => {
        const wrapper = mount(VqTextEditor, {
            props: { name: "body" },
            attrs: { "data-testid": "editor" }
        });
        expect(wrapper.find("textarea").attributes("data-testid")).toBe("editor");
    });
});
