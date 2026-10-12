import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
  RowData,
  RowSelectionState,
  SortingState,
  Table,
  VisibilityState,
} from "@tanstack/react-table";
import type { Dispatch, ReactElement, ReactNode, SetStateAction } from "react";

import type { TableTranslator } from "./localization";
import type { TableQueryParams } from "./table-query";

export type RowAction<TData> = {
  title: string;
  onClick: (row: Row<TData>) => void;
  icon?: ReactElement;
  disabled?: boolean;
  hidden?: boolean;
  divider?: boolean;
};

export type ActionPlacement = "dropdown" | "context-menu" | "both";

export type TableFilterRenderProps = {
  close: () => void;
};

export type TableFilterRenderer<TData> = (
  table: Table<TData>,
  props: TableFilterRenderProps,
) => ReactNode;

export interface TableToolbarProps<TData extends RowData> {
  searchPlaceholder?: string;
  showColumnView?: boolean;
  showSearch?: boolean;
  renderFilter?: TableFilterRenderer<TData>;
  children?: ReactNode;
  debounceMs?: number;
  table: Table<TData>;
}

export interface UseTableOptions<
  TData extends RowData,
  TValue,
  TQueryParams = Record<string, string>,
> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  pageCount?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  initialState?: {
    pagination?: Partial<PaginationState>;
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    columnVisibility?: VisibilityState;
    rowSelection?: RowSelectionState;
  };
  transformQueryParams?: (params: TableQueryParams) => TQueryParams;
  /** Translation function exposed to all table components via table meta. */
  t?: TableTranslator;
}

export interface UseTableReturn<TData extends RowData> {
  table: Table<TData>;
  sorting: SortingState;
  setSorting: Dispatch<SetStateAction<SortingState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  columnVisibility: VisibilityState;
  setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  globalFilter: string;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  queryParams: Record<string, string>;
}

export type TableClassNames = {
  /** Class for the outermost wrapper element. */
  root?: string;
  /** Class for the bordered wrapper around the table. */
  wrapper?: string;
  /** Class applied directly to the <table> element. */
  table?: string;
};

export interface TableProps<TData, TValue> extends UseTableOptions<TData, TValue> {
  table?: Table<TData>;
  loading?: boolean;
  error?: string | null;
  rowActions?: RowAction<TData>[] | ((row: TData) => RowAction<TData>[]);
  rowActionsPlacement?: ActionPlacement;
  contextMenu?: RowAction<TData>[] | ((row: TData) => RowAction<TData>[]);
  enableRowSelection?: boolean;
  onRowClick?: (row: Row<TData>) => void;
  onRowDoubleClick?: (row: Row<TData>) => void;
  classNames?: TableClassNames;
  emptyMessage?: string;
  renderToolbar?: (table: Table<TData>) => ReactNode;
  renderFooter?: (table: Table<TData>) => ReactNode;
}

export interface TableContextMenuProps<TData> {
  x: number;
  y: number;
  row: Row<TData>;
  actions: RowAction<TData>[] | ((row: TData) => RowAction<TData>[]);
  onClose: () => void;
}
