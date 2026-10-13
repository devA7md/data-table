# Data Table

A generic, reusable React data table built on [TanStack Table 9](https://tanstack.com/table) and [Base UI](https://base-ui.com) primitives, styled with Tailwind CSS and shadcn/ui.

## Installation

```bash
npx shadcn@latest add https://github.com/devA7md/data-table/registry.json
```

## Features

- Sorting (header click / dropdown)
- Pagination (client or server-side)
- Global search + per-column filters
- Row selection
- Column visibility toggler
- Row actions (dropdown and/or context menu)
- Loading / error / empty states
- Localization

## Quick start

### Without `useTable` (simplest)

Pass `data` and `columns` directly to `Table`. A table instance is created internally:

```tsx
import { Table } from "@/components/ui/data-table";
import { createColumnHelper } from "@tanstack/react-table";

type User = { id: number; name: string; email: string; role: string };

const col = createColumnHelper<DataTableFeatures, User>();

const columns = [
  col.accessor("name", { header: "Name" }),
  col.accessor("email", { header: "Email" }),
  col.accessor("role", { header: "Role" }),
];

export function UsersTable({ users }: { users: User[] }) {
  return (
    <Table
      columns={columns}
      data={users}
      emptyMessage="No users found"
    />
  );
}
```

### With `useTable` (recommended for real apps)

Use the hook when you need the state (pagination, sorting, filters, selection) outside the table — e.g. to feed `queryParams` into a data fetch, or to render toolbars/pagination:

```tsx
import {
  Table,
  TableToolbar,
  DataTablePagination,
  useTable,
} from "@/components/ui/data-table";
import { createColumnHelper } from "@tanstack/react-table";

type User = { id: number; name: string; email: string };

const col = createColumnHelper<DataTableFeatures, User>();
const columns = [
  col.accessor("name", { header: "Name" }),
  col.accessor("email", { header: "Email" }),
];

export function UsersTable() {
  const { table, queryParams } = useTable({ columns, data });

  // queryParams: { page, pageSize, sort?, search, filters }
  // use it in your data-fetching layer (React Query, SWR, fetch, ...)

  return (
    <>
      <TableToolbar table={table} searchPlaceholder="Search users…" />
      <Table table={table} />
      <DataTablePagination table={table} />
    </>
  );
}
```

## Server-side data fetching

Enable manual mode and pass `pageCount` from the server response. State changes are reflected in `queryParams`:

```tsx
const [pageCount, setPageCount] = useState(0);

const { table, queryParams } = useTable<User, unknown>({
  columns,
  data: users,
  pageCount,
  manualPagination: true,
  manualSorting: true,
  manualFiltering: true,
});

useEffect(() => {
  fetch(`/api/users?page=${queryParams.page}&pageSize=${queryParams.pageSize}` +
        `&sort=${queryParams.sort?.field}&dir=${queryParams.sort?.direction}` +
        `&search=${queryParams.search}`)
    .then((r) => r.json())
    .then((res) => {
      setUsers(res.items);
      setPageCount(res.totalPages);
    });
}, [queryParams]);

return <Table table={table} loading={isLoading} error={error} />;
```

## Row actions

Actions appear as a trailing dropdown column (and/or as a context menu):

```tsx
<Table
  columns={columns}
  data={users}
  rowActions={[
    { title: "Edit", icon: <Pencil />, onClick: (row) => openEditor(row.original) },
    { title: "Delete", icon: <Trash2 />, onClick: (row) => deleteUser(row.original.id),
      divider: true },
  ]}
  rowActionsPlacement="both" // "dropdown" | "context-menu" | "both"
  contextMenu={(row) => [
    { title: "Copy email", onClick: () => navigator.clipboard.writeText(row.email) },
  ]}
/>
```

## Toolbar

`TableToolbar` bundles search (debounced), a column visibility toggler, and a custom filter slot. Use it via `renderToolbar` or standalone:

```tsx
<Table
  columns={columns}
  data={users}
  renderToolbar={(table) => (
    <TableToolbar
      table={table}
      searchPlaceholder="Search…"
      showSearch
      showColumnView
      debounceMs={400}
      renderFilter={(table, { close }) => <MyFilterForm table={table} onDone={close} />}
    >
      <Button>Add user</Button>
    </TableToolbar>
  )}
/>
```

## Row selection

```tsx
const { table, rowSelection, setRowSelection } = useTable({ columns, data });

<Table table={table} enableRowSelection />
```

Check selected rows with `table.getSelectedRowModel().rows` or the `rowSelection` state.

## Initial state & controlled state

```tsx
const { table, sorting, setSorting } = useTable({
  columns,
  data,
  initialState: {
    pagination: { pageSize: 25 },
    sorting: [{ id: "name", desc: false }],
    columnVisibility: { email: false },
    rowSelection: {},
    globalFilter: "",
  },
});
```

All state pieces (`sorting`, `pagination`, `columnFilters`, `columnVisibility`, `rowSelection`, `globalFilter`) are returned with their setters.

## Loading, error & empty states

```tsx
<Table table={table} loading={isFetching} error={fetchError} emptyMessage="Nothing here" />
```

## Custom styling

```tsx
<Table
  table={table}
  classNames={{
    root: "gap-2",      // outer wrapper
    wrapper: "rounded-md", // bordered wrapper
    table: "text-xs",   // the <table> element
  }}
/>
```

## Localization

Pass a translator to `useTable` to translate built-in labels:

```tsx
const t = (key: TableMessageKey, params) => messages[lang][key] ?? key;

const { table } = useTable({ columns, data, t });
```

Keys: `columns`, `toggle_columns`, `rows_per_page`, `page_of`, `go_to_first_page`, `go_to_previous_page`, `go_to_next_page`, `go_to_last_page`, `sort_ascending`, `sort_descending`, `clear_sort`, `search_placeholder`, `no_results`.

## Row click handlers

```tsx
<Table
  table={table}
  onRowClick={(row) => console.log(row.original)}
  onRowDoubleClick={(row) => openDetails(row.original)}
/>
```

## Exported pieces

| Export | Purpose |
| --- | --- |
| `Table` | The table component (internal or external instance) |
| `useTable` | Hook creating the table instance + state |
| `TableToolbar`, `TableToolbarSearch`, `TableFilter` | Toolbar building blocks |
| `ColumnView` | Column visibility dropdown |
| `DataTablePagination` | Pagination controls |
| `TableRowActions`, `TableContextMenu`, `createActionsColumn` | Row action primitives |
| `TableHeaderSort` | Sortable header cell |
| `useDebounce` | Debounce any value |
| `getTableQueryParams` | Build `{ page, pageSize, sort, search, filters }` from raw state |
| `dataTableFeatures` / `DataTableFeatures` | The shared TanStack feature set |
| Types: `DataTable`, `DataTableRow`, `RowAction`, `TableQueryParams`, `TableTranslator`, ... | — |
