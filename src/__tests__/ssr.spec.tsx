// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { createVuetify } from "vuetify";
import { createPinia } from "pinia";

vi.mock("@qnx/composables/axios", () => ({
    useAsyncAxios: vi.fn(),
    useErrorResponse: vi.fn()
}));

import { useAsyncAxios } from "@qnx/composables/axios";
import {
    VqAutocomplete,
    VqCheckbox,
    VqColorPicker,
    VqDataTable,
    VqDatePicker,
    VqFileInput,
    VqForm,
    VqList,
    VqMessageQueue,
    VqOtpInput,
    VqSubmitBtn,
    VqTableFilter,
    VqTextField,
    VqTextarea,
    VqTimePicker
} from "../index";
import { useMessageStore } from "../store/reactivity/message";

const render = (component: () => unknown, pinia = createPinia()) => {
    const app = createSSRApp({ render: component as () => never });
    app.use(createVuetify({ ssr: true })).use(pinia);
    return renderToString(app);
};

describe("server-side rendering", () => {
    beforeEach(() => {
        vi.mocked(useAsyncAxios).mockReset();
        vi.mocked(useAsyncAxios).mockResolvedValue({ data: { data: [], total: 0 } } as never);
    });

    it("renders a form with every field wrapper", async () => {
        const html = await render(() =>
            h(
                VqForm,
                { id: "f", action: "x", initialValues: { email: "a@b.c" } },
                {
                    default: () => [
                        h(VqTextField, { name: "email" }),
                        h(VqTextarea, { name: "bio" }),
                        h(VqCheckbox, { name: "ok" }),
                        h(VqAutocomplete, { name: "city", action: "cities" }),
                        h(VqDatePicker, { name: "date" }),
                        h(VqTimePicker, { name: "time" }),
                        h(VqColorPicker, { name: "color" }),
                        h(VqOtpInput, { name: "otp" }),
                        h(VqFileInput, { name: "file" }),
                        h(VqSubmitBtn)
                    ]
                }
            )
        );

        expect(html).toContain('id="f"');
        expect(html).toContain("a@b.c");
        expect(html).toContain("Submit");
    });

    it("renders lists and tables without fetching on the server", async () => {
        const html = await render(() => [
            h(VqTableFilter, { id: "t" }, { default: () => h(VqTextField, { name: "search" }) }),
            h(VqDataTable, { id: "t", action: "users" }),
            h(VqList, { id: "l", action: "posts" }, { default: () => "list body" })
        ]);

        expect(html).toContain("t_filter");
        expect(html).toContain("list body");
    });

    it("does not leak messages between requests", async () => {
        const first = createPinia();
        const app = createSSRApp({ render: () => h("div") });
        app.use(first);
        useMessageStore(first).addMessage({ message: "secret", color: "success" });

        const html = await render(() => h(VqMessageQueue));

        expect(html).not.toContain("secret");
    });
});
