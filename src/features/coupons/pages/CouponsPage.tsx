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
  Trash2,
} from "lucide-react";

import { DataTable } from "@/components/tables/DataTable";
import { DataTableFilter } from "@/components/tables/FilterDropdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageWrapper from "@/components/wrappers/PageWrapper";
import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import { formatDate } from "@/utils/date";
import { Coupon } from "../types/coupon.type";
import {
  useCouponsQuery,
  useDeleteCouponMutation,
  useUpdateCouponStatusMutation,
} from "../hooks/useCoupon";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    const d = (value as { toDate: () => Date }).toDate();
    return d instanceof Date && !Number.isNaN(d.getTime()) ? d : null;
  }
  if (typeof value === "object" && value !== null) {
    const ts = value as { seconds?: unknown; _seconds?: unknown };
    const s = ts.seconds ?? ts._seconds;
    if (typeof s === "number" && Number.isFinite(s)) {
      return new Date(s * 1000);
    }
  }
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function formatExpiry(value: unknown): string {
  const d = toDate(value);
  return d ? formatDate(d) : "No expiry";
}

function formatDiscount(coupon: Coupon): string {
  if (coupon.discountType === "percentage") {
    return `${coupon.discountValue}%`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(coupon.discountValue);
}

function formatMinOrder(value?: number | null): string {
  if (!value) return "No min.";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function isCouponCurrentlyValid(coupon: Coupon): boolean {
  if (!coupon.isActive) return false;
  if (coupon.expiresAt) {
    const exp = toDate(coupon.expiresAt);
    if (!exp || exp.getTime() < Date.now()) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const CouponsPage: React.FC = () => {
  const router = useRouter();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [search, setSearch] = useState("");

  const { data: coupons, isLoading, isError, error, refetch, isFetching } =
    useCouponsQuery();

  const { mutate: deleteAsync } = useDeleteCouponMutation();
  const { mutate: toggleStatus } = useUpdateCouponStatusMutation();

  const filteredCoupons = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coupons ?? [];
    return (coupons ?? []).filter((c) =>
      [c.code, c.description ?? "", c.discountType, String(c.discountValue)].some(
        (v) => v.toLowerCase().includes(q),
      ),
    );
  }, [coupons, search]);

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
          const c = row.original;
          return (
            <div className="flex min-w-0 flex-col gap-1">
              <span className="font-bold tracking-wide">{c.code}</span>
              {c.description && (
                <span className="text-muted-foreground max-w-[240px] truncate text-xs">
                  {c.description}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "discountType",
        header: "Type",
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
        accessorKey: "minOrderAmount",
        header: "Min. Order",
        cell: ({ row }) => (
          <span className="text-muted-foreground whitespace-nowrap text-xs">
            {formatMinOrder(row.original.minOrderAmount)}
          </span>
        ),
      },
      {
        id: "usage",
        header: "Usage",
        cell: ({ row }) => {
          const c = row.original;
          return (
            <span className="text-muted-foreground whitespace-nowrap text-xs">
              {c.usageCount} / {c.usageLimit ?? "∞"}
            </span>
          );
        },
      },
      {
        id: "status",
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const c = row.original;
          const valid = isCouponCurrentlyValid(c);
          const label = !c.isActive ? "Inactive" : valid ? "Active" : "Expired";
          const cls = !c.isActive
            ? "bg-muted text-muted-foreground"
            : valid
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
              : "border-amber-500/20 bg-amber-500/10 text-amber-600";
          return (
            <Badge variant="outline" className={cls}>
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
        id: "actions",
        header: "Actions",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
          const c = row.original;
          return (
            <div
              data-row-action
              className="flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Actions for coupon ${c.code}`}
                    className="border-border/20 h-8 w-8 rounded-lg border"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="bg-card border-border w-48 border"
                >
                  <DropdownMenuItem >
                    <Link
                      href={`/console/coupons/${c.id}`}
                      className="flex cursor-pointer items-center gap-2 text-xs font-medium"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Coupon
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem >
                    <Link
                      href={`/console/coupons/${c.id}/edit`}
                      className="flex cursor-pointer items-center gap-2 text-xs font-medium"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit Coupon
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() =>
                      toggleStatus({ id: c.id, isActive: !c.isActive })
                    }
                    className="cursor-pointer text-xs font-medium"
                  >
                    {c.isActive ? "Deactivate" : "Activate"}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => deleteAsync(c.id)}
                    className="text-destructive focus:text-destructive cursor-pointer text-xs font-medium"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [deleteAsync, toggleStatus],
  );

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
    setColumnFilters((prev) =>
      typeof updater === "function" ? updater(prev) : updater,
    );
  };

  return (
    <PageWrapper className="animate-fade-in p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <TicketPercent className="text-muted-foreground h-6 w-6" />
              <h1 className="text-3xl font-extrabold tracking-tight">
                Coupons
              </h1>
            </div>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              Create and manage discount coupons, monitor validity, and control
              promotional offers.
            </p>
          </div>
        </div>

        {/* Error */}
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

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredCoupons}
          toolbar={
            <>
              <Link href="/console/coupons/create">
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
            router.push(`/console/coupons/${coupon.id}`);
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
