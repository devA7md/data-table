import { useMemo } from "react";

import { DataTablePagination, Table, TableToolbar } from "@/table";

import type { User } from "../data/users";
import { type Lang, useTranslator } from "../lib/i18n";
import {
  createRoleFilterRenderer,
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

  return (
    <Table<User, unknown>
      columns={columns}
      data={data}
      t={t}
      rowActions={rowActions}
      contextMenu={rowActions}
      enableRowSelection
      onRowClick={(row) => console.log("row click", row.original)}
      renderToolbar={(table) => <TableToolbar table={table} renderFilter={renderRoleFilter} />}
      renderFooter={(table) => <DataTablePagination table={table} />}
      classNames={{
        wrapper: "overflow-hidden rounded-2xl bg-primary/5",
      }}
    />
  );
}
