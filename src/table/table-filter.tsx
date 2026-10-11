import type { RowData, Table } from "@tanstack/react-table";
import { FilterIcon } from "lucide-react";
import { useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { TableFilterRenderer } from "./table.types";

type TableFilterProps<TData extends RowData> = {
  table: Table<TData>;
  renderFilter: TableFilterRenderer<TData>;
};

export function TableFilter<TData extends RowData>({
  table,
  renderFilter,
}: TableFilterProps<TData>) {
  const [open, setOpen] = useState(false);

  const hasFilters = table.getState().columnFilters.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="relative cursor-pointer">
        <FilterIcon className="size-4" />

        {hasFilters && (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 size-2 rounded-full bg-primary"
          />
        )}
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4" align="start">
        {renderFilter(table, {
          close: () => setOpen(false),
        })}
      </PopoverContent>
    </Popover>
  );
}
