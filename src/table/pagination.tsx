import type { Table } from "@tanstack/react-table";
import { ArrowLeftIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-0 sm:gap-3">
      <div className="flex items-center gap-2">
        <p className="text-sm">rows_per_page</p>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-6 w-16">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
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

      <div className="flex items-center justify-center flex-col sm:flex-row gap-3 mt-2 sm:mt-0">
        <p className="flex text-sm">
          page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 cursor-pointer"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              title="first"
            >
              <span className="sr-only">Go to first page</span>
              <ArrowLeftIcon
                size={18}
                className={cn({
                  // "rotate-180": dir === "rtl",
                })}
              />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 cursor-pointer"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              title="previous"
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon
                size={18}
                className={cn({
                  // "rotate-180": dir === "rtl",
                })}
              />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 cursor-pointer"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              title="next"
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon
                size={18}
                className={cn({
                  // "rotate-180": dir === "rtl",
                })}
              />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 cursor-pointer"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              title="last"
            >
              <span className="sr-only">Go to last page</span>
              <ArrowRightIcon
                size={18}
                className={cn({
                  // "rotate-180": dir === "rtl",
                })}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
