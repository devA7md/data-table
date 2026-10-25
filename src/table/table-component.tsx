import { type ColumnDef, flexRender, type RowData } from "@tanstack/react-table";
import { cn } from "cn";
import { Fragment } from "react";

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
  manualExpanding,
  getRowCanExpand,
  getSubRows,
  paginateExpandedRows,
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
    manualExpanding,
    getRowCanExpand,
    getSubRows,
    paginateExpandedRows,
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
    root: "text-sm gap-2",
    table: "text-sm",
    head: "h-8 px-2 text-sm",
    cell: "px-2 py-0.5",
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
  renderExpandedRow,
}: TableBaseProps<TData> & { table: DataTable<TData> }) {
  const t = getTableTranslator(table);
  const selectedRows = table.getSelectedRowModel().rows;
  const density = sizeClasses[size];

  return (
    <div
      className={cn(
        "*:data-[slot=table-container]:min-h-0",
        "*:data-[slot=table-container]:h-full",
        "flex h-full min-h-0 flex-col gap-4",
        density.root,
        classNames?.root,
      )}
    >
      {(renderSelectedRowActions || renderToolbar) && (
        <div className="flex h-10 shrink-0 items-center [&>*:first-child]:w-full">
          {renderSelectedRowActions && selectedRows.length > 0 ? (
            <div className="flex w-full items-center justify-between">
              <span className="font-medium">
                {t("selected_count", { count: selectedRows.length })}
              </span>

              <div className="flex items-center gap-2">
                {renderSelectedRowActions({
                  selectedRowIds: selectedRows.map((row) => row.original),
                  clearSelection: () => table.resetRowSelection(),
                })}
              </div>
            </div>
          ) : (
            renderToolbar?.(table)
          )}
        </div>
      )}

      <ShadcnTable
        className={cn("border border-border caption-bottom", density.table, classNames?.table)}
      >
        {loading && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 overflow-hidden bg-muted">
            <div
              className="h-full w-1/2 bg-primary"
              style={{
                animation: "table-loading-slide 1.5s ease-in-out infinite",
              }}
            />

            <style>{`
            @keyframes table-loading-slide {
              0% {
                transform: translateX(-100%);
              }

              100% {
                transform: translateX(200%);
              }
            }
          `}</style>
          </div>
        )}
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
                className="text-center text-destructive"
              >
                {error}
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => {
              const finalContextMenuActions =
                typeof contextMenu === "function" ? contextMenu(row.original) : contextMenu;

              const hasContextMenu =
                !!contextMenu &&
                !!finalContextMenuActions &&
                !finalContextMenuActions.every((action) => action.hidden);

              const rowElement = (
                <TableRow
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

              return (
                <Fragment key={row.id}>
                  {hasContextMenu ? (
                    <TableContextMenu row={row} actions={contextMenu} onClose={() => {}}>
                      <ContextMenuTrigger render={rowElement}>
                        {rowElement.props.children}
                      </ContextMenuTrigger>
                    </TableContextMenu>
                  ) : (
                    rowElement
                  )}

                  {row.getIsExpanded() && renderExpandedRow && (
                    <TableRow>
                      <TableCell
                        colSpan={Math.max(1, row.getVisibleCells().length)}
                        className={cn("p-0", density.cell)}
                      >
                        {renderExpandedRow(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className="h-14 text-center"
              >
                {emptyMessage ?? t("no_results")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ShadcnTable>

      {renderFooter?.(table)}
    </div>
  );
}
