import { describe, expect, it } from "vitest";

import { getTableQueryParams } from "@/table/table-query";

describe("getTableQueryParams", () => {
  it("maps pagination to a 1-based page", () => {
    const params = getTableQueryParams({
      pagination: { pageIndex: 2, pageSize: 20 },
      sorting: [],
      globalFilter: "",
      columnFilters: [],
    });

    expect(params.page).toBe(3);
    expect(params.pageSize).toBe(20);
    expect(params.sort).toBeUndefined();
    expect(params.search).toBe("");
    expect(params.filters).toEqual([]);
  });

  it("maps the first sorting entry to a sort field and direction", () => {
    const params = getTableQueryParams({
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [
        { id: "name", desc: false },
        { id: "createdAt", desc: true },
      ],
      globalFilter: "ava",
      columnFilters: [{ id: "role", value: "admin" }],
    });

    expect(params.sort).toEqual({ field: "name", direction: "asc" });
    expect(params.search).toBe("ava");
    expect(params.filters).toEqual([{ id: "role", value: "admin" }]);
  });

  it("maps a descending sort correctly", () => {
    const params = getTableQueryParams({
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "createdAt", desc: true }],
      globalFilter: "",
      columnFilters: [],
    });

    expect(params.sort).toEqual({ field: "createdAt", direction: "desc" });
  });
});
