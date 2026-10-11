import type { Row } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { TableRow } from "@/components/ui/table";

export function TableDataRow<TData>({
  row,
  children,
  onRowClick,
  onRowDoubleClick,
}: {
  row: Row<TData>;
  children: React.ReactNode;
  onRowClick?: (row: Row<TData>) => void;
  onRowDoubleClick?: (row: Row<TData>) => void;
}) {
  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      onClick={() => onRowClick?.(row)}
      onDoubleClick={() => onRowDoubleClick?.(row)}
      className={cn(onRowClick && "cursor-pointer")}
    >
      {children}
    </TableRow>
  );
}
