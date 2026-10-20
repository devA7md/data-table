import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnVisibilityState,
  PaginationState,
  ReactTable,
  Row,
  RowData,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import type { Dispatch, ReactElement, ReactNode, SetStateAction } from "react";

import type { TableTranslator } from "./localization";
import type { DataTableFeatures } from "./table-features";
import type { TableQueryParams } from "./table-query";

/** A table instance built from the package's `dataTableFeatures`. */
export type DataTable<TData extends RowData> = ReactTable<DataTableFeatures, TData>;

/** A row instance produced by a `DataTable`. */
export type DataTableRow<TData extends RowData> = Row<DataTableFeatures, TData>;

export type RowAction<TData extends RowData> = {
  title: string;
  onClick: (row: DataTableRow<TData>) => void;
  icon?: ReactElement;
  disabled?: boolean;
  hidden?: boolean;
  divider?: boolean;
  /** Tooltip shown when the action is disabled. */
  disabledTooltip?: string;
};

export type ActionPlacement = "dropdown" | "context-menu" | "both";

export type TableFilterRenderProps = {
  close: () => void;
};

export type TableFilterRenderer<TData extends RowData> = (
  table: DataTable<TData>,
  props: TableFilterRenderProps,
) => ReactNode;

export interface TableToolbarProps<TData extends RowData> {
  searchPlaceholder?: string;
  showColumnView?: boolean;
  showSearch?: boolean;
  renderFilter?: TableFilterRenderer<TData>;
  /**
   * Controls the filter indicator dot. Defaults to true when any column
   * filters are applied. Pass your own predicate when the table ships with
   * predefined filters that shouldn't mark the filter as active.
   */
  hasActiveFilters?: boolean;
  children?: ReactNode;
  debounceMs?: number;
  table: DataTable<TData>;
  columnViewTriggerClassName?: string;
}

export interface UseTableOptions<TData extends RowData, TValue> {
  columns: ColumnDef<DataTableFeatures, TData, TValue>[];
  data: TData[] | undefined;
  pageCount?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  initialState?: {
    pagination?: Partial<PaginationState>;
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    columnVisibility?: ColumnVisibilityState;
    rowSelection?: RowSelectionState;
    globalFilter?: string;
  };
  /** Translation function exposed to all table components via table meta. */
  t?: TableTranslator;
}

export interface UseTableReturn<TData extends RowData> {
  table: DataTable<TData>;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  columnVisibility: ColumnVisibilityState;
  setColumnVisibility: Dispatch<SetStateAction<ColumnVisibilityState>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  queryParams: TableQueryParams;
}

export type TableClassNames = {
  /** Class for the outermost wrapper element. */
  root?: string;
  /** Class for the bordered wrapper around the table. */
  wrapper?: string;
  /** Class applied directly to the <table> element. */
  table?: string;
};

export interface TableBaseProps<TData extends RowData> {
  loading?: boolean;
  error?: string | null;
  contextMenu?: RowAction<TData>[] | ((row: TData) => RowAction<TData>[]);
  enableRowSelection?: boolean;
  onRowClick?: (row: DataTableRow<TData>) => void;
  onRowDoubleClick?: (row: DataTableRow<TData>) => void;
  classNames?: TableClassNames;
  emptyMessage?: string;
  renderToolbar?: (table: DataTable<TData>) => ReactNode;
  /** Renders a bulk-action bar (with selected count) while rows are selected. */
  renderSelectedRowActions?: (props: {
    selectedRowIds: TData[];
    clearSelection: () => void;
  }) => ReactNode;
  renderFooter?: (table: DataTable<TData>) => ReactNode;
}

/** Renders a pre-built table instance; `data`/`columns` are not needed. */
export type ExternalTableProps<TData extends RowData, TValue> = TableBaseProps<TData> & {
  table: DataTable<TData>;
  columns?: ColumnDef<DataTableFeatures, TData, TValue>[];
  data?: TData[];
};

/**
 * Builds the table internally; `data` and `columns` are required.
 * `rowActions` is appended as a trailing actions column automatically.
 */
export type InternalTableProps<TData extends RowData, TValue> = TableBaseProps<TData> &
  UseTableOptions<TData, TValue> & {
    table?: undefined;
    rowActions?: RowAction<TData>[] | ((row: TData) => RowAction<TData>[]);
    rowActionsPlacement?: ActionPlacement;
  };

export type TableProps<TData extends RowData, TValue> =
  | ExternalTableProps<TData, TValue>
  | InternalTableProps<TData, TValue>;

export interface TableContextMenuProps<TData extends RowData> {
  x: number;
  y: number;
  row: DataTableRow<TData>;
  actions: RowAction<TData>[] | ((row: TData) => RowAction<TData>[]);
  onClose: () => void;
}
