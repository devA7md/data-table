import type { RowData } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import type { DataTableRow, RowAction } from "./table.types";

export function TableRowActions<TData extends RowData>({
  row,
  actions,
}: {
  row: DataTableRow<TData>;
  actions: RowAction<TData>[] | ((row: TData) => RowAction<TData>[]);
}) {
  const finalActions = typeof actions === "function" ? actions(row.original) : actions;

  if (finalActions.every((a) => a.hidden)) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <div className="h-8 w-8 p-0 border border-border rounded-full flex items-center justify-center hover:bg-primary/5" />
        }
      >
        <span className="sr-only">Open menu</span>
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {finalActions.map((action) => {
          const item = (
            <DropdownMenuItem
              key={action.title}
              disabled={action.disabled}
              onClick={() => action.onClick(row)}
            >
              {action.icon}
              {action.title}
            </DropdownMenuItem>
          );

          // Base UI tooltips need a non-disabled trigger, so wrap the disabled
          // item in a plain span that can receive pointer events.
          if (action.disabled && action.disabledTooltip) {
            return (
              <Tooltip key={action.title}>
                <TooltipTrigger render={<span className="block" />}>{item}</TooltipTrigger>
                <TooltipContent>{action.disabledTooltip}</TooltipContent>
              </Tooltip>
            );
          }

          return item;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
