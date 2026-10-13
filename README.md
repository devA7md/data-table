# Data Table

A generic, reusable React data table built on [`@tanstack/react-table`](https://tanstack.com/table) and [Base UI](https://base-ui.com) primitives, following shadcn/ui conventions. Distributed as a [GitHub-hosted shadcn registry](https://ui.shadcn.com/docs/registry/github) — no npm package, the source is copied into your project.

## Features

- Sorting (per-column, via header menus)
- Global search with debounce
- Column filters with a built-in filter popover, or a fully custom filter renderer
- Pagination with page-size selector
- Row selection (checkboxes)
- Row actions, as a dropdown, a right-click context menu, or both — static lists or per-row functions
- Column visibility toggle
- RTL support
- Built-in loading and error states
- Localization: pass a `t` translator to override every built-in string
- Client-side or manual/server-side mode, with `queryParams` derived from table state for easy API calls

## Repository layout

```text
├── registry.json        # shadcn registry catalog (root requirement for GitHub registries)
├── src/
│   ├── table/           # the Data Table (registry-distributed source)
│   └── components/ui/   # Base UI primitive wrappers (registry dependencies)
├── tests/               # Vitest browser tests (not part of the registry)
└── playground/          # Vite demo app importing src/ directly (not part of the registry)
```

## Installing via the shadcn GitHub registry

In any project with the shadcn CLI initialized (`components.json`):

```bash
npx shadcn@latest add devA7md/data-table/table
```

The command installs:

- all Data Table files → your `components/ui/data-table/` directory,
- the Base UI primitive wrappers (`button`, `card`, `context-menu`, `dropdown-menu`, `input`, `popover`, `select`, `table`) → your `components/ui/` directory. Note: these replace same-named components (e.g. a Radix-based `select`) with the Base UI versions the table requires.
- npm dependencies: `@base-ui/react`, `@tanstack/react-table`, `lucide-react`, `cn`, `tw-animate-css`, `class-variance-authority`.

The shadcn CLI rewrites `@/components/ui/*` imports to the aliases configured in the consuming project's `components.json`. Internal table imports are relative, so the `components/ui/data-table/` folder is relocatable.

Validate the registry locally with:

```bash
npm run registry:validate
```

## Usage

```tsx
import type { ColumnDef } from "@tanstack/react-table";
import {
  DataTablePagination,
  Table,
  TableToolbar,
  useTable,
} from "@/components/ui/data-table";

const { table } = useTable<User, unknown>({ columns, data });

<Table
  table={table}
  columns={columns}
  data={data}
  rowActions={[{ title: "Edit", onClick: (row) => ... }]}
  renderToolbar={(t) => <TableToolbar table={t} searchPlaceholder="Search..." />}
  renderFooter={(t) => <DataTablePagination table={t} />}
/>;
```

See [playground/src/App.tsx](playground/src/App.tsx) for a complete example with mock data covering sorting, filtering, pagination, selection, and row actions.

### Server-side mode

Enable the manual flags and consume `queryParams` to drive your API — it's a `TableQueryParams` object (`page`, `pageSize`, `sort`, `search`, `filters`) that you can shape however your API expects:

```tsx
const { table, queryParams } = useTable<User, unknown>({
  columns,
  data,
  pageCount,
  manualPagination: true,
  manualSorting: true,
  manualFiltering: true,
});

useEffect(() => {
  fetchUsers({
    page: queryParams.page,
    per_page: queryParams.pageSize,
    sort: queryParams.sort && `${queryParams.sort.field}.${queryParams.sort.direction}`,
    q: queryParams.search,
    filters: queryParams.filters,
  });
}, [queryParams]);
```

### Localization

Every built-in string (pagination labels, sort menu items, empty state, …) goes through a translator on table meta. Provide your own via the `t` option:

```tsx
const { table } = useTable<User, unknown>({
  columns,
  data,
  t: (key, params) => myI18n.t(`table.${key}`, params),
});
```

Keys are typed by `TableMessageKey` in [src/table/localization.ts](src/table/localization.ts). Without a translator, raw keys are rendered.

## Development

```bash
npm install
npm run dev          # Vite playground at http://localhost:5173
npm run build:demo   # production build of the playground
npm run typecheck    # tsc --noEmit
npm run test:run     # Vitest browser tests (Playwright/Chromium)
npm run format       # Biome format --write
npm run lint         # Biome check
```

The playground ([playground/src/App.tsx](playground/src/App.tsx)) imports the real table source via the `@` alias (→ `src/`) — the implementation is not duplicated.

## Notes

- No compiled npm package output: distribution happens through the shadcn GitHub source registry, so there is no build step for the library itself.
- Peer dependencies: `react` / `react-dom` `>=19.2 <20`, `@tanstack/react-table` `>=8.21.2 <9`, `lucide-react` `^1.55`.
- Styling assumes Tailwind CSS v4 with theme tokens such as `--color-primary`, `--color-muted`, `--color-border`, `--color-destructive`, `--color-ring`, `--z-dropdown`, and `--z-modal`. The playground's [index.css](playground/src/index.css) contains a reference theme.
