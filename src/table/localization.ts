export type TableMessageParams = Record<string, string | number>;

/**
 * Host translator type, deliberately loose so the host app can pass its own
 * `t` (e.g. `<K extends TranslationKey>(key: K, params?) => string`) without
 * a type mismatch. Missing keys fall back to the built-in English messages.
 */
export type TableTranslator = (key: string, params?: TableMessageParams) => string;

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
  | "no_results"
  | "selected_count";

/** Built-in English fallbacks for all table labels. */
const defaultMessages: Record<TableMessageKey, string> = {
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
  search_placeholder: "Search…",
  no_results: "No results",
  selected_count: "{count} selected",
};

/** Simple `{param}` replacement. */
function interpolate(message: string, params?: TableMessageParams): string {
  if (!params) return message;
  return message.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

/**
 * Resolves the translator provided on table meta.
 * Falls back to the built-in English message when the host translator is
 * missing or returns the raw key untranslated.
 */
export function getTableTranslator(table: {
  options: { meta?: { t?: TableTranslator } };
}): TableTranslator {
  const t = table.options.meta?.t;
  return (key, params) => {
    const translated = t?.(key, params);
    if (translated && translated !== key) return translated;
    return interpolate(defaultMessages[key as TableMessageKey] ?? key, params);
  };
}
