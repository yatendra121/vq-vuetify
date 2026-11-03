import { objectToQueryString } from "@qnx/composables";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    !!value && Object.getPrototypeOf(value) === Object.prototype;

// objectToQueryString serializes every falsy value as empty, so `status: 0` or
// `active: false` would reach the server as `status=` / `active=`.
const keepFalsyPrimitives = (value: unknown): unknown => {
    if (value === 0 || value === false) return String(value);
    if (Array.isArray(value)) return value.map(keepFalsyPrimitives);
    if (isPlainObject(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([key, val]) => [key, keepFalsyPrimitives(val)])
        );
    }
    return value;
};

/**
 * Internal — builds the query string VqList / VqDataTable send.
 */
export const buildListQuery = (params: Record<string, unknown>) =>
    objectToQueryString(keepFalsyPrimitives(params), "");
