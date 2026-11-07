import { describe, expect, it, vi } from "vitest";
import { createApp } from "vue";
import VqVuetify, * as lib from "../index";

describe("public entry", () => {
    it("exports the documented components and helpers", () => {
        for (const name of [
            "VqForm",
            "VqDataTable",
            "VqDatatableItemAction",
            "VqMessageQueue",
            "VqList",
            "useVqForm",
            "useVqDataTable",
            "useVqList",
            "useMessageInstance",
            "useFormFilterRepository",
            "useVqListControls",
            "collectVqHeaders",
            "setVqLocale"
        ]) {
            expect(lib).toHaveProperty(name);
        }
    });

    it("registers components only (not composables or helpers) on install", () => {
        const app = createApp({});
        const component = vi.spyOn(app, "component");

        app.use(VqVuetify);

        const registered = component.mock.calls.map(([name]) => name);
        expect(registered).toContain("VqForm");
        expect(registered).toContain("VqMessageQueue");
        expect(registered).not.toContain("useVqForm");
        expect(registered).not.toContain("collectVqHeaders");
    });

    it("leaves an app's own global VqDatatableItemAction in place, in either order", () => {
        const own = { render: () => null };

        const before = createApp({});
        before.component("VqDatatableItemAction", own);
        before.use(VqVuetify);
        expect(before.component("VqDatatableItemAction")).toBe(own);

        const after = createApp({});
        after.use(VqVuetify);
        expect(after.component("VqDatatableItemAction")).toBeUndefined();
    });
});
