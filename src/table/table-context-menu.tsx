import type { RowData } from "@tanstack/react-table";
import type { ReactNode } from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

import type { TableContextMenuProps } from "./table.types";

export function TableContextMenu<TData extends RowData>({
  row,
  actions,
  onClose,
  children,
}: Omit<TableContextMenuProps<TData>, "x" | "y"> & { children: ReactNode }) {
  const finalActions = typeof actions === "function" ? actions(row.original) : actions;

  if (finalActions.every((a) => a.hidden)) {
    return <>{children}</>;
  }

  return (
    <ContextMenu onOpenChange={(open) => !open && onClose()}>
      {children}
      <ContextMenuContent>
        {finalActions.map((action, index) => (
          <div key={action.title}>
            {action.hidden ? null : (
              <>
                {action.divider && index > 0 && <ContextMenuSeparator />}
                <ContextMenuItem
                  disabled={action.disabled}
                  onClick={() => {
                    action.onClick(row);
                    onClose();
                  }}
                >
                  {action.icon && <span className="shrink-0">{action.icon}</span>}
                  <span>{action.title}</span>
                </ContextMenuItem>
              </>
            )}
          </div>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
