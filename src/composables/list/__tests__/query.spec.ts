import { describe, expect, it } from "vitest";
import { buildListQuery } from "../query";

describe("buildListQuery", () => {
    it("keeps 0 and false, which objectToQueryString would blank out", () => {
        const query = decodeURIComponent(buildListQuery({ status: 0, active: false, page: 1 }));
        expect(query).toContain("status=0");
        expect(query).toContain("active=false");
        expect(query).toContain("page=1");
    });

    it("keeps falsy values nested in arrays and objects", () => {
        const query = decodeURIComponent(buildListQuery({ ids: [0, 1], range: { min: 0 } }));
        expect(query).toContain("ids[0]=0");
        expect(query).toContain("range[min]=0");
    });

    it("sends Date filters as ISO strings instead of dropping them", () => {
        const date = new Date("2024-01-15T10:00:00.000Z");
        const query = decodeURIComponent(buildListQuery({ from: date, range: { to: date } }));
        expect(query).toContain("from=2024-01-15T10:00:00.000Z");
        expect(query).toContain("range[to]=2024-01-15T10:00:00.000Z");
    });

    it("sends an invalid Date as blank instead of throwing", () => {
        expect(buildListQuery({ from: new Date("nope") })).toBe("from=");
    });

    it("still sends empty and missing values as blank", () => {
        expect(buildListQuery({ search: undefined, name: "" })).toBe("search=&name=");
    });
});
