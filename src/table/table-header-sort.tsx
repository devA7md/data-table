import { flexRender, type Header } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon } from "lucide-react";

interface TableHeaderSortProps<TData, TValue> {
  header: Header<TData, TValue>;
}

export function TableHeaderSort<TData, TValue>({ header }: TableHeaderSortProps<TData, TValue>) {
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
            ? "Sort ascending"
            : header.column.getNextSortingOrder() === "desc"
              ? "Sort descending"
              : "Clear sort"
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
