import {
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type ExpandedState,
  type PaginationState,
  type RowData,
  type RowSelectionState,
  type SortingState,
  useTable as useTanStackTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import type { UseTableOptions, UseTableReturn } from "./table.types";
import { type DataTableFeatures, dataTableFeatures } from "./table-features";
import { getTableQueryParams } from "./table-query";

export function useTable<TData extends RowData, TValue>({
  columns,
  data,
  pageCount,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  initialState,
  t,
}: UseTableOptions<TData, TValue>): UseTableReturn<TData> {
  const [sorting, setSorting] = useState<SortingState>(
    initialState?.sorting ?? [{ id: "createdAt", desc: true }],
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialState?.columnFilters ?? [],
  );

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(
    initialState?.columnVisibility ?? {},
  );

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );

  const [globalFilter, setGlobalFilter] = useState<string>(initialState?.globalFilter ?? "");

  const [expanded, setExpanded] = useState<ExpandedState>({});

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialState?.pagination?.pageIndex ?? 0,
    pageSize: initialState?.pagination?.pageSize ?? 10,
  });

  const table = useTanStackTable({
    features: dataTableFeatures,
    data: data ?? [],
    columns: columns as Array<ColumnDef<DataTableFeatures, TData, unknown>>,

    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
      expanded,
    },

    pageCount,
    manualPagination,
    manualSorting,
    manualFiltering,

    meta: {
      t,
    },
  });

  const queryParams = useMemo(
    () =>
      getTableQueryParams({
        pagination,
        sorting,
        globalFilter,
        columnFilters,
      }),
    [pagination, sorting, globalFilter, columnFilters],
  );

  return {
    table,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
    queryParams,
  };
}
