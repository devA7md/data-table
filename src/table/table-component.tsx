import { flexRender, type Row } from "@tanstack/react-table";
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

import { getTableTranslator } from "./localization";
import type { TableProps } from "./table.types";
import { TableContextMenu } from "./table-context-menu";
import { TableHeaderSort } from "./table-header-sort";
import { TableRowActions } from "./table-row-actions";
import { useTable } from "./use-table";

export function Table<TData, TValue>({
  columns,
  data,
  table: externalTable,
  loading = false,
  error = null,
  rowActions,
  rowActionsPlacement = "dropdown",
  contextMenu,
  enableRowSelection = false,
  onRowClick,
  onRowDoubleClick,
  className,
  emptyMessage,
  renderToolbar,
  renderFooter,
  ...useTableOptions
}: TableProps<TData, TValue>) {
  const finalColumns = rowActions
    ? [
        ...columns,
        {
          id: "actions",
          cell: (props: { row: Row<TData> }) => {
            return (
              <div className="text-end">
                <TableRowActions row={props.row} actions={rowActions} />
              </div>
            );
          },
        },
      ]
    : columns;

  const internalTable = useTable<TData, TValue>({
    columns: finalColumns,
    data,
    ...useTableOptions,
  }).table;

  const table = externalTable ?? internalTable;
  const t = getTableTranslator(table);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {renderToolbar?.(table)}

      <div className="relative">
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

        <ShadcnTable className="w-full caption-bottom text-sm border border-border">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );

                if (!hasContextMenu) {
                  return rowElement;
                }

                return (
                  <TableContextMenu key={row.id} row={row} actions={contextMenu} onClose={() => {}}>
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

      {renderFooter?.(table)}
    </div>
  );
}
