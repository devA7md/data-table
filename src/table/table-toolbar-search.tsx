import type { Table } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";

import { getTableTranslator } from "./localization";
import { useDebounce } from "./use-debounce";

interface TableToolbarSearchProps<TData> {
  table: Table<TData>;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function TableToolbarSearch<TData>({
  table,
  placeholder,
  debounceMs = 300,
  className,
}: TableToolbarSearchProps<TData>) {
  const globalFilter = table.getState().globalFilter;
  const t = getTableTranslator(table);
  const [inputValue, setInputValue] = useState(() => String(globalFilter ?? ""));
  const { debouncedValue } = useDebounce(inputValue, debounceMs);

  const tableRef = useRef(table);
  tableRef.current = table;

  useEffect(() => {
    setInputValue(String(globalFilter ?? ""));
  }, [globalFilter]);

  useEffect(() => {
    tableRef.current.setGlobalFilter(debouncedValue);
  }, [debouncedValue]);

  return (
    <Input
      placeholder={placeholder ?? t("search_placeholder")}
      value={inputValue}
      onChange={(event) => setInputValue(event.target.value)}
      className={className}
    />
  );
}
