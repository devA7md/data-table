import { type ColumnDef, flexRender, type RowData } from "@tanstack/react-table";
import { cn } from "cn";

import { ContextMenuTrigger } from "@/components/ui/context-menu";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createActionsColumn } from "./actions-column";
import { getTableTranslator } from "./localization";
import type {
  DataTable,
  ExternalTableProps,
  InternalTableProps,
  TableBaseProps,
  TableProps,
  TableSize,
} from "./table.types";
import { TableContextMenu } from "./table-context-menu";
import type { DataTableFeatures } from "./table-features";
import { TableHeaderSort } from "./table-header-sort";
import { useTable } from "./use-table";

export function Table<TData extends RowData, TValue>(props: TableProps<TData, TValue>) {
  return props.table ? (
    <TableWithExternalTable {...props} />
  ) : (
    <TableWithInternalTable {...props} />
  );
}

function TableWithExternalTable<TData extends RowData, TValue>({
  table,
  ...props
}: ExternalTableProps<TData, TValue>) {
  return <TableContent table={table} {...props} />;
}

function TableWithInternalTable<TData extends RowData, TValue>({
  columns,
  data,
  rowActions,
  pageCount,
  manualPagination,
  manualSorting,
  manualFiltering,
  initialState,
  t,
  ...props
}: InternalTableProps<TData, TValue>) {
  const finalColumns = (
    rowActions ? [...columns, createActionsColumn(rowActions)] : columns
  ) as Array<ColumnDef<DataTableFeatures, TData, unknown>>;

  const { table } = useTable<TData, unknown>({
    columns: finalColumns,
    data,
    pageCount,
    manualPagination,
    manualSorting,
    manualFiltering,
    initialState,
    t,
  });

  return <TableContent table={table} {...props} />;
}

const sizeClasses: Record<
  TableSize,
  { root?: string; table?: string; head?: string; cell?: string }
> = {
  dense: {
    root: "text-xs gap-2",
    table: "text-xs",
    head: "h-8 px-2 text-xs",
    cell: "px-2 py-0",
  },
  normal: {},
  large: {
    root: "text-base gap-2",
    table: "text-base",
    head: "h-14 px-4 text-base",
    cell: "p-4",
  },
};

function TableContent<TData extends RowData>({
  table,
  loading = false,
  error = null,
  contextMenu,
  onRowClick,
  onRowDoubleClick,
  classNames,
  emptyMessage,
  size = "normal",
  renderToolbar,
  renderSelectedRowActions,
  renderFooter,
}: TableBaseProps<TData> & { table: DataTable<TData> }) {
  const t = getTableTranslator(table);
  const selectedRows = table.getSelectedRowModel().rows;
  const density = sizeClasses[size];

  return (
    <div className={cn("flex flex-col gap-4 min-h-0", density.root, classNames?.root)}>
      {(renderSelectedRowActions || renderToolbar) && (
        <div className="h-10 flex items-center [&>*:first-child]:w-full">
          {renderSelectedRowActions && selectedRows.length > 0 ? (
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {t("selected_count", { count: selectedRows.length })}
              </span>
              <div className="flex items-center gap-2">
                {renderSelectedRowActions({
                  selectedRowIds: selectedRows.map((r) => r.original),
                  clearSelection: () => table.resetRowSelection(),
                })}
              </div>
            </div>
          ) : (
            renderToolbar?.(table)
          )}
        </div>
      )}

      <div className="relative overflow-y-auto">
        {loading && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 overflow-hidden bg-muted">
            <div
              className="h-full w-1/2 bg-primary"
              style={{ animation: "table-loading-slide 1.5s ease-in-out infinite" }}
            />
            <style>{`
              @keyframes table-loading-slide {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
              }
            `}</style>
          </div>
        )}

        <div className={cn("border border-border", classNames?.wrapper)}>
          <ShadcnTable
            className={cn("w-full caption-bottom text-sm", density.table, classNames?.table)}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className={density.head}>
                      {header.isPlaceholder ? null : <TableHeaderSort header={header} />}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {error ? (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleLeafColumns().length}
                    className="text-destructive text-center"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  const finalContextMenuActions =
                    typeof contextMenu === "function" ? contextMenu(row.original) : contextMenu;

                  const hasContextMenu =
                    !!contextMenu &&
                    !!finalContextMenuActions &&
                    !finalContextMenuActions.every((action) => action.hidden);

                  const rowElement = (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => onRowClick?.(row)}
                      onDoubleClick={() => onRowDoubleClick?.(row)}
                      className={cn(onRowClick && "cursor-pointer")}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className={density.cell}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  );

                  if (!hasContextMenu) {
                    return rowElement;
                  }

                  return (
                    <TableContextMenu
                      key={row.id}
                      row={row}
                      actions={contextMenu}
                      onClose={() => {}}
                    >
                      <ContextMenuTrigger render={rowElement}>
                        {rowElement.props.children}
                      </ContextMenuTrigger>
                    </TableContextMenu>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleLeafColumns().length}
                    className="h-24 text-center"
                  >
                    {emptyMessage ?? t("no_results")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ShadcnTable>
        </div>
      </div>

      {renderFooter?.(table)}
    </div>
  );
}
