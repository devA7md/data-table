import { flexRender, type Table } from "@tanstack/react-table";
import { FoldHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { getTableTranslator } from "./localization";

interface ColumnViewProps<TData> {
  table: Table<TData>;
}

export function ColumnView<TData>({ table }: ColumnViewProps<TData>) {
  const t = getTableTranslator(table);

  // Resolve each column's header (what the table header shows) so labels here
  // match — including localized headers defined by the consumer.
  const headersByColumnId = new Map(
    table.getFlatHeaders().map((header) => [header.column.id, header]),
  );

  const renderColumnLabel = (columnId: string) => {
    const header = headersByColumnId.get(columnId);
    if (!header) return columnId;
    return flexRender(header.column.columnDef.header ?? header.column.id, header.getContext());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" className="hidden h-8 sm:flex sm:gap-2" />}
      >
        <FoldHorizontalIcon size="14" />
        {t("columns")}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("toggle_columns")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={column.toggleVisibility}
                  className="cursor-pointer hover:bg-primary/10"
                >
                  {renderColumnLabel(column.id)}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
