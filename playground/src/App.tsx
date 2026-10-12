import type { ColumnDef, Row } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  DataTablePagination,
  type RowAction,
  Table,
  type TableMessageKey,
  TableToolbar,
} from "@/table";

import type { User } from "./data/users";
import { createUsers } from "./data/users";

type Lang = "en" | "ar";

const messages: Record<Lang, Record<TableMessageKey, string>> = {
  en: {
    columns: "Columns",
    toggle_columns: "Toggle columns",
    rows_per_page: "Rows per page",
    page_of: "Page {page} of {total}",
    go_to_first_page: "Go to first page",
    go_to_previous_page: "Go to previous page",
    go_to_next_page: "Go to next page",
    go_to_last_page: "Go to last page",
    sort_ascending: "Sort ascending",
    sort_descending: "Sort descending",
    clear_sort: "Clear sort",
    search_placeholder: "Search...",
    no_results: "No results.",
  },
  ar: {
    columns: "الأعمدة",
    toggle_columns: "إظهار / إخفاء الأعمدة",
    rows_per_page: "صفوف في الصفحة",
    page_of: "صفحة {page} من {total}",
    go_to_first_page: "الانتقال إلى الصفحة الأولى",
    go_to_previous_page: "الانتقال إلى الصفحة السابقة",
    go_to_next_page: "الانتقال إلى الصفحة التالية",
    go_to_last_page: "الانتقال إلى الصفحة الأخيرة",
    sort_ascending: "ترتيب تصاعدي",
    sort_descending: "ترتيب تنازلي",
    clear_sort: "إزالة الترتيب",
    search_placeholder: "بحث...",
    no_results: "لا توجد نتائج.",
  },
};

/** Playground-specific strings (column headers, page chrome) — outside the table's key set. */
const labels: Record<
  Lang,
  {
    heading: string;
    subheading: string;
    columns: Record<"name" | "email" | "role" | "status" | "createdAt", string>;
    actions: Record<"view" | "edit" | "reset" | "disable", string>;
    roles: Record<"admin" | "editor" | "viewer", string>;
    clearFilter: string;
  }
> = {
  en: {
    heading: "Data Table Playground",
    subheading:
      "Sorting, global search, column filters, pagination, row selection, and row actions.",
    columns: {
      name: "Name",
      email: "Email",
      role: "Role",
      status: "Status",
      createdAt: "Created at",
    },
    actions: {
      view: "View profile",
      edit: "Edit user",
      reset: "Reset password",
      disable: "Disable user",
    },
    roles: { admin: "Admin", editor: "Editor", viewer: "Viewer" },
    clearFilter: "Clear filter",
  },
  ar: {
    heading: "ساحة تجربة جدول البيانات",
    subheading: "ترتيب، بحث شامل، فلاتر الأعمدة، ترقيم الصفحات، تحديد الصفوف، وإجراءات الصفوف.",
    columns: {
      name: "الاسم",
      email: "البريد الإلكتروني",
      role: "الدور",
      status: "الحالة",
      createdAt: "تاريخ الإنشاء",
    },
    actions: {
      view: "عرض الملف",
      edit: "تعديل المستخدم",
      reset: "إعادة تعيين كلمة المرور",
      disable: "تعطيل المستخدم",
    },
    roles: { admin: "مدير", editor: "محرر", viewer: "مشاهد" },
    clearFilter: "مسح الفلتر",
  },
};

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

const roleFilter = (row: Row<User>, _columnId: string, filterValue: unknown) => {
  if (!filterValue) return true;
  return row.original.role === filterValue;
};

export function App() {
  const data = useMemo(() => createUsers(), []);
  const [lang, setLang] = useState<Lang>("en");

  const t = useCallback(
    (key: TableMessageKey, params?: Record<string, string | number>) =>
      interpolate(messages[lang][key], params),
    [lang],
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const rowActions = useMemo(
    (): ((row: User) => RowAction<User>[]) => (row) => [
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
    ],
    [lang],
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
    ],
    [lang],
  );

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{labels[lang].heading}</h1>
          <p className="text-muted-foreground text-sm">{labels[lang].subheading}</p>
        </div>
        <button
          type="button"
          className="rounded-md border px-3 py-1 text-sm"
          onClick={() => setLang((prev) => (prev === "en" ? "ar" : "en"))}
        >
          {lang === "en" ? "العربية" : "English"}
        </button>
      </div>

      <Table<User, unknown>
        columns={columns}
        data={data}
        t={t}
        rowActions={rowActions}
        contextMenu={rowActions}
        enableRowSelection
        onRowClick={(row) => console.log("row click", row.original)}
        renderToolbar={(table) => (
          <TableToolbar
            table={table}
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
            )}
          />
        )}
        renderFooter={(table) => <DataTablePagination table={table} />}
        classNames={{
          wrapper: "overflow-hidden rounded-2xl bg-primary/5"
        }}
      />
    </main>
  );
}
