import type { RowData, Table } from "@tanstack/react-table";

export type TableMessageParams = Record<string, string | number>;

export type TableTranslator = (key: TableMessageKey, params?: TableMessageParams) => string;

export type TableMessageKey =
  | "columns"
  | "toggle_columns"
  | "rows_per_page"
  | "page_of"
  | "go_to_first_page"
  | "go_to_previous_page"
  | "go_to_next_page"
  | "go_to_last_page"
  | "sort_ascending"
  | "sort_descending"
  | "clear_sort"
  | "search_placeholder"
  | "no_results";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    /**
     * Translation function used by data-table components.
     * Provide it via the `t` option of `useTable`, or through `meta` directly.
     */
    t?: TableTranslator;
  }
}

/**
 * Resolves the translator provided on table meta.
 * Falls back to rendering the raw message key when no translator is set.
 */
export function getTableTranslator<TData>(table: Table<TData>): TableTranslator {
  return table.options.meta?.t ?? ((key) => key);
}
