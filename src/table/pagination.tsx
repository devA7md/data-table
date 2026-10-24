import type { RowData } from "@tanstack/react-table";
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getTableTranslator } from "./localization";
import type { DataTable } from "./table.types";

interface DataTablePaginationProps<TData extends RowData> {
  table: DataTable<TData>;
}

export function DataTablePagination<TData extends RowData>({
  table,
}: DataTablePaginationProps<TData>) {
  const t = getTableTranslator(table);

  return (
    <div className="flex items-center justify-between gap-0 sm:flex-row sm:gap-3">
      <div className="flex items-center gap-2">
        <p className="hidden text-sm sm:block">{t("rows_per_page")}</p>

        <Select
          value={`${table.state.pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-6 w-14 sm:w-16">
            <SelectValue placeholder={table.state.pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[1, 5, 10, 20, 40].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-center gap-2 sm:mt-0 sm:flex-row sm:gap-3">
        <p className="text-xs sm:text-sm">
          {t("page_of", {
            page: table.state.pagination.pageIndex + 1,
            total: table.getPageCount(),
          })}
        </p>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              size="icon"
              variant="outline"
              className="size-5 cursor-pointer p-1 sm:size-9 sm:p-2"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              title={t("go_to_first_page")}
            >
              <span className="sr-only">{t("go_to_first_page")}</span>
              <ArrowLeftIcon className="size-3.5 rtl:rotate-180 sm:size-3.5" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="size-5 cursor-pointer p-1 sm:size-9 sm:p-2"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              title={t("go_to_previous_page")}
            >
              <span className="sr-only">{t("go_to_previous_page")}</span>
              <ChevronLeftIcon className="size-3.5 rtl:rotate-180 sm:size-3.5" />
            </Button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              size="icon"
              variant="outline"
              className="size-5 cursor-pointer p-1 sm:size-9 sm:p-2"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              title={t("go_to_next_page")}
            >
              <span className="sr-only">{t("go_to_next_page")}</span>
              <ChevronRightIcon className="size-3.5 rtl:rotate-180 sm:size-3.5" />
            </Button>

            <Button
              size="icon"
              variant="outline"
              className="size-5 cursor-pointer p-1 sm:size-9 sm:p-2"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              title={t("go_to_last_page")}
            >
              <span className="sr-only">{t("go_to_last_page")}</span>
              <ArrowRightIcon className="size-3.5 rtl:rotate-180 sm:size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
