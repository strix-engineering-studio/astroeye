"use client";

import React, { useState } from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  Updater,
} from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { MoreHorizontal, PlusCircle, Eye, Crown } from "lucide-react";

import {
  useResourcesQuery,
  useDeleteResourceMutation,
} from "../hooks/useResources";

import type { Resource, ResourceFilters } from "../types/resources.types";

import { DataTable } from "@/components/tables/DataTable";
import { DataTableFilter } from "@/components/tables/FilterDropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import PageWrapper from "@/components/wrappers/PageWrapper";
import { formatDate } from "@/utils/date";

const initialFilters: ResourceFilters = {
  search: "",
  category: undefined,
  fileType: undefined,
  isPremium: undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};

export const ResourcesPage: React.FC<{ filters?: ResourceFilters }> = ({
  filters: initialFiltersProp,
}) => {
  const router = useRouter();

  const [filters, setFilters] = useState<ResourceFilters>(
    initialFiltersProp ?? initialFilters,
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(
    null,
  );

  const {
    data: resources = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useResourcesQuery(filters);

  const { mutate: deleteResource, isPending: isDeletingResource } =
    useDeleteResourceMutation();

  const columns: ColumnDef<Resource>[] = [
    {
      id: "serialNo",
      header: "Sr. No.",
      cell: ({ row }) => row.index + 1,
    },

    {
      accessorKey: "title",
      header: "Title",

      cell: ({ row }) => {
        const resource = row.original;

        return (
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-foreground font-bold">{resource.title}</p>

              <p className="text-muted-foreground max-w-[200px] truncate text-xs">
                {resource.description}
              </p>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "category",
      header: "Category",

      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs font-semibold">
          {row.getValue("category")}
        </Badge>
      ),
    },

    {
      accessorKey: "fileType",
      header: "Type",

      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs font-medium">
          {row.getValue("fileType")}
        </span>
      ),
    },

    {
      accessorKey: "downloads",
      header: "Downloads",

      cell: ({ row }) => (
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
          {row.getValue("downloads")}
        </span>
      ),
    },

    {
      accessorKey: "isPremium",
      header: "Premium",

      cell: ({ row }) =>
        row.getValue("isPremium") ? (
          <Crown className="h-4 w-4 text-amber-500" />
        ) : (
          <span className="text-muted-foreground text-xs">Free</span>
        ),
    },

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

    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        const resource = row.original;

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
              <DropdownMenuItem asChild>
                <Link
                  href={`/resources/${resource.id}`}
                  className="flex cursor-pointer items-center rounded-md text-xs font-medium"
                >
                  <Eye className="mr-2 h-3 w-3" />
                  View Details
                </Link>
              </DropdownMenuItem>

              {/* Edit */}
              <DropdownMenuItem asChild>
                <Link
                  href={`/resources/${resource.id}/edit`}
                  className="flex cursor-pointer items-center rounded-md text-xs font-medium"
                >
                  Edit Resource
                </Link>
              </DropdownMenuItem>

              {/* Delete */}
              <DropdownMenuItem
                className="text-destructive cursor-pointer rounded-md text-xs font-medium"
                onClick={(event) => {
                  event.stopPropagation();
                  setResourceToDelete(resource);
                }}
              >
                Delete Resource
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const resourceFilterOptions: DataTableFilter[] = [
    {
      key: "category",
      label: "Category",
      placeholder: "Select category",
      options: [
        { label: "Audio", value: "audio" },
        { label: "Document", value: "document" },
        { label: "Guide", value: "guide" },
        { label: "Template", value: "template" },
        { label: "Video", value: "video" },
      ],
    },
    {
      key: "fileType",
      label: "File Type",
      placeholder: "Select file type",
      options: [
        { label: "PDF", value: "pdf" },
        { label: "Video", value: "video" },
        { label: "Audio", value: "audio" },
        { label: "Image", value: "image" },
        { label: "Document", value: "doc" },
      ],
    },
    {
      key: "isPremium",
      label: "Access",
      placeholder: "Select access",
      options: [
        { label: "Premium", value: "true" },
        { label: "Free", value: "false" },
      ],
    },
  ];

  const handleColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
    setColumnFilters((previous) => {
      const next = typeof updater === "function" ? updater(previous) : updater;
      const getFilter = (id: string) =>
        next.find((filter) => filter.id === id)?.value;

      setFilters((previousFilters) => ({
        ...previousFilters,
        category: getFilter("category") as
          ResourceFilters["category"] | undefined,
        fileType: getFilter("fileType") as
          ResourceFilters["fileType"] | undefined,
        isPremium:
          getFilter("isPremium") === undefined
            ? undefined
            : getFilter("isPremium") === "true",
        page: 1,
      }));

      return next;
    });
  };

  const handleDeleteResource = () => {
    if (!resourceToDelete) {
      return;
    }

    deleteResource(resourceToDelete.id, {
      onSuccess: () => {
        setResourceToDelete(null);
      },
    });
  };

  return (
    <div>
      {filters.userId ? (
        <DataTable
          columns={columns}
          data={resources}
          toolbar={
            <div>
              {filters.userId ? (
                <div></div>
              ) : (
                <Link href="/resources/create">
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Resource
                  </Button>
                </Link>
              )}
            </div>
          }
          enableSearch={true}
          manualSearch={true}
          search={filters.search}
          searchPlaceholder="Search resources by title..."
          onSearchChange={(value) => {
            setFilters((previous) => ({
              ...previous,
              search: value,
              page: 1,
            }));
          }}
          loading={isLoading || isFetching}
          onRowClick={(resource) => {
            router.push(`/resources/${resource.id}`);
          }}
          filterOptions={resourceFilterOptions}
          onFiltersChange={handleColumnFiltersChange}
          filters={columnFilters}
        />
      ) : (
        <PageWrapper className="animate-fade-in p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Resources Management
                </h1>

                <p className="text-muted-foreground mt-1 text-sm font-medium">
                  Manage digital resources, PDFs, templates, and educational
                  materials.
                </p>
              </div>
            </div>

            {/* Loaded state */}
            <DataTable
              columns={columns}
              data={resources}
              toolbar={
                <Link href="/resources/create">
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Resource
                  </Button>
                </Link>
              }
              enableSearch={true}
              manualSearch={true}
              search={filters.search}
              searchPlaceholder="Search resources by title..."
              onSearchChange={(value) => {
                setFilters((previous) => ({
                  ...previous,
                  search: value,
                  page: 1,
                }));
              }}
              loading={isLoading || isFetching}
              onRowClick={(resource) => {
                router.push(`/resources/${resource.id}`);
              }}
              filterOptions={resourceFilterOptions}
              onFiltersChange={handleColumnFiltersChange}
              filters={columnFilters}
            />
            {isError && (
              <div className="text-destructive flex items-center justify-between rounded-md border p-4 text-sm">
                <span>
                  {error instanceof Error
                    ? error.message
                    : "Failed to load resources."}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void refetch()}
                  disabled={isFetching}
                >
                  Retry
                </Button>
              </div>
            )}
            {!isLoading && !isError && resources.length === 0 && (
              <p className="text-muted-foreground py-8 text-center text-sm">
                No resources found.
              </p>
            )}
          </div>
        </PageWrapper>
      )}

      <ConfirmDialog
        open={Boolean(resourceToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setResourceToDelete(null);
          }
        }}
        title="Delete resource?"
        description={
          resourceToDelete ? (
            <>
              Are you sure you want to delete{" "}
              <span className="text-foreground font-medium">
                {resourceToDelete.title}
              </span>
              ?<span className="mt-1 block">This action cannot be undone.</span>
            </>
          ) : null
        }
        confirmText="Delete Resource"
        onConfirm={handleDeleteResource}
        loading={isDeletingResource}
        destructive
      />
    </div>
  );
};

export default ResourcesPage;
