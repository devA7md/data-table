import { useMemo } from "react";

import { DataTablePagination, Table, TableToolbar } from "@/table";

import type { User } from "../data/users";
import { type Lang, useTranslator } from "../lib/i18n";
import {
  createRoleFilterRenderer,
  createSelectedRowActions,
  createUserColumns,
  createUserRowActions,
} from "../lib/user-table";

/**
 * The Table component owns the table instance: it creates it internally from
 * `data` + `columns` and all the useTable options (t, manualX, initialState...).
 */
export function InternalTableExample({ lang, data }: { lang: Lang; data: User[] }) {
  const t = useTranslator(lang);
  const columns = useMemo(() => createUserColumns(lang), [lang]);
  const rowActions = useMemo(() => createUserRowActions(lang), [lang]);
  const renderRoleFilter = useMemo(() => createRoleFilterRenderer(lang), [lang]);
  const renderSelectedRowActions = useMemo(() => createSelectedRowActions(lang), [lang]);

  return (
    <Table<User, unknown>
      columns={columns}
      data={data}
      t={t}
      rowActions={rowActions}
      contextMenu={rowActions}
      enableRowSelection
      onRowClick={(row) => console.log("row click", row.original)}
      // Predefined filter applied on load — excluded from the indicator below.
      initialState={{ columnFilters: [{ id: "status", value: "active" }] }}
      renderToolbar={(table) => (
        <TableToolbar
          table={table}
          renderFilter={renderRoleFilter}
          // Only user-applied role filters mark the filter as active,
          // the predefined status filter does not.
          hasActiveFilters={table.state.columnFilters.some((f) => f.id === "role")}
          columnViewTriggerClassName="bg-primary/10 p-3 rounded-xssm"
        />
      )}
      renderSelectedRowActions={renderSelectedRowActions}
      renderFooter={(table) => <DataTablePagination table={table} />}
      classNames={{
        root: "h-100",
        table: "overflow-hidden rounded-2xl bg-primary/5",
      }}
      size="dense"
    />
  );
}
