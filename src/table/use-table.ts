import {
  type ColumnFiltersState,
  type ExpandedState,
  functionalUpdate,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowData,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import type { UseTableOptions, UseTableReturn } from "./table.types";
import { getTableQueryParams } from "./table-query";

export function useTable<TData extends RowData, TValue>({
  columns,
  data,
  pageCount,
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  initialState,
  transformQueryParams,
}: UseTableOptions<TData, TValue>): UseTableReturn<TData> {
  const [sorting, setSorting] = useState<SortingState>(
    initialState?.sorting ?? [
      {
        id: "createdAt",
        desc: true,
      },
    ],
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialState?.columnFilters ?? [],
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState?.columnVisibility ?? {},
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    initialState?.rowSelection ?? {},
  );
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialState?.pagination?.pageIndex ?? 0,
    pageSize: initialState?.pagination?.pageSize ?? 10,
  });

  const table = useReactTable<TData>({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (updater) => {
      const newSort = functionalUpdate(updater, sorting);
      setSorting(newSort);
    },
    onPaginationChange: (updater) => {
      const newPagination = functionalUpdate(updater, pagination);
      setPagination(newPagination);
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = functionalUpdate(updater, columnFilters);
      setColumnFilters(newFilters);
    },
    onColumnVisibilityChange: (updater) => {
      const newColumnsVisibility = functionalUpdate(updater, columnVisibility);
      setColumnVisibility(newColumnsVisibility);
    },
    onRowSelectionChange: (updater) => {
      const newSelection = functionalUpdate(updater, rowSelection);
      setRowSelection(newSelection);
    },
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
  });

  const queryParams = useMemo(() => {
    const raw = getTableQueryParams({
      pagination,
      sorting,
      globalFilter,
      columnFilters,
    });
    return (transformQueryParams ? transformQueryParams(raw) : raw) as Record<string, string>;
  }, [columnFilters, globalFilter, pagination, sorting, transformQueryParams]);

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
