import type { ColumnDef, Row } from "@tanstack/react-table";
import { useMemo } from "react";

import { DataTablePagination, type RowAction, Table, TableToolbar } from "@/table";

import type { User } from "./data/users";
import { createUsers } from "./data/users";

const roleFilter = (row: Row<User>, _columnId: string, filterValue: unknown) => {
  if (!filterValue) return true;
  return row.original.role === filterValue;
};

export function App() {
  const data = useMemo(() => createUsers(), []);

  const rowActions = useMemo(
    (): ((row: User) => RowAction<User>[]) => (row) => [
      { title: "View profile", onClick: (r) => console.log("view", r.original) },
      { title: "Edit user", onClick: (r) => console.log("edit", r.original) },
      {
        title: "Reset password",
        onClick: (r) => console.log("reset", r.original),
        divider: true,
      },
      {
        title: "Disable user",
        onClick: (r) => console.log("disable", r.original),
        hidden: row.status === "disabled",
      },
    ],
    [],
  );

  const columns = useMemo<ColumnDef<User, unknown>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        enableSorting: false,
        enableGlobalFilter: false,
      },
      {
        accessorKey: "name",
      },
      {
        accessorKey: "email",
      },
      {
        accessorKey: "role",

        filterFn: roleFilter,
      },
      {
        accessorKey: "status",
      },
      {
        accessorKey: "createdAt",
      },
    ],
    [],
  );

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Data Table Playground</h1>
        <p className="text-muted-foreground text-sm">
          Sorting, global search, column filters, pagination, row selection, and row actions.
        </p>
      </div>

      <Table<User, unknown>
        columns={columns}
        data={data}
        rowActions={rowActions}
        contextMenu={rowActions}
        enableRowSelection
        onRowClick={(row) => console.log("row click", row.original)}
        renderToolbar={(t) => (
          <TableToolbar
            table={t}
            searchPlaceholder="Search users..."
            renderFilter={(table, { close }) => (
              <div className="flex flex-col gap-2">
                {(["admin", "editor", "viewer"] as const).map((role) => (
                  <label key={role} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="role"
                      onChange={() => {
                        table.setColumnFilters([{ id: "role", value: role }]);
                        close();
                      }}
                    />
                    {role}
                  </label>
                ))}
                <button
                  type="button"
                  className="text-sm underline"
                  onClick={() => {
                    table.resetColumnFilters();
                    close();
                  }}
                >
                  Clear filter
                </button>
              </div>
            )}
          />
        )}
        renderFooter={(t) => <DataTablePagination table={t} />}
      />
    </main>
  );
}
