"use client";

import React, { useMemo, useState } from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  Updater,
} from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  PlusCircle,
  Eye,
  Pencil,
  TicketPercent,
} from "lucide-react";

import { DataTable } from "@/components/tables/DataTable";
import { DataTableFilter } from "@/components/tables/FilterDropdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageWrapper from "@/components/wrappers/PageWrapper";
import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import { formatDate } from "@/utils/date";
import { Coupon } from "../types/coupon.type";
import { useCouponsQuery } from "../hooks/useCoupon";

/**
 * Safely converts supported API and Firestore date values to Date.
 */
function toDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    const date = (value as { toDate: () => Date }).toDate();

    return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
  }

  if (typeof value === "object" && value !== null) {
    const timestamp = value as {
      seconds?: unknown;
      _seconds?: unknown;
      nanoseconds?: unknown;
      _nanoseconds?: unknown;
    };

    const seconds = timestamp.seconds ?? timestamp._seconds;

    if (typeof seconds === "number" && Number.isFinite(seconds)) {
      const nanoseconds = timestamp.nanoseconds ?? timestamp._nanoseconds ?? 0;

      const milliseconds =
        seconds * 1000 +
        (typeof nanoseconds === "number" ? nanoseconds / 1_000_000 : 0);

      const date = new Date(milliseconds);

      return Number.isNaN(date.getTime()) ? null : date;
    }
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

/**
 * Format coupon expiry consistently.
 */
function formatExpiry(value: unknown): string {
  const date = toDate(value);

  return date ? formatDate(date) : "No expiry";
}

/**
 * Display discount values using the coupon's discount type.
 */
function formatDiscount(coupon: Coupon): string {
  if (coupon.discountType === "percentage") {
    return `${coupon.discountValue}%`;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(coupon.discountValue);
}

/**
 * Format the minimum order amount.
 */
function formatMinimumOrder(value?: number): string {
  if (value === undefined || value === null) {
    return "No minimum";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Determine whether a coupon is currently usable based on its
 * active flag and expiry date.
 */
function isCouponCurrentlyValid(coupon: Coupon): boolean {
  if (!coupon.isActive) {
    return false;
  }

  if (!coupon.expiresAt) {
    return true;
  }

  const expiryDate = toDate(coupon.expiresAt);

  if (!expiryDate) {
    return false;
  }

  return expiryDate.getTime() >= Date.now();
}

export const CouponsPage: React.FC = () => {
  const router = useRouter();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [search, setSearch] = useState("");

  const {
    data: coupons,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useCouponsQuery();

  /**
   * Search locally because useCouponsQuery fetches the full list
   * rather than sending search filters to the API.
   */
  const filteredCoupons = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return coupons ?? [];
    }

    return (coupons ?? []).filter((coupon) => {
      return [
        coupon.code,
        coupon.description ?? "",
        coupon.discountType,
        String(coupon.discountValue),
      ].some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }, [coupons, search]);

  /**
   * Keep table column definitions stable between renders.
   */
  const columns = useMemo<ColumnDef<Coupon>[]>(
    () => [
      {
        id: "serialNo",
        header: "Sr. No.",
        enableSorting: false,
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "code",
        header: "Coupon Code",
        enableHiding: false,
        cell: ({ row }) => {
          const coupon = row.original;

          return (
            <div className="flex min-w-0 flex-col gap-1">
              <span className="font-bold tracking-wide">{coupon.code}</span>

              {coupon.description && (
                <span className="text-muted-foreground max-w-[240px] truncate text-xs">
                  {coupon.description}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "discountType",
        header: "Discount Type",
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.original.discountType}
          </Badge>
        ),
      },
      {
        accessorKey: "discountValue",
        header: "Discount",
        cell: ({ row }) => (
          <span className="font-semibold whitespace-nowrap">
            {formatDiscount(row.original)}
          </span>
        ),
      },
      {
        accessorKey: "minimumOrderAmount",
        header: "Minimum Order",
        cell: ({ row }) => (
          <span className="text-muted-foreground whitespace-nowrap text-xs">
            {formatMinimumOrder(row.original.minimumOrderAmount)}
          </span>
        ),
      },
      {
        id: "status",
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const coupon = row.original;
          const currentlyValid = isCouponCurrentlyValid(coupon);

          const label = !coupon.isActive
            ? "Inactive"
            : currentlyValid
              ? "Active"
              : "Expired";

          const className = !coupon.isActive
            ? "bg-muted text-muted-foreground"
            : currentlyValid
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
              : "border-amber-500/20 bg-amber-500/10 text-amber-600";

          return (
            <Badge variant="outline" className={className}>
              {label}
            </Badge>
          );
        },
      },
      {
        accessorKey: "expiresAt",
        header: "Expires At",
        cell: ({ row }) => (
          <span className="text-muted-foreground whitespace-nowrap text-xs">
            {formatExpiry(row.original.expiresAt)}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
          const createdAt = toDate(row.original.createdAt);

          return (
            <span className="text-muted-foreground whitespace-nowrap text-xs">
              {createdAt ? formatDate(createdAt) : "-"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
          const coupon = row.original;

          return (
            <div
              data-row-action
              className="flex items-center justify-center"
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Actions for coupon ${coupon.code}`}
                    className="border-border/20 h-8 w-8 rounded-lg border"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="bg-card border-border w-48 border"
                >
                  <DropdownMenuItem>
                    <Link
                      href={`/coupons/${coupon.id}`}
                      className="flex cursor-pointer items-center gap-2 text-xs font-medium"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Coupon
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Link
                      href={`/coupons/${coupon.id}/edit`}
                      className="flex cursor-pointer items-center gap-2 text-xs font-medium"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit Coupon
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [],
  );

  /**
   * Coupon-specific table filters.
   */
  const couponFilterOptions = useMemo<DataTableFilter[]>(
    () => [
      {
        key: "discountType",
        label: "Discount Type",
        placeholder: "Select discount type",
        options: [
          { label: "Percentage", value: "percentage" },
          { label: "Fixed Amount", value: "fixed" },
        ],
      },
      {
        key: "isActive",
        label: "Status",
        placeholder: "Select status",
        options: [
          { label: "Active", value: "true" },
          { label: "Inactive", value: "false" },
        ],
      },
    ],
    [],
  );

  const handleColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    setColumnFilters((previous) =>
      typeof updater === "function" ? updater(previous) : updater,
    );
  };

  return (
    <PageWrapper className="animate-fade-in p-6">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <TicketPercent className="text-muted-foreground h-6 w-6" />

              <h1 className="text-3xl font-extrabold tracking-tight">
                Coupons Management
              </h1>
            </div>

            <p className="text-muted-foreground mt-1 text-sm font-medium">
              Create and manage discount coupons, monitor validity, and control
              promotional offers.
            </p>
          </div>
        </div>

        {/* Error state */}
        {isError && (
          <div
            role="alert"
            className="border-destructive/30 bg-destructive/5 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-destructive text-sm">
              {error instanceof Error
                ? error.message
                : "Failed to load coupons."}
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Coupons table */}
        <DataTable
          columns={columns}
          data={filteredCoupons}
          toolbar={
            <>
              <Link href="/coupons/create">
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Coupon
                </Button>
              </Link>
            </>
          }
          enableSearch={true}
          manualSearch={true}
          search={search}
          searchPlaceholder="Search coupons..."
          onSearchChange={setSearch}
          loading={isLoading || isFetching}
          onRowClick={(coupon) => {
            router.push(`/coupons/${coupon.id}`);
          }}
          filterOptions={couponFilterOptions}
          onFiltersChange={handleColumnFiltersChange}
          filters={columnFilters}
        />
      </div>
    </PageWrapper>
  );
};

export default CouponsPage;
