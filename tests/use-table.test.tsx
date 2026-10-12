import "@vitest/browser/matchers";

import type { ColumnDef } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";

import { type DataTableFeatures, useTable } from "@/table";

interface User {
  id: string;
  name: string;
}

const data: User[] = [
  { id: "1", name: "Zara" },
  { id: "2", name: "Alex" },
  { id: "3", name: "Maya" },
];

const columns: ColumnDef<DataTableFeatures, User, unknown>[] = [
  { accessorKey: "name", header: "Name" },
];

describe("useTable", () => {
  it("paginates the row model with the default page size", async () => {
    const manyRows = Array.from({ length: 25 }, (_, i) => ({ id: `${i}`, name: `User ${i}` }));
    const { result } = await renderHook(() =>
      useTable<User, unknown>({
        columns,
        data: manyRows,
        initialState: { pagination: { pageSize: 10 } },
      }),
    );

    expect(result.current.table.getRowModel().rows).toHaveLength(10);
    expect(result.current.table.getPageCount()).toBe(3);
    expect(result.current.pagination.pageIndex).toBe(0);
  });

  it("sorts rows ascending and descending", async () => {
    const { result } = await renderHook(() => useTable<User, unknown>({ columns, data }));

    result.current.table.getColumn("name")?.toggleSorting(false);
    await expect
      .poll(() => result.current.table.getRowModel().rows.map((r) => r.original.name))
      .toEqual(["Alex", "Maya", "Zara"]);

    result.current.table.getColumn("name")?.toggleSorting(true);
    await expect
      .poll(() => result.current.table.getRowModel().rows.map((r) => r.original.name))
      .toEqual(["Zara", "Maya", "Alex"]);
  });

  it("filters rows with the global filter", async () => {
    const { result } = await renderHook(() => useTable<User, unknown>({ columns, data }));

    result.current.table.setGlobalFilter("alex");

    await expect.poll(() => result.current.table.getRowModel().rows).toHaveLength(1);
    expect(result.current.table.getRowModel().rows[0].original.name).toBe("Alex");
  });

  it("tracks row selection state", async () => {
    const { result } = await renderHook(() => useTable<User, unknown>({ columns, data }));

    result.current.table.getRowModel().rows[0].toggleSelected(true);

    await expect.poll(() => result.current.table.getSelectedRowModel().rows).toHaveLength(1);
    await expect.poll(() => result.current.rowSelection).toEqual({ "0": true });
  });

  it("falls back to an empty dataset when data is undefined", async () => {
    const { result } = await renderHook(() =>
      useTable<User, unknown>({ columns, data: undefined }),
    );

    expect(result.current.table.getRowModel().rows).toHaveLength(0);
  });
});
