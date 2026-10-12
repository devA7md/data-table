import type { ColumnDef, RowData } from "@tanstack/react-table";

import type { RowAction } from "./table.types";
import type { DataTableFeatures } from "./table-features";
import { TableRowActions } from "./table-row-actions";

/**
 * Builds the trailing "actions" column rendered by `TableRowActions`.
 *
 * When `Table` builds the table internally it appends this automatically from
 * its `rowActions` prop. When a pre-built table is passed via the `table` prop,
 * append it to your own column defs instead:
 *
 * @example
 * const columns = useMemo(
 *   () => [...createUserColumns(), createActionsColumn(rowActions)],
 *   [rowActions],
 * );
 * const { table } = useTable({ columns, data });
 */
export function createActionsColumn<TData extends RowData>(
  actions: RowAction<TData>[] | ((row: TData) => RowAction<TData>[]),
): ColumnDef<DataTableFeatures, TData, unknown> {
  return {
    id: "actions",
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ row }) => (
      <div className="text-end">
        <TableRowActions row={row} actions={actions} />
      </div>
    ),
  };
}
