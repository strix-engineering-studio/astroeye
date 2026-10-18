
"use client";

import { useMemo, useState } from "react";
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
  Pencil,
  PlusCircle,
  Trash2,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

import type { Product } from "../types/product.type";
import {
  useProductsQuery,
  useUpdateProductStatusMutation,
  useDeleteProductMutation,
} from "../hooks/useProduct";

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

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
}

function formatDate(value: unknown): string {
  if (!value) return "-";

  let date: Date | null = null;

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    date = value.toDate();
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

function formatCategory(categoryId: string): string {
  return categoryId
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export const ProductTablePage: React.FC = () => {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>([]);

  const statusFilter = columnFilters.find(
    (filter) => filter.id === "isPublished",
  )?.value;

  const {
    data: products,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useProductsQuery({
    all: true,
    search: search.trim() || undefined,
  });

  const updateStatusMutation = useUpdateProductStatusMutation();
  const deleteProductMutation = useDeleteProductMutation();

  const filteredProducts = useMemo(() => {
    const result = products ?? [];

    if (statusFilter === undefined) {
      return result;
    }

    return result.filter(
      (product) => String(product.isPublished) === String(statusFilter),
    );
  }, [products, statusFilter]);

  const handleStatusChange = (product: Product) => {
    updateStatusMutation.mutate({
      id: product.id,
      isPublished: !product.isPublished,
    });
  };

  const handleDelete = (product: Product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    deleteProductMutation.mutate(product.id);
  };

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "serialNo",
        header: "Sr. No.",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "name",
        header: "Product",
        enableHiding: false,
        cell: ({ row }) => {
          const product = row.original;

          return (
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0">
                <p className="max-w-[240px] truncate font-semibold">
                  {product.name}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  ID: {product.id}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "categoryId",
        header: "Category",
        cell: ({ row }) => (
          <Badge variant="outline" className="font-medium">
            {formatCategory(row.original.categoryId || "-")}
          </Badge>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm font-semibold">
            {formatPrice(row.original.price)}
          </span>
        ),
      },
      {
        accessorKey: "stockQuantity",
        header: "Stock",
        cell: ({ row }) => {
          const stock = row.original.stockQuantity;

          return (
            <Badge
              variant="outline"
              className={
                stock <= 0
                  ? "border-red-500/20 bg-red-500/10 text-red-600"
                  : stock <= 5
                    ? "border-amber-500/20 bg-amber-500/10 text-amber-600"
                    : "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
              }
            >
              {stock <= 0 ? "Out of stock" : stock}
            </Badge>
          );
        },
      },
      {
        accessorKey: "isPublished",
        id: "isPublished",
        header: "Status",
        cell: ({ row }) => {
          const isPublished = row.original.isPublished;

          return (
            <Badge
              variant="outline"
              className={
                isPublished
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                  : "border-amber-500/20 bg-amber-500/10 text-amber-600"
              }
            >
              {isPublished ? "Published" : "Draft"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
          <span className="text-muted-foreground whitespace-nowrap text-xs">
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
          const product = row.original;

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
                    aria-label={`Actions for ${product.name}`}
                    className="h-8 w-8 rounded-lg border border-border/20"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-52 border border-border bg-card"
                >
                  <DropdownMenuItem >
                    <Link
                      href={`/console/products/${encodeURIComponent(product.id)}`}
                      className="flex cursor-pointer items-center gap-2 text-xs font-medium"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Product
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem >
                    <Link
                      href={`/console/products/${encodeURIComponent(product.id)}/edit`}
                      className="flex cursor-pointer items-center gap-2 text-xs font-medium"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit Product
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    disabled={updateStatusMutation.isPending}
                    onSelect={() => handleStatusChange(product)}
                    className="cursor-pointer text-xs font-medium"
                  >
                    {product.isPublished ? (
                      <>
                        <EyeOff className="mr-2 h-3.5 w-3.5" />
                        Unpublish Product
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-3.5 w-3.5" />
                        Publish Product
                      </>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    disabled={deleteProductMutation.isPending}
                    onSelect={() => handleDelete(product)}
                    className="cursor-pointer text-xs font-medium text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete Product
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [
      updateStatusMutation,
      deleteProductMutation,
    ],
  );

  const productFilterOptions = useMemo<DataTableFilter[]>(
    () => [
      {
        key: "isPublished",
        label: "Status",
        placeholder: "Select status",
        options: [
          { label: "Published", value: "true" },
          { label: "Draft", value: "false" },
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
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Products Management
            </h1>

            <p className="text-muted-foreground mt-1 text-sm font-medium">
              Manage your catalog, prices, stock and publication status.
            </p>
          </div>

          <Button  className="flex items-center gap-2">
            <Link href="/console/products/create">
              <PlusCircle className="h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        {/* Query errors */}
        {isError && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold">Products could not be loaded</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {error instanceof Error
                  ? error.message
                  : "Please try again."}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Products table */}
        <DataTable
          columns={columns}
          data={filteredProducts}
          enableSearch
          manualSearch
          search={search}
          searchPlaceholder="Search products..."
          onSearchChange={setSearch}
          loading={isLoading || isFetching}
          onRowClick={(product) => {
            router.push(
              `/console/products/${encodeURIComponent(product.id)}`,
            );
          }}
          filterOptions={productFilterOptions}
          onFiltersChange={handleColumnFiltersChange}
          filters={columnFilters}
          toolbar={
            <Button  className="flex items-center gap-2">
              <Link href="/console/products/create">
                <PlusCircle className="h-4 w-4" />
                Add Product
              </Link>
            </Button>
          }
        />

        <p className="text-muted-foreground text-xs">
          Showing {filteredProducts.length} product
          {filteredProducts.length === 1 ? "" : "s"} matching the current filters.
        </p>
      </div>
    </PageWrapper>
  );
};

export default ProductTablePage;
