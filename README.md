# Data Table

A generic, reusable React data table built on [`@tanstack/react-table`](https://tanstack.com/table) and [Base UI](https://base-ui.com) primitives, following shadcn/ui conventions.

Features: sorting, global search (debounced), column filters, pagination, row selection, row actions (dropdown and/or context menu), column visibility toggle, RTL support, and manual/server-side mode.

## Repository layout

```text
├── registry.json        # shadcn registry catalog (root requirement for GitHub registries)
├── src/
│   ├── table/           # the Data Table (registry-distributed source)
│   ├── components/ui/   # Base UI primitive wrappers (registry-distributed source)
│   └── lib/             # cn() utility (registry-distributed source)
├── tests/               # Vitest browser tests (not part of the registry)
└── playground/          # Vite demo app importing src/ directly (not part of the registry)
```

## Development

```bash
npm install
npm run dev          # Vite playground at http://localhost:5173
npm run build:demo   # production build of the playground
npm run typecheck    # tsc --noEmit
npm run test:run     # Vitest browser tests (Playwright/Chromium)
npm run format       # Biome check --write
```

The playground ([playground/src/App.tsx](playground/src/App.tsx)) imports the real table source via the `@` alias (→ `src/`) — the implementation is not duplicated.

## Installing via the shadcn GitHub registry

This repository is a [GitHub-hosted shadcn registry](https://ui.shadcn.com/docs/registry/github). In any project with the shadcn CLI initialized (`components.json`):

```bash
npx shadcn@latest add devA7md/data-table/data-table
```

The command installs:

- all Data Table files → your `components/data-table/` directory,
- the Base UI primitive wrappers → your `components/ui/` directory (note: these replace same-named components, e.g. a Radix-based `select`, with the Base UI versions the table requires),
- the `cn()` utility → your `lib/` directory,
- npm dependencies: `@base-ui/react`, `@tanstack/react-table`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`.

The shadcn CLI rewrites `@/components/ui/*` and `@/lib/utils` imports to the aliases configured in the consuming project's `components.json`. Internal table imports are relative, so the `components/data-table/` folder is relocatable.

You can also install the utility on its own:

```bash
npx shadcn@latest add devA7md/data-table/utils
```

Validate the registry locally with:

```bash
npm run registry:validate
```

## Usage

```tsx
import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ColumnHeader,
  TableComponent,
  TablePagination,
  TableToolbar,
  useTable,
} from "@/components/data-table";

const { table } = useTable<User, unknown>({ columns, data });

<TableComponent
  table={table}
  columns={columns}
  data={data}
  rowActions={[{ title: "Edit", onClick: (row) => ... }]}
  renderToolbar={(t) => <TableToolbar table={t} searchPlaceholder="Search..." />}
  renderFooter={(t) => <TablePagination table={t} />}
/>;
```

See [playground/src/App.tsx](playground/src/App.tsx) for a complete example with mock data covering sorting, filtering, pagination, selection, and row actions.

## Notes

- No compiled npm package output: distribution happens through the shadcn GitHub source registry, so there is no build step for the library itself.
- Styling assumes Tailwind CSS v4 with theme tokens such as `--color-primary`, `--color-muted`, `--color-border`, `--color-destructive`, `--color-ring`, `--z-dropdown`, and `--z-modal`. The playground's [index.css](playground/src/index.css) contains a reference theme.
