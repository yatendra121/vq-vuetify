import { mount, flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import { createPinia, setActivePinia, type Pinia } from "pinia";

// These SFCs use a plain (untyped) <script>, so vue-tsc types the default
// export as implicit `any`; there's no `*.vue` shim in this project (it is
// intentionally commented out in env.d.ts). Suppress the import-level TS7016.
// @ts-ignore -- untyped .vue SFC default import
import VSnackbarQueue from "../VSnackbarQueue.vue";
// @ts-ignore -- untyped .vue SFC default import
import MessageQueue from "../MessageQueue.vue";
import { useMessageStore } from "../../../store/reactivity/message";

// VSnackbarQueue renders one VSnackbar per queued message, showing only the
// head of the queue (model-value === first item). MessageQueue is the thin
// store binding that feeds it the message store's items and wires the remove
// action back to removeMessage. Snackbar content teleports to document.body.
describe("VSnackbarQueue + MessageQueue", () => {
    // These are .vue SFCs that reference kebab-case <v-snackbar>/<v-btn> in
    // their templates, so the Vuetify components must be globally registered
    // (the TSX components import them directly and don't need this).
    const vuetify = createVuetify({ components });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    describe("VSnackbarQueue", () => {
        const mountQueue = (items: unknown[]) =>
            mount(VSnackbarQueue, {
                props: { items },
                global: { plugins: [vuetify] }
            });

        it("shows the message of the active (first) item", async () => {
            mountQueue([{ id: 1, message: "Saved!", color: "success" }]);
            await flushPromises();
            expect(document.body.textContent).toContain("Saved!");
        });

        it("labels the action 'Close' for a single item", async () => {
            mountQueue([{ id: 1, message: "only", color: "success" }]);
            await flushPromises();
            expect(document.body.textContent).toContain("Close");
        });

        it("labels the action 'Next(n-1)' when more remain in the queue", async () => {
            mountQueue([
                { id: 1, message: "first", color: "success" },
                { id: 2, message: "second", color: "error" }
            ]);
            await flushPromises();
            expect(document.body.textContent).toContain("Next(1)");
        });

        it("emits `remove` with the item id when the action is clicked", async () => {
            const wrapper = mountQueue([{ id: 42, message: "bye", color: "success" }]);
            await flushPromises();

            const btn = Array.from(
                document.body.querySelectorAll<HTMLElement>(".v-btn")
            ).find((b) => /Close|Next/.test(b.textContent ?? ""));
            expect(btn).toBeTruthy();

            btn!.click();
            await flushPromises();

            expect(wrapper.emitted("remove")?.[0]).toEqual([42]);
        });
    });

    describe("MessageQueue", () => {
        let pinia: Pinia;

        beforeEach(() => {
            pinia = createPinia();
            setActivePinia(pinia);
        });

        it("renders a message pushed onto the store", async () => {
            mount(MessageQueue, { global: { plugins: [vuetify, pinia] } });
            const store = useMessageStore();
            store.addMessage({ message: "Hello there", color: "success" });
            await flushPromises();

            expect(document.body.textContent).toContain("Hello there");
        });

        it("removes the message from the store when the action is clicked", async () => {
            mount(MessageQueue, { global: { plugins: [vuetify, pinia] } });
            const store = useMessageStore();
            store.addMessage({ message: "dismiss me", color: "success" });
            await flushPromises();

            const btn = Array.from(
                document.body.querySelectorAll<HTMLElement>(".v-btn")
            ).find((b) => /Close|Next/.test(b.textContent ?? ""));
            expect(btn).toBeTruthy();

            btn!.click();
            await flushPromises();

            expect(store.items).toHaveLength(0);
        });
    });
});
