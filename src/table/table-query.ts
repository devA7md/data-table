import type { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

export interface TableQueryParams {
  page: number;
  pageSize: number;
  sort?: { field: string; direction: "asc" | "desc" };
  search: string;
  filters: Array<{ id: string; value: unknown }>;
}

export interface TableQueryState {
  pagination: PaginationState;
  sorting: SortingState;
  globalFilter: string;
  columnFilters: ColumnFiltersState;
}

export function getTableQueryParams({
  pagination,
  sorting,
  globalFilter,
  columnFilters,
}: TableQueryState): TableQueryParams {
  return {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sort: sorting[0]
      ? { field: sorting[0].id, direction: sorting[0].desc ? "desc" : "asc" }
      : undefined,
    search: globalFilter,
    filters: columnFilters,
  };
}
