
"use client";

import { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";

import { AlertCircle, Database, RefreshCw } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Spinner } from "../ui/spinner";

import {
  DataTableToolbar,
  type DataTableFilter,
} from "./DataTableToolbar";

import { DataTablePagination } from "./DataTablePagination";
import { DataTableSortIcon } from "./DataTableSortIcon";

import type { DataTableProps } from "@/types/datatable.types";

type DataTableExtendedProps<TData, TValue> = DataTableProps<
  TData,
  TValue
> & {
  filterOptions?: DataTableFilter[];
  searchMaxLength?: number;
  searchPattern?: RegExp;
  error?: Error | string | boolean | null;
  onRetry?: () => void;
  errorMessage?: string;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,

  error = null,
  onRetry,
  errorMessage = "Something went wrong while loading the data.",

  search,
  searchKey,
  onSearchChange,
  searchPlaceholder = "Search...",
  manualSearch = false,
  searchMaxLength,
  searchPattern,

  sorting,
  onSortingChange,
  manualSorting = false,

  filters,
  onFiltersChange,
  manualFiltering = false,

  pagination,
  onPaginationChange,
  manualPagination = false,

  totalRows,
  pageCount,

  columnVisibility,
  onColumnVisibilityChange,

  rowSelection,
  onRowSelectionChange,

  enableSearch = true,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableRowSelection = false,

  toolbar,
  filterOptions = [],

  emptyIcon = <Database />,
  emptyMessage = "No records found.",

  onRowClick,
}: DataTableExtendedProps<TData, TValue>) {
  /*
   * Internal state
   */

  const [internalSorting, setInternalSorting] =
    useState<SortingState>([]);

  const [internalFilters, setInternalFilters] =
    useState<ColumnFiltersState>([]);

  const [internalPagination, setInternalPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: pagination?.pageSize ?? 10,
    });

  const [internalVisibility, setInternalVisibility] =
    useState<Record<string, boolean>>({});

  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});

  /*
   * Controlled / uncontrolled state
   */

  const sortingState = sorting ?? internalSorting;
  const filterState = filters ?? internalFilters;
  const paginationState = pagination ?? internalPagination;
  const visibilityState = columnVisibility ?? internalVisibility;
  const rowSelectionState = rowSelection ?? internalRowSelection;

  const filterValues = Object.fromEntries(
    filterState.map(({ id, value }) => [id, String(value)]),
  );

  const handleFilterChange = (
    key: string,
    value: string | undefined,
  ) => {
    const nextFilters = filterState.filter(
      (filter) => filter.id !== key,
    );

    if (value !== undefined && value !== "") {
      nextFilters.push({
        id: key,
        value,
      });
    }

    if (onFiltersChange) {
      onFiltersChange(nextFilters);
    } else {
      setInternalFilters(nextFilters);
    }

    // Return to the first page when a filter changes.
    if (onPaginationChange) {
      onPaginationChange((previous) => ({
        ...previous,
        pageIndex: 0,
      }));
    } else {
      setInternalPagination((previous) => ({
        ...previous,
        pageIndex: 0,
      }));
    }
  };

  /*
   * TanStack Table
   */

  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    manualSorting,
    manualFiltering,
    manualPagination,

    autoResetPageIndex: false,

    ...(manualPagination && pageCount !== undefined
      ? { pageCount }
      : {}),

    state: {
      sorting: sortingState,
      columnFilters: filterState,
      pagination: paginationState,
      columnVisibility: visibilityState,
      rowSelection: rowSelectionState,
    },

    onSortingChange:
      onSortingChange ?? setInternalSorting,

    onColumnFiltersChange:
      onFiltersChange ?? setInternalFilters,

    onPaginationChange:
      onPaginationChange ?? setInternalPagination,

    onColumnVisibilityChange:
      onColumnVisibilityChange ?? setInternalVisibility,

    onRowSelectionChange:
      onRowSelectionChange ?? setInternalRowSelection,

    enableSorting,
    enableRowSelection,
  });

  /*
   * Loading state
   */

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  /*
   * Error state
   */

  if (error) {
    const message =
      typeof error === "string"
        ? error
        : error instanceof Error
          ? error.message
          : errorMessage;

    return (
      <div className="bg-card my-5 flex min-h-80 items-center justify-center rounded-xl border">
        <div className="flex max-w-md flex-col items-center justify-center px-6 py-12 text-center">
          <div className="bg-destructive/10 text-destructive mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <AlertCircle className="h-6 w-6" />
          </div>

          <h3 className="text-foreground text-base font-semibold">
            Unable to load data
          </h3>

          <p className="text-muted-foreground mt-2 text-sm">
            {message}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-5 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  /*
   * Render
   */

  return (
    <div>
      <DataTableToolbar
        table={table}
        toolbar={toolbar}
        enableSearch={enableSearch}
        search={search}
        searchKey={searchKey}
        manualSearch={manualSearch}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        searchMaxLength={searchMaxLength}
        searchPattern={searchPattern}
        enableFiltering={enableFiltering}
        filterOptions={filterOptions}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        enableExportCSV={true}
      />

      <div className="bg-card my-5 overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort =
                    enableSorting && header.column.getCanSort();

                  return (
                    <TableHead
                      key={header.id}
                      className={
                        canSort
                          ? "cursor-pointer select-none"
                          : ""
                      }
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                          {canSort && (
                            <DataTableSortIcon
                              direction={header.column.getIsSorted()}
                            />
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={
                    onRowClick
                      ? () => onRowClick(row.original)
                      : undefined
                  }
                  className={
                    onRowClick
                      ? "hover:bg-muted/50 cursor-pointer"
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-32 text-center"
                >
                  {emptyIcon && (
                    <div className="text-muted-foreground flex justify-center p-2 text-center">
                      {emptyIcon}
                    </div>
                  )}

                  <p className="text-muted-foreground text-sm">
                    {emptyMessage}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {enablePagination && (
        <DataTablePagination
          table={table}
          manualPagination={manualPagination}
          totalRows={totalRows}
          pageSizeOptions={[10, 20, 50, 100]}
        />
      )}
    </div>
  );
}
