import type { Row } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { RowAction } from "./table.types";

export function TableRowActions<TData>({
  row,
  actions,
}: {
  row: Row<TData>;
  actions: RowAction<TData>[] | ((row: TData) => RowAction<TData>[]);
}) {
  const finalActions = typeof actions === "function" ? actions(row.original) : actions;

  if (finalActions.every((a) => a.hidden)) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
        <span className="sr-only">Open menu</span>
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {finalActions.map((action) => (
          <DropdownMenuItem
            key={action.title}
            disabled={action.disabled}
            onClick={() => action.onClick(row)}
          >
            {action.icon}
            {action.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
