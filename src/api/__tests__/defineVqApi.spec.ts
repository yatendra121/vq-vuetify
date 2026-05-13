import { describe, it, expect, expectTypeOf, vi } from "vitest";
import type { VNode } from "vue";

// Stub the heavy Vuetify components — they bring in pinia + Vuetify chrome,
// and we don't need to test their rendering here. We only need to confirm
// the typed wrapper produced by defineVqApi resolves to the underlying
// component with the bound `action`. Stub identities are inlined inside
// the factory because vi.mock is hoisted above local consts.
vi.mock("../../components/Vuetify/VqDataTable", () => ({
    VqDataTable: { name: "VqDataTable" }
}));
vi.mock("../../components/Vuetify/VqList/VqList", () => ({
    VqList: { name: "VqList" }
}));

import { VqDataTable as VqDataTableStub } from "../../components/Vuetify/VqDataTable";
import { VqList as VqListStub } from "../../components/Vuetify/VqList/VqList";
import { defineVqApi } from "..";

interface User {
    id: string;
    name: string;
    email: string;
}

interface Post {
    id: string;
    title: string;
}

type Api = {
    "users.list": User;
    "posts.list": Post;
};

const renderWrapper = (Wrapper: any, props: Record<string, unknown>) => {
    // Wrappers are functional defineComponent(setup) — the result of setup
    // is the render fn. Invoke directly so we can inspect what vnode it
    // produces, without mounting (and without Vuetify chrome).
    const render = Wrapper.setup(props, { slots: {}, attrs: {}, emit: () => {} });
    const vnode = render() as VNode;
    return vnode;
};

describe("defineVqApi", () => {
    const api = defineVqApi<Api>();

    describe("compile-time inference", () => {
        it("only accepts keys declared in the schema", () => {
            expectTypeOf(api.useDataTable).parameter(0).toEqualTypeOf<keyof Api & string>();
            expectTypeOf(api.useList).parameter(0).toEqualTypeOf<keyof Api & string>();

            // @ts-expect-error — endpoint not declared in the schema
            api.useDataTable("not.in.schema");

            // @ts-expect-error — endpoint not declared in the schema
            api.useList("posts.detail");
        });

        it("types the data-table item slot as the row type", () => {
            const UsersTable = api.useDataTable("users.list");
            type SlotArg = Parameters<
                NonNullable<InstanceType<typeof UsersTable>["$slots"]["item"]>
            >[0];
            expectTypeOf<SlotArg["item"]>().toEqualTypeOf<User>();
            expectTypeOf<SlotArg["index"]>().toEqualTypeOf<number>();
        });

        it("types the list default slot's items array as the row type", () => {
            const PostsList = api.useList("posts.list");
            type SlotArg = Parameters<
                NonNullable<InstanceType<typeof PostsList>["$slots"]["default"]>
            >[0];
            expectTypeOf<SlotArg["items"]>().toEqualTypeOf<Post[]>();
            expectTypeOf<SlotArg["loadMore"]>().toEqualTypeOf<() => void>();
            expectTypeOf<SlotArg["finished"]>().toEqualTypeOf<boolean>();
            expectTypeOf<SlotArg["loading"]>().toEqualTypeOf<boolean>();
        });

        it("removes `action` from the wrapper's props", () => {
            const UsersTable = api.useDataTable("users.list");
            type Props = InstanceType<typeof UsersTable>["$props"];
            // @ts-expect-error — action should not be in the wrapper's props
            const _check: Props["action"] = undefined;
            void _check;
        });
    });

    describe("runtime behavior", () => {
        it("data-table wrapper renders VqDataTable with the bound action", () => {
            const UsersTable = api.useDataTable("users.list");
            const vnode = renderWrapper(UsersTable, { id: "users" });

            expect(vnode.type).toBe(VqDataTableStub);
            expect((vnode.props as { action: string }).action).toBe("users.list");
            expect((vnode.props as { id: string }).id).toBe("users");
        });

        it("list wrapper renders VqList with the bound action", () => {
            const PostsList = api.useList("posts.list");
            const vnode = renderWrapper(PostsList, { id: "posts" });

            expect(vnode.type).toBe(VqListStub);
            expect((vnode.props as { action: string }).action).toBe("posts.list");
            expect((vnode.props as { id: string }).id).toBe("posts");
        });

        it("caller-provided props are forwarded along with the bound action", () => {
            const UsersTable = api.useDataTable("users.list");
            const vnode = renderWrapper(UsersTable, {
                id: "users",
                itemsPerPage: 25,
                method: "GET"
            });

            const props = vnode.props as { action: string; itemsPerPage: number; method: string };
            expect(props.action).toBe("users.list");
            expect(props.itemsPerPage).toBe(25);
            expect(props.method).toBe("GET");
        });
    });
});
