
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
  Eye,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";


import { DataTable } from "@/components/tables/DataTable";
import { DataTableFilter } from "@/components/tables/FilterDropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageWrapper from "@/components/wrappers/PageWrapper";
import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import { PaymentFilters, PaymentType } from "../types/razorpay.types";
import { usePaymentsQuery } from "../hooks/usePayment";

const initialFilters: PaymentFilters = {
  search: "",
  status: undefined,
  currency: undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};

type PaymentStatus =
  | "PENDING"
  | "CREATED"
  | "SUCCESS"
  | "FAILED"
  | "REFUNDED"
  | "AUTHORIZED"
  | "CAPTURED"
  | "UNKNOWN";

function normalizeStatus(value: unknown): PaymentStatus {
  if (typeof value !== "string") return "UNKNOWN";

  const status = value.toUpperCase();

  const statuses: PaymentStatus[] = [
    "PENDING",
    "CREATED",
    "SUCCESS",
    "FAILED",
    "REFUNDED",
    "AUTHORIZED",
    "CAPTURED",
  ];

  return statuses.includes(status as PaymentStatus)
    ? (status as PaymentStatus)
    : "UNKNOWN";
}

function getStatusClasses(status: PaymentStatus): string {
  switch (status) {
    case "SUCCESS":
    case "CAPTURED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600";

    case "PENDING":
    case "CREATED":
    case "AUTHORIZED":
      return "border-amber-500/20 bg-amber-500/10 text-amber-600";

    case "FAILED":
      return "border-red-500/20 bg-red-500/10 text-red-600";

    case "REFUNDED":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600";

    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

function formatPaymentDate(value: unknown): string {
  if (!value) return "-";

  let date: Date | null = null;

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    date = (value as { toDate: () => Date }).toDate();
  } else if (
    typeof value === "object" &&
    value !== null &&
    "seconds" in value &&
    typeof value.seconds === "number"
  ) {
    date = new Date(value.seconds * 1000);
  } else {
    const parsed = new Date(value as string | number | Date);

    if (!Number.isNaN(parsed.getTime())) {
      date = parsed;
    }
  }

  if (!date || Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Astroeye payment amounts are stored in paise.
 * Example: 100000 paise = ₹1,000.00.
 */
function formatPaymentAmount(
  amount: unknown,
  currency: unknown,
): string {
  const value = Number(amount);
  const currencyCode =
    typeof currency === "string" && currency.trim()
      ? currency.toUpperCase()
      : "INR";

  if (!Number.isFinite(value) || value < 0) return "-";

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  } catch {
    return `${currencyCode} ${(value / 100).toFixed(2)}`;
  }
}

function shortenId(value: unknown, length = 12): string {
  if (typeof value !== "string" || !value.trim()) return "-";

  if (value.length <= length) return value;

  return `${value.slice(0, length)}…`;
}

export const PaymentsPage: React.FC = () => {
  const router = useRouter();

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([]);

  const [search, setSearch] = useState(initialFilters.search);

  const filters = useMemo<PaymentFilters>(() => {
    const getFilter = (id: string) =>
      columnFilters.find((filter) => filter.id === id)?.value;

    return {
      ...initialFilters,
      search,
      status: getFilter("status") as
        | PaymentFilters["status"]
        | undefined,
      currency: getFilter("currency") as
        | PaymentFilters["currency"]
        | undefined,
      page: 1,
    };
  }, [columnFilters, search]);

  const {
    data: payments,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = usePaymentsQuery(filters);

  const columns = useMemo<ColumnDef<PaymentType>[]>(
    () => [
      {
        id: "serialNo",
        header: "Sr. No.",
        enableSorting: false,
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "id",
        header: "Payment ID",
        enableHiding: false,
        cell: ({ row }) => (
          <span
            className="font-mono text-xs font-medium"
            title={row.original.id}
          >
            {shortenId(row.original.id)}
          </span>
        ),
      },
      {
        accessorKey: "orderId",
        header: "Order ID",
        enableHiding: false,
        cell: ({ row }) => (
          <Link
            href={`/orders/${row.original.orderId}`}
            onClick={(event) => event.stopPropagation()}
            className="font-mono text-xs font-medium text-primary hover:underline"
            title={row.original.orderId}
          >
            {shortenId(row.original.orderId)}
          </Link>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm font-semibold">
            {formatPaymentAmount(
              row.original.amount,
              row.original.currency,
            )}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Payment Status",
        cell: ({ row }) => {
          const status = normalizeStatus(row.original.status);

          return (
            <Badge
              variant="outline"
              className={getStatusClasses(status)}
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "razorpayOrderId",
        header: "Razorpay Order",
        cell: ({ row }) => (
          <span
            className="font-mono text-xs text-muted-foreground"
            title={row.original.razorpayOrderId || ""}
          >
            {shortenId(row.original.razorpayOrderId)}
          </span>
        ),
      },
      {
        accessorKey: "razorpayPaymentId",
        header: "Razorpay Payment",
        cell: ({ row }) => (
          <span
            className="font-mono text-xs text-muted-foreground"
            title={row.original.razorpayPaymentId || ""}
          >
            {shortenId(row.original.razorpayPaymentId)}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {formatPaymentDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
          const payment = row.original;

          return (
            <div
              data-row-action
              className="flex items-center justify-center"
              onClick={(event) => event.stopPropagation()}
              onPointerDown={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg border border-border/20"
                    aria-label="Payment actions"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-48 border border-border bg-card"
                >
                  <DropdownMenuItem >
                    <Link
                      href={`/payments/${payment.id}`}
                      className="flex cursor-pointer items-center gap-2 text-xs font-medium"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Payment
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onSelect={() => {
                      router.push(`/orders/${payment.orderId}`);
                    }}
                  >
                    <Eye className="mr-2 h-3.5 w-3.5" />
                    View Order
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [router],
  );

  const paymentFilterOptions = useMemo<DataTableFilter[]>(
    () => [
      {
        key: "status",
        label: "Payment Status",
        placeholder: "Select status",
        options: [
          { label: "Pending", value: "PENDING" },
          { label: "Created", value: "CREATED" },
          { label: "Success", value: "SUCCESS" },
          { label: "Failed", value: "FAILED" },
          { label: "Authorized", value: "AUTHORIZED" },
          { label: "Captured", value: "CAPTURED" },
          { label: "Refunded", value: "REFUNDED" },
        ],
      },
      {
        key: "currency",
        label: "Currency",
        placeholder: "Select currency",
        options: [
          { label: "INR", value: "INR" },
        ],
      },
    ],
    [],
  );

  const handleColumnFiltersChange = (
    updater: Updater<ColumnFiltersState>,
  ) => {
    setColumnFilters((previous) =>
      typeof updater === "function" ? updater(previous) : updater,
    );
  };

  return (
    <PageWrapper className="animate-fade-in p-6">
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Payments Management
            </h1>

            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Review product-order payments, Razorpay references, and
              payment statuses.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {isError && (
          <div className="flex flex-col gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-destructive">
              {error instanceof Error
                ? error.message
                : "Unable to load payments."}
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
            >
              Retry
            </Button>
          </div>
        )}

        <DataTable
          columns={columns}
          data={payments ?? []}
          enableSearch
          manualSearch
          search={search}
          searchPlaceholder="Search payment or order ID..."
          onSearchChange={setSearch}
          loading={isLoading || isFetching}
          onRowClick={(payment) => {
            router.push(`/payments/${payment.id}`);
          }}
          filterOptions={paymentFilterOptions}
          onFiltersChange={handleColumnFiltersChange}
          filters={columnFilters}
        />
      </div>
    </PageWrapper>
  );
};

export default PaymentsPage;

