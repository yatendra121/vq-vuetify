import { objectToQueryString } from "@qnx/composables";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    !!value && Object.getPrototypeOf(value) === Object.prototype;

// @qnx/composables up to 0.8.1 serializes every falsy value as empty, so `status: 0`
// or `active: false` would reach the server as `status=` / `active=`, and drops Dates
// entirely, which is what a VqDatePicker filter holds by default.
const normalizeValues = (value: unknown): unknown => {
    if (value === 0 || value === false) return String(value);
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? "" : value.toISOString();
    }
    if (Array.isArray(value)) return value.map(normalizeValues);
    if (isPlainObject(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([key, val]) => [key, normalizeValues(val)])
        );
    }
    return value;
};

/**
 * Internal — builds the query string VqList / VqDataTable send.
 */
export const buildListQuery = (params: Record<string, unknown>) =>
    objectToQueryString(normalizeValues(params) as Record<string, unknown>, "");
