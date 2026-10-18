import { Filter } from 'lucide-react';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export interface DataTableFilter {
  key: string;
  label: string;
  placeholder?: string;

  options: {
    label: string;
    value: string;
  }[];
}

export type DataTableFilterValues = Record<string, string | undefined>;

interface FilterDropdownProps {
  filters: DataTableFilter[];
  values?: DataTableFilterValues;

  onChange?: (key: string, value: string | undefined) => void;
}

export function FilterDropdown({ filters, values = {}, onChange }: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <Button variant="outline" size="icon" aria-label="Filters">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filters</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>
          <p>Filters</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <div className="space-y-4">
            {filters.map((filter) => (
              <div key={filter.key} className="px-2 py-1.5">
                <DropdownMenuLabel>{filter.label}</DropdownMenuLabel>
                {/* <label className="mb-2 block text-sm font-medium">{filter.label}</label> */}

                <Select
                  value={values[filter.key] ?? 'ALL'}
                  onValueChange={(value) => {
                    onChange?.(filter.key, value === 'ALL' ? undefined : value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={filter.placeholder ?? filter.label} />
                  </SelectTrigger>

                  <SelectContent position="popper" align="start">
                    <SelectItem value="ALL">All</SelectItem>

                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
