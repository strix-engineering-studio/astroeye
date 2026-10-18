"use client";

import React, { useState } from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  Updater,
} from "@tanstack/react-table";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { MoreHorizontal, Eye, PlusCircle } from "lucide-react";

import { useOrdersQuery, useDeleteOrderMutation } from "../hooks/useOrders";

import type { Order, OrderFilters } from "../types/orders.types";

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
import { formatDate } from "@/utils/date";

/**
 * --------------------------------------------------------------------------
 * Initial Filters
 * --------------------------------------------------------------------------
 */

const initialFilters: OrderFilters = {
  search: "",
  userId: undefined,
  resourceId: undefined,
  creatorId: undefined,
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

/**
 * --------------------------------------------------------------------------
 * Status Badge
 * --------------------------------------------------------------------------
 */

const getStatusVariant = (
  status: Order["status"],
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "completed":
      return "default";

    case "pending":
      return "secondary";

    case "failed":
      return "destructive";

    case "refunded":
      return "outline";

    default:
      return "outline";
  }
};

/**
 * --------------------------------------------------------------------------
 * Orders Page
 * --------------------------------------------------------------------------
 */

export const OrdersPage: React.FC<{
  filters?: OrderFilters;
}> = ({ filters: initialFiltersProp }) => {
  const router = useRouter();

  const [filters, setFilters] = useState<OrderFilters>(
    initialFiltersProp ?? initialFilters,
  );

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useOrdersQuery(filters);

  const { mutate: deleteOrder, isPending: isDeletingOrder } =
    useDeleteOrderMutation();

  /**
   * ------------------------------------------------------------------------
   * Columns
   * ------------------------------------------------------------------------
   */

  const columns: ColumnDef<Order>[] = [
    /**
     * Serial Number
     */
    {
      id: "serialNo",
      header: "Sr. No.",
      cell: ({ row }) => row.index + 1,
    },

    /**
     * Order
     */
    {
      accessorKey: "title",
      header: "Order",

      cell: ({ row }) => {
        const order = row.original;

        return (
          <div className="min-w-0">
            <p className="text-foreground font-bold">{order.title}</p>

            <p className="text-muted-foreground max-w-[220px] truncate text-xs">
              Order ID: {order.id}
            </p>
          </div>
        );
      },
    },

    /**
     * User
     */
    {
      accessorKey: "userId",
      header: "User",

      cell: ({ row }) => {
        const userId = row.getValue("userId") as string;

        return (
          <span className="text-muted-foreground max-w-[150px] truncate text-xs font-medium">
            {userId}
          </span>
        );
      },
    },

    /**
     * Resource
     */
    {
      accessorKey: "resourceId",
      header: "Resource",

      cell: ({ row }) => {
        const resourceId = row.getValue("resourceId") as string;

        return (
          <span className="text-muted-foreground max-w-[150px] truncate text-xs font-medium">
            {resourceId}
          </span>
        );
      },
    },

    /**
     * Amount
     */
    {
      accessorKey: "amount",
      header: "Amount",

      cell: ({ row }) => {
        const order = row.original;

        return (
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {order.currency} {order.amount.toFixed(2)}
          </span>
        );
      },
    },

    /**
     * Status
     */
    {
      accessorKey: "status",
      header: "Status",

      cell: ({ row }) => {
        const status = row.getValue("status") as Order["status"];

        return (
          <Badge
            variant={getStatusVariant(status)}
            className="text-xs font-semibold capitalize"
          >
            {status}
          </Badge>
        );
      },
    },

    /**
     * Payment Method
     */
    {
      accessorKey: "paymentMethod",
      header: "Payment",

      cell: ({ row }) => {
        const paymentMethod = row.getValue("paymentMethod") as
          string | undefined;

        return paymentMethod ? (
          <span className="text-muted-foreground text-xs font-medium">
            {paymentMethod}
          </span>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        );
      },
    },

    /**
     * Created At
     */
    {
      accessorKey: "createdAt",
      header: "Created At",

      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string | Date;

        return (
          <span className="text-muted-foreground text-xs">
            {formatDate(createdAt)}
          </span>
        );
      },
    },

    /**
     * Actions
     */
    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="border-border/20 h-8 w-8 rounded-lg border"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-card border-border w-48 border"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {/* View */}
              <DropdownMenuItem >
                <Link
                  href={`/orders/${order.id}`}
                  className="flex cursor-pointer items-center rounded-md text-xs font-medium"
                >
                  <Eye className="mr-2 h-3 w-3" />
                  View Details
                </Link>
              </DropdownMenuItem>

              {/* Edit */}
              <DropdownMenuItem >
                <Link
                  href={`/orders/${order.id}/edit`}
                  className="flex cursor-pointer items-center rounded-md text-xs font-medium"
                >
                  Edit Order
                </Link>
              </DropdownMenuItem>

              {/* Delete */}
              <DropdownMenuItem
                className="text-destructive cursor-pointer rounded-md text-xs font-medium"
                onClick={(event) => {
                  event.stopPropagation();
                  setOrderToDelete(order);
                }}
              >
                Delete Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  /**
   * --------------------------------------------------------------------------
   * Filters
   * --------------------------------------------------------------------------
   */

  const orderFilterOptions: DataTableFilter[] = [
    {
      key: "status",
      label: "Status",
      placeholder: "Select status",

      options: [
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Completed",
          value: "completed",
        },
        {
          label: "Failed",
          value: "failed",
        },
        {
          label: "Refunded",
          value: "refunded",
        },
      ],
    },

    {
      key: "paymentMethod",
      label: "Payment",
      placeholder: "Select payment method",

      options: [
        {
          label: "Razorpay",
          value: "razorpay",
        },
        {
          label: "UPI",
          value: "upi",
        },
        {
          label: "Card",
          value: "card",
        },
        {
          label: "Cash",
          value: "cash",
        },
      ],
    },

    {
      key: "currency",
      label: "Currency",
      placeholder: "Select currency",

      options: [
        {
          label: "INR",
          value: "INR",
        },
        {
          label: "USD",
          value: "USD",
        },
      ],
    },
  ];

  /**
   * --------------------------------------------------------------------------
   * Filter Handler
   * --------------------------------------------------------------------------
   */

  const handleColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    setColumnFilters((previous) => {
      const next = typeof updater === "function" ? updater(previous) : updater;

      const getFilter = (id: string) =>
        next.find((filter) => filter.id === id)?.value;

      setFilters((previousFilters) => ({
        ...previousFilters,

        status: getFilter("status") as OrderFilters["status"] | undefined,

        paymentMethod: getFilter("paymentMethod") as
          OrderFilters["paymentMethod"] | undefined,

        currency: getFilter("currency") as OrderFilters["currency"] | undefined,

        page: 1,
      }));

      return next;
    });
  };

  /**
   * --------------------------------------------------------------------------
   * Render
   * --------------------------------------------------------------------------
   */

  const handleDeleteOrder = () => {
    if (!orderToDelete) {
      return;
    }

    deleteOrder(orderToDelete.id, {
      onSuccess: () => {
        setOrderToDelete(null);
      },
    });
  };

  return (
    <DataTable
      columns={columns}
      data={orders}
      toolbar={<div />}
      enableSearch={true}
      manualSearch={true}
      search={filters.search}

      searchPlaceholder="Search orders by title..."
      onSearchChange={(value) => {
        setFilters((previous) => ({
          ...previous,
          search: value,
          page: 1,
        }));
      }}
      loading={isLoading || isFetching}
      onRowClick={(order) => {
        router.push(`/orders/${order.id}`);
      }}
      filterOptions={orderFilterOptions}
      onFiltersChange={handleColumnFiltersChange}
      filters={columnFilters}
    />
  );
};

export default OrdersPage;
