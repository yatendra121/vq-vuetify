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
        expect(registered).toContain("VqDatatableItemAction");
        expect(registered).toContain("VqMessageQueue");
        expect(registered).not.toContain("useVqForm");
        expect(registered).not.toContain("collectVqHeaders");
    });
});
