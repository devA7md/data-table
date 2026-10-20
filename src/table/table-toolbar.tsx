import type { RowData } from "@tanstack/react-table";

import { ColumnView } from "./column-view";
import type { TableToolbarProps } from "./table.types";
import { TableFilter } from "./table-filter";
import { TableToolbarSearch } from "./table-toolbar-search";

export function TableToolbar<TData extends RowData>({
  searchPlaceholder,
  showColumnView = true,
  showSearch = true,
  renderFilter,
  hasActiveFilters,
  children,
  table,
  debounceMs = 300,
}: TableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 w-full sm:max-w-sm">
        {showSearch && (
          <TableToolbarSearch
            table={table}
            placeholder={searchPlaceholder}
            debounceMs={debounceMs}
            className="flex-1"
          />
        )}
        {renderFilter && (
          <TableFilter table={table} renderFilter={renderFilter} hasActiveFilters={hasActiveFilters} />
        )}
        {children}
      </div>

      {showColumnView && <ColumnView<TData> table={table} />}
    </div>
  );
}
