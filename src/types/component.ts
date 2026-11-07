/** Internal — the instance type of a component constructor, generic ones included. */
export type ComponentInstance<C> = C extends abstract new (...args: any) => infer I ? I : never;

/**
 * Internal — a template-facing component type with the given props and slots.
 * Exported components are typed as `typeof Impl & TemplateComponent<...>` when the
 * Vuetify component they wrap can't be used as-is (it requires props the wrapper
 * supplies, or promises slot props the wrapper doesn't pass).
 */
export type TemplateComponent<Props, Slots> = new () => { $props: Props; $slots: Slots };

/**
 * An HTTP method for a component's request. The common ones are suggested in the
 * editor; any other string is still accepted.
 */
// `string & {}` keeps the literals from collapsing into `string`, so editors still
// offer them as completions.
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | (string & {});
