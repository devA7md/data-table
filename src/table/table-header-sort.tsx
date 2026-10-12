import { flexRender, type Header, type RowData } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon } from "lucide-react";

import { getTableTranslator } from "./localization";
import type { DataTableFeatures } from "./table-features";

interface TableHeaderSortProps<TData extends RowData, TValue> {
  header: Header<DataTableFeatures, TData, TValue>;
}

export function TableHeaderSort<TData extends RowData, TValue>({
  header,
}: TableHeaderSortProps<TData, TValue>) {
  const t = getTableTranslator(header.getContext().table);

  return (
    <button
      type="button"
      className={
        header.column.getCanSort() ? "cursor-pointer select-none flex items-center gap-1" : ""
      }
      onClick={header.column.getToggleSortingHandler()}
      title={
        header.column.getCanSort()
          ? header.column.getNextSortingOrder() === "asc"
            ? t("sort_ascending")
            : header.column.getNextSortingOrder() === "desc"
              ? t("sort_descending")
              : t("clear_sort")
          : undefined
      }
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
      {{
        asc: <ChevronUpIcon size={16} />,
        desc: <ChevronDownIcon size={16} />,
      }[header.column.getIsSorted() as string] ??
        (header.column.getCanSort() && <ChevronsUpDownIcon size={16} />)}
    </button>
  );
}
