
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
  Package,
  PlusCircle,
} from "lucide-react";

import { useOrdersQuery } from "../hooks/useOrders";
import type { Order, OrderFilters } from "../types/orders.types";
import { OrderStatus } from "../types/orders.enums";

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

const initialFilters: OrderFilters = {
  search: "",
  status: undefined,
  paymentMethod: undefined,
  currency: undefined,
  minAmount: undefined,
  maxAmount: undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};

function formatDate(value: Date | string | undefined): string {
  if (!value) return "-";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-IN")}`;
  }
}

function getLabel(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getOrderStatusClass(status: string): string {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "PENDING":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    case "FAILED":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    case "REFUNDED":
      return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    case "CANCELLED":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  }
}

function getPaymentStatusClass(status?: Order["paymentStatus"]): string {
  switch (status) {
    case "PAID":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "FAILED":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    case "PROCESSING":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "PENDING":
    default:
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  }
}

export const OrderTablesPage: React.FC = () => {
  const router = useRouter();

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [search, setSearch] = useState(initialFilters.search ?? "");

  const filters = useMemo<OrderFilters>(() => {
    const getFilter = (id: string) =>
      columnFilters.find((filter) => filter.id === id)?.value;

    const status = getFilter("status");
    const paymentMethod = getFilter("paymentMethod");
    const currency = getFilter("currency");

    const minAmount = getFilter("minAmount");
    const maxAmount = getFilter("maxAmount");

    return {
      ...initialFilters,
      search,
      status:
        typeof status === "string"
          ? (status as OrderStatus)
          : undefined,
      paymentMethod:
        typeof paymentMethod === "string" ? paymentMethod : undefined,
      currency: typeof currency === "string" ? currency : undefined,
      minAmount:
        minAmount !== undefined && minAmount !== ""
          ? Number(minAmount)
          : undefined,
      maxAmount:
        maxAmount !== undefined && maxAmount !== ""
          ? Number(maxAmount)
          : undefined,
      page: 1,
    };
  }, [columnFilters, search]);

  const {
    data: orders,
    isLoading,
    isFetching,
  } = useOrdersQuery(filters);

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: "serialNo",
        header: "Sr. No.",
        enableSorting: false,
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "id",
        header: "Order ID",
        enableHiding: false,
        cell: ({ row }) => (
          <span className="font-mono text-xs font-medium">
            #{row.original.id.slice(0, 8)}
          </span>
        ),
      },
      {
        accessorKey: "title",
        header: "Order",
        enableHiding: false,
        cell: ({ row }) => (
          <div className="flex min-w-36 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {row.original.title || "Untitled order"}
              </p>
              <p className="text-xs text-muted-foreground">
                {row.original.items?.length ?? 0} item(s)
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "customer",
        header: "Customer",
        accessorFn: (order) => order.customer?.name ?? order.userId,
        cell: ({ row }) => (
          <div className="min-w-32">
            <p className="text-sm font-medium">
              {row.original.customer?.name || "Guest / Unknown"}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.original.customer?.email || row.original.userId}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm font-semibold tabular-nums">
            {formatCurrency(
              row.original.amount,
              row.original.currency || "INR",
            )}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Order Status",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className={getOrderStatusClass(row.original.status)}
          >
            {getLabel(String(row.original.status))}
          </Badge>
        ),
      },
      {
        accessorKey: "paymentStatus",
        header: "Payment",
        cell: ({ row }) => {
          const status = row.original.paymentStatus ?? "PENDING";

          return (
            <Badge
              variant="outline"
              className={getPaymentStatusClass(status)}
            >
              {getLabel(status)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Order Date",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {formatDate(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => {
          const order = row.original;

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
                    aria-label={`Actions for order ${order.id}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-44 border border-border bg-card"
                >
                  <DropdownMenuItem >
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex cursor-pointer items-center gap-2 text-xs font-medium"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Order
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

  const orderFilterOptions = useMemo<DataTableFilter[]>(
    () => [
      {
        key: "status",
        label: "Order Status",
        placeholder: "Select order status",
        options: Object.values(OrderStatus).map((status) => ({
          label: getLabel(String(status)),
          value: String(status),
        })),
      },
      {
        key: "paymentMethod",
        label: "Payment Method",
        placeholder: "Select payment method",
        options: [
          { label: "Razorpay", value: "RAZORPAY" },
          { label: "Cash on Delivery", value: "COD" },
          { label: "UPI", value: "UPI" },
          { label: "Card", value: "CARD" },
        ],
      },
      {
        key: "currency",
        label: "Currency",
        placeholder: "Select currency",
        options: [
          { label: "INR", value: "INR" },
          { label: "USD", value: "USD" },
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
    <PageWrapper className="animate-fade-in p-4 sm:p-6">
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Orders Management
            </h1>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              View customer orders, track payment status, and manage order
              fulfilment.
            </p>
          </div>

          <Button  className="flex items-center gap-2">
            <Link href="/orders/create">
              <PlusCircle className="h-4 w-4" />
              Create Order
            </Link>
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={orders ?? []}
          enableSearch
          manualSearch
          search={search}
          searchPlaceholder="Search orders..."
          onSearchChange={setSearch}
          loading={isLoading || isFetching}
          onRowClick={(order) => router.push(`/orders/${order.id}`)}
          filterOptions={orderFilterOptions}
          onFiltersChange={handleColumnFiltersChange}
          filters={columnFilters}
        />
      </div>
    </PageWrapper>
  );
};

export default OrderTablesPage;
