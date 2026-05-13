import { defineComponent, h, type VNode } from "vue";
import {
    VqDataTable,
    type ExtractComponentProps as DataTableExtract
} from "../components/Vuetify/VqDataTable";
import { VqList, type ExtractComponentProps as ListExtract } from "../components/Vuetify/VqList/VqList";

/**
 * Shape of a `defineVqApi` schema: each key is the literal `action` string
 * the table or list will hit; each value is the row type that endpoint
 * returns.
 *
 * ```ts
 * type Api = {
 *   'users.list': User
 *   'posts.list': Post
 * }
 * ```
 */
export type VqApiSchema = Record<string, unknown>;

interface DataTableSlotProps<T> {
    item: T;
    index: number;
}

interface ListSlotProps<T> {
    items: T[];
    loadMore: () => void;
    finished: boolean;
    loading: boolean;
}

/**
 * Type-safe factory for table / list components. Bind your API schema once
 * at app startup, then mint per-endpoint components with the `action` prop
 * pre-bound and the row type flowing into slot props.
 *
 * ```ts
 * interface User { id: string; name: string; email: string }
 * interface Post { id: string; title: string }
 *
 * type Api = {
 *   'users.list': User
 *   'posts.list': Post
 * }
 *
 * const api = defineVqApi<Api>()
 *
 * const UsersTable = api.useDataTable('users.list')
 * const PostsList  = api.useList('posts.list')
 * ```
 *
 * `UsersTable`'s `item` slot prop is typed as `User`. Passing
 * `api.useDataTable('does.not.exist')` is a TypeScript error.
 */
export const defineVqApi = <Schema extends VqApiSchema>() => {
    /**
     * Mint a typed `<VqDataTable>` for one schema entry. The `action` prop is
     * pre-bound (and removed from the wrapper's props); the `item` slot is
     * typed as `Schema[K]`.
     */
    const useDataTable = <K extends Extract<keyof Schema, string>>(action: K) => {
        type Row = Schema[K];
        type Props = Omit<DataTableExtract<typeof VqDataTable>, "action">;
        const wrapper = defineComponent((props: Props, { slots }) => {
            return () => h(VqDataTable, { ...props, action } as never, slots);
        });
        return wrapper as typeof wrapper & {
            new (): {
                $slots: {
                    item: (arg: DataTableSlotProps<Row>) => VNode[];
                };
            };
        };
    };

    /**
     * Mint a typed `<VqList>` for one schema entry. The `action` prop is
     * pre-bound; the default slot's `items` array is typed as `Schema[K][]`.
     */
    const useList = <K extends Extract<keyof Schema, string>>(action: K) => {
        type Row = Schema[K];
        type Props = Omit<ListExtract<typeof VqList>, "action">;
        const wrapper = defineComponent((props: Props, { slots }) => {
            return () => h(VqList, { ...props, action } as never, slots);
        });
        return wrapper as typeof wrapper & {
            new (): {
                $slots: {
                    default: (arg: ListSlotProps<Row>) => VNode[];
                };
            };
        };
    };

    return { useDataTable, useList };
};
