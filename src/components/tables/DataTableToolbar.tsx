import React, { useEffect, useState } from 'react';

import { Table } from '@tanstack/react-table';

import { RefreshCw, Search, SlidersHorizontal } from 'lucide-react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { FilterDropdown } from './FilterDropdown';

export interface DataTableFilter {
  key: string;
  label: string;
  placeholder?: string;

  options: {
    label: string;
    value: string;
  }[];
}

interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>;

  toolbar?: React.ReactNode;

  // Search
  enableSearch?: boolean;
  search?: string;
  searchKey?: string;
  searchPlaceholder?: string;

  /**
   * Maximum number of characters allowed
   * in the search input.
   */
  searchMaxLength?: number;

  /**
   * Regular expression used to validate
   * characters entered into the search input.
   */
  searchPattern?: RegExp;

  enableColumnVisibility?: boolean;

  enableRefresh?: boolean;
  onRefresh?: () => void;

  enableExportCSV?: boolean;
  onExportCSV?: () => void;

  enableExportExcel?: boolean;
  onExportExcel?: () => void;

  enableFiltering?: boolean;

  filters?: {
    id: string;
    value: unknown;
  }[];

  filterOptions?: DataTableFilter[];
  filterValues?: Record<string, string | undefined>;
  onFilterChange?: (key: string, value: string | undefined) => void;

  manualSearch?: boolean;

  onSearchChange?: (value: string) => void;
}

export function DataTableToolbar<TData, TValue>({
  table,

  toolbar,

  enableSearch = true,
  enableColumnVisibility = true,

  search,
  searchKey,

  searchPlaceholder = 'Search...',

  searchMaxLength,
  searchPattern,

  manualSearch = false,

  enableRefresh = false,
  onRefresh,

  enableExportCSV = false,
  onExportCSV,

  enableExportExcel = false,
  onExportExcel,

  enableFiltering = true,

  filterOptions = [],
  filterValues = {},
  onFilterChange,

  onSearchChange,
}: DataTableToolbarProps<TData, TValue>) {
  /*
   * -------------------------------------------------------
   * Search value
   * -------------------------------------------------------
   */

  const searchValue =
    manualSearch || !searchKey
      ? (search ?? '')
      : ((table.getColumn(searchKey)?.getFilterValue() as string) ?? '');

  const [searchInput, setSearchInput] = useState(search ?? '');

  /*
   * -------------------------------------------------------
   * Sync controlled search value
   * -------------------------------------------------------
   */

  useEffect(() => {
    setSearchInput(search ?? '');
  }, [search]);

  /*
   * -------------------------------------------------------
   * Manual search debounce
   * -------------------------------------------------------
   */

  useEffect(() => {
    if (!manualSearch) return;

    const timer = setTimeout(() => {
      onSearchChange?.(searchInput.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, manualSearch, onSearchChange]);

  /*
   * -------------------------------------------------------
   * Validate search input
   * -------------------------------------------------------
   */

  const isValidSearchValue = (value: string) => {
    /*
     * Maximum length
     */
    if (searchMaxLength !== undefined && value.length > searchMaxLength) {
      return false;
    }

    /*
     * Allowed characters
     */
    if (searchPattern !== undefined && !searchPattern.test(value)) {
      return false;
    }

    return true;
  };

  /*
   * -------------------------------------------------------
   * Search handler
   * -------------------------------------------------------
   */

  const handleSearch = (value: string) => {
    /*
     * Reject invalid characters / length.
     */
    if (!isValidSearchValue(value)) {
      return;
    }

    /*
     * Apply configured maximum length.
     */
    const finalValue =
      searchMaxLength !== undefined ? value.slice(0, searchMaxLength) : value.slice(0, 100);

    /*
     * Manual / server-side search
     */
    if (manualSearch) {
      setSearchInput(finalValue);
      return;
    }

    /*
     * Client-side TanStack search
     */
    if (!searchKey) return;

    table.getColumn(searchKey)?.setFilterValue(finalValue);
  };

  /*
   * -------------------------------------------------------
   * Render
   * -------------------------------------------------------
   */

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search */}

      <div className="flex flex-1 items-center">
        {enableSearch && (
          <div className="relative w-full max-w-md">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

            <Input
              placeholder={searchPlaceholder}
              value={manualSearch ? searchInput : searchValue}
              maxLength={searchMaxLength}
              onChange={(event) => {
                handleSearch(event.target.value);
              }}
              onKeyDown={(event) => {
                if (manualSearch && event.key === 'Enter') {
                  onSearchChange?.(searchInput.trim());
                }
              }}
              className="pl-10"
            />
          </div>
        )}
      </div>

      {/* Right-side controls */}

      <div className="flex flex-wrap items-center justify-end gap-2">
        {/* Generic Filters */}

        {enableFiltering && filterOptions.length > 0 && (
          <FilterDropdown filters={filterOptions} values={filterValues} onChange={onFilterChange} />
        )}

        {/* Export Excel */}

        {enableExportExcel && onExportExcel && (
          <Button variant="outline" onClick={onExportExcel}>
            Export Excel
          </Button>
        )}

        {/* Export CSV */}

        {enableExportCSV && onExportCSV && (
          <Button variant="outline" onClick={onExportCSV}>
            Export CSV
          </Button>
        )}

        {/* Refresh */}

        {enableRefresh && onRefresh && (
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}

        {/* Columns */}

        {enableColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger >
              <Button variant="outline">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllLeafColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                    className="capitalize"
                  >
                    {(
                      column.columnDef.meta as {
                        label?: string;
                      }
                    )?.label ?? column.id.replace(/([A-Z])/g, ' $1')}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Custom toolbar */}

        {toolbar}
      </div>
    </div>
  );
}
