import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";

import type { DataTableFeatures, DataTableRow, RowAction, TableFilterRenderer } from "@/table";

import type { User } from "../data/users";
import { type Lang, labels } from "./i18n";

const roleFilter = (row: DataTableRow<User>, _columnId: string, filterValue: unknown) => {
  if (!filterValue) return true;
  return row.original.role === filterValue;
};

export function createUserColumns(lang: Lang): ColumnDef<DataTableFeatures, User, unknown>[] {
  return [
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
      header: () => labels[lang].columns.name,
    },
    {
      accessorKey: "email",
      header: () => labels[lang].columns.email,
    },
    {
      accessorKey: "role",
      header: () => labels[lang].columns.role,
      filterFn: roleFilter,
    },
    {
      accessorKey: "status",
      header: () => labels[lang].columns.status,
    },
    {
      accessorKey: "createdAt",
      header: () => labels[lang].columns.createdAt,
    },
  ];
}

export function createUserRowActions(lang: Lang): (row: User) => RowAction<User>[] {
  return (row) => [
    { title: labels[lang].actions.view, onClick: (r) => console.log("view", r.original) },
    { title: labels[lang].actions.edit, onClick: (r) => console.log("edit", r.original) },
    {
      title: labels[lang].actions.reset,
      onClick: (r) => console.log("reset", r.original),
      divider: true,
    },
    {
      title: labels[lang].actions.disable,
      onClick: (r) => console.log("disable", r.original),
      hidden: row.status === "disabled",
    },
  ];
}

/** Role radio-group filter shared by the toolbar filter popover in each example. */
export function createRoleFilterRenderer(lang: Lang): TableFilterRenderer<User> {
  return (table, { close }): ReactNode => (
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
          {labels[lang].roles[role]}
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
        {labels[lang].clearFilter}
      </button>
    </div>
  );
}
