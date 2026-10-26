import { Fragment, useEffect, useMemo, useState } from "react";

import {
  createActionsColumn,
  DataTablePagination,
  Table,
  type TableQueryParams,
  TableToolbar,
  useTable,
} from "@/table";

import type { User } from "../data/users";
import { type Lang, labels, useTranslator } from "../lib/i18n";
import {
  fetchRemoteUsersPage,
  readTableStateFromUrl,
  writeQueryParamsToUrl,
} from "../lib/remote-users";
import {
  createSelectedRowActions,
  createUserColumns,
  createUserRowActions,
} from "../lib/user-table";

/** Flattens the table query params into a string map that fits a URL. */
function transformQueryParams(params: TableQueryParams): Record<string, string> {
  const flat: Record<string, string> = {
    page: String(params.page),
    pageSize: String(params.pageSize),
  };
  if (params.search) flat.search = params.search;
  if (params.sort) flat.sort = `${params.sort.field}.${params.sort.direction}`;
  for (const filter of params.filters) {
    flat[`filter_${filter.id}`] = String(filter.value);
  }
  return flat;
}

/**
 * Server-driven table: the table instance is built with the useTable hook and
 * passed to Table via its `table` prop. Pagination is manual — every page /
 * page-size change re-fetches that page from DummyJSON (driving the `loading`
 * prop), with `pageCount` taken from the server's total. Every query-param
 * change is written back to the location URL, and on reload the table
 * restores its state from that URL.
 */
export function ExternalTableExample({ lang }: { lang: Lang }) {
  const t = useTranslator(lang);
  const rowActions = useMemo(() => createUserRowActions(lang), [lang]);
  const renderSelectedRowActions = useMemo(() => createSelectedRowActions(lang), [lang]);
  const columns = useMemo(
    () => [...createUserColumns(lang), createActionsColumn(rowActions)],
    [lang, rowActions],
  );

  // Restore page/pageSize/sort/search from the URL on first load.
  const [initialState] = useState(readTableStateFromUrl);

  const [data, setData] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { table, pagination, queryParams } = useTable<User, unknown>({
    columns,
    data,
    t,
    initialState,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    manualExpanding: true,
    getRowCanExpand: () => true,
    pageCount,
  });

  // Derive the manual page count from the server total once known (-1 until then).
  useEffect(() => {
    setPageCount(total > 0 ? Math.ceil(total / pagination.pageSize) : -1);
  }, [total, pagination.pageSize]);

  // Each page / page-size / sort / search change re-fetches from the server.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchRemoteUsersPage(
      {
        skip: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize,
        sortBy: queryParams.sort?.field,
        order: queryParams.sort?.direction,
        search: queryParams.search,
      },
      controller.signal,
    )
      .then((page) => {
        setData(page.users);
        setTotal(page.total);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : String(cause));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [pagination.pageIndex, pagination.pageSize, queryParams.sort, queryParams.search]);

  // Reflect the current query params in the location URL (no navigation).
  useEffect(() => {
    const flatParams = transformQueryParams(queryParams);
    writeQueryParamsToUrl(flatParams);
  }, [queryParams]);

  return (
    <Fragment>
      <Table<User, unknown>
        table={table}
        loading={loading}
        error={error && `${labels[lang].loadError} (${error})`}
        contextMenu={rowActions}
        onRowClick={(row) => console.log("row click", row.original)}
        renderToolbar={(table) => <TableToolbar table={table} showColumnView={false} />}
        renderSelectedRowActions={renderSelectedRowActions}
        renderFooter={(table) => <DataTablePagination table={table} />}
        renderExpandedRow={(row) => (
          <div className="space-y-2 p-4">
            <p className="font-medium">
              {row.original.name} {row.original.status}
            </p>
            <p className="text-muted-foreground text-sm">{row.original.email}</p>
            <p className="text-muted-foreground text-sm">{row.original.role}</p>
          </div>
        )}
        classNames={{
          table: "overflow-hidden rounded-2xl bg-primary/5",
        }}
        size="large"
      />

      <p className="text-muted-foreground text-xs">
        {labels[lang].queryParams}:{" "}
        {Object.entries(transformQueryParams(queryParams))
          .map(([key, value]) => `${key}=${value}`)
          .join("  ")}
      </p>
    </Fragment>
  );
}
