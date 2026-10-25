import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createCoreRowModel,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from "@tanstack/react-table";

import type { TableTranslator } from "./localization";

/**
 * The feature set every data-table instance is built with.
 * Registered once, statically, and shared by all tables in the package.
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  rowExpandingFeature,

  coreRowModel: createCoreRowModel(),
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  expandedRowModel: createExpandedRowModel(),

  tableMeta: {} as { t?: TableTranslator },
});

export type DataTableFeatures = typeof dataTableFeatures;
