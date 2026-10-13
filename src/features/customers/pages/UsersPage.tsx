"use client";

import React, { useMemo, useState } from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  Updater,
} from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, PlusCircle, Eye, Pencil, Crown } from "lucide-react";

import { useUsersQuery } from "../hooks/useUsers";

import type { UserFilters, UserType } from "../types";

import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import PageWrapper from "@/components/wrappers/PageWrapper";

import { DataTableFilter } from "@/components/tables/FilterDropdown";
import { formatDate } from "@/utils/date";

const initialFilters: UserFilters = {
  search: "",
  membershipType: undefined,
  gender: undefined,
  relationship: undefined,
  isActive: undefined,
  isExpert: undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};

/**
 * Safely formats dates coming from Firestore, API responses,
 * JavaScript Date objects, or serialized Firestore timestamps.
 */
function formatCreatedAt(value: unknown): string {
  if (!value) {
    return "-";
  }

  let date: Date | null = null;

  // Firestore Timestamp
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    date = (value as { toDate: () => Date }).toDate();
  }

  // Serialized Firestore Timestamp: { seconds, nanoseconds }
  else if (typeof value === "object" && value !== null && "seconds" in value) {
    const seconds = (value as { seconds?: unknown }).seconds;

    if (typeof seconds === "number") {
      date = new Date(seconds * 1000);
    }
  }

  // Date, ISO string, or timestamp
  else {
    const parsedDate = new Date(value as string | number | Date);

    if (!Number.isNaN(parsedDate.getTime())) {
      date = parsedDate;
    }
  }

  if (!date || Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export const UsersPage: React.FC = () => {
  const router = useRouter();

  /**
   * Single source of truth for table filters.
   */
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  /**
   * Search is maintained separately from column filters.
   */
  const [search, setSearch] = useState(initialFilters.search);

  /**
   * Derive API filters from UI state.
   *
   * Do not maintain another `filters` state.
   * This prevents filter state from getting out of sync
   * with the DataTable state.
   */
  const filters = useMemo<UserFilters>(() => {
    const getFilter = (id: string) =>
      columnFilters.find((filter) => filter.id === id)?.value;

    const isActiveValue = getFilter("isActive");
    const isExpertValue = getFilter("isExpert");

    return {
      ...initialFilters,

      search,

      membershipType: getFilter("membershipType") as
        UserFilters["membershipType"] | undefined,

      gender: getFilter("gender") as UserFilters["gender"] | undefined,

      isActive:
        isActiveValue === undefined ? undefined : isActiveValue === "true",

      isExpert:
        isExpertValue === undefined ? undefined : isExpertValue === "true",

      page: 1,
    };
  }, [columnFilters, search]);

  /**
   * Users query.
   */
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useUsersQuery(filters);

  /**
   * Keep columns stable between renders.
   *
   * This is important because DataTable receives `columns`
   * and should not receive a brand-new column definition
   * every time UsersPage rerenders.
   */
  const columns = useMemo<ColumnDef<UserType>[]>(
    () => [
      {
        id: "serialNo",
        header: "Sr. No.",
        cell: ({ row }) => row.index + 1,
      },

      {
        accessorKey: "fullName",
        header: "Full Name",
        // Keep an identifying column available when users customize the table.
        enableHiding: false,

        cell: ({ row }) => {
          const user = row.original;

          return (
            <div className="flex gap-1">
              {user.isExpert && <Crown className="h-4 w-4 text-amber-500" />}

              <p className="text-foreground font-bold">{user.fullName}</p>
            </div>
          );
        },
      },

      {
        accessorKey: "email",
        header: "Email",

        cell: ({ row }) => (
          <span className="text-xs font-medium">
            {row.original.email || "-"}
          </span>
        ),
      },

      {
        accessorKey: "phoneNumber",
        header: "Phone Number",

        cell: ({ row }) => (
          <span className="text-xs font-medium">
            {row.original.phoneNumber || "-"}
          </span>
        ),
      },

      {
        accessorKey: "gender",
        header: "Gender",

        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs font-medium capitalize">
            {row.original.gender || "-"}
          </Badge>
        ),
      },

      {
        accessorKey: "membershipType",
        header: "Membership",

        cell: ({ row }) => {
          const membership = row.original.membershipType;

          return (
            <Badge variant="outline" className="text-xs font-semibold">
              {membership === "PREMIUM" ? "Premium" : "Free"}
            </Badge>
          );
        },
      },

      {
        accessorKey: "status",
        header: "Status",

        cell: ({ row }) => {
          const status = row.original.isActive ? "ACTIVE" : "INACTIVE";

          const className =
            status === "ACTIVE"
              ? "bg-emerald-500/10 text-emerald-600"
              : status === "INACTIVE"
                ? "bg-amber-500/10 text-amber-600"
                : "bg-muted text-muted-foreground";

          return (
            <Badge variant="outline" className={` ${className}`}>
              {status || "-"}
            </Badge>
          );
        },
      },

      {
        accessorKey: "createdAt",
        header: "Created At",

        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs whitespace-nowrap">
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
          const user = row.original;

          return (
            <div
              data-row-action
              className="flex items-center justify-center"
              onClick={(event) => {
                event.stopPropagation();
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="border-border/20 h-8 w-8 rounded-lg border"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="bg-card border-border w-48 border"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/users/${user.id}`}
                      className="flex cursor-pointer items-center gap-2 text-xs font-medium"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View User
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      href={`/users/${user.id}/edit`}
                      className="flex cursor-pointer items-center gap-2 text-xs font-medium"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit User
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
   * DataTable filter configuration.
   *
   * Kept outside render-dependent state so it does not
   * change unnecessarily.
   */
  const userFilterOptions = useMemo<DataTableFilter[]>(
    () => [
      {
        key: "membershipType",
        label: "Membership",
        placeholder: "Select membership",
        options: [
          { label: "Premium", value: "PREMIUM" },
          { label: "Free", value: "FREE" },
        ],
      },

      {
        key: "gender",
        label: "Gender",
        placeholder: "Select gender",
        options: [
          { label: "Male", value: "MALE" },
          { label: "Female", value: "FEMALE" },
          { label: "Other", value: "OTHER" },
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

      {
        key: "isExpert",
        label: "Expert",
        placeholder: "Select expert status",
        options: [
          { label: "Expert", value: "true" },
          { label: "Not Expert", value: "false" },
        ],
      },
    ],
    [],
  );

  /**
   * Only update DataTable filter state.
   *
   * Do NOT update API filters here.
   * `filters` is derived from `columnFilters`.
   */
  const handleColumnFiltersChange = (updater: Updater<ColumnFiltersState>) => {
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
              Users Management
            </h1>

            <p className="text-muted-foreground mt-1 text-sm font-medium">
              Browse registered users, monitor memberships, manage account
              status, and execute user controls.
            </p>
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns}
          data={users ?? []}
          toolbar={
            <>
              <Link href="/users/create">
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add User
                </Button>
              </Link>
            </>
          }
          enableSearch={true}
          manualSearch={true}
          search={search}
          searchPlaceholder="Search users..."
          onSearchChange={(value) => {
            setSearch(value);
          }}
          loading={isLoading || isFetching}
          onRowClick={(user) => {
            router.push(`/users/${user.id}`);
          }}
          filterOptions={userFilterOptions}
          onFiltersChange={handleColumnFiltersChange}
          filters={columnFilters}
        />
      </div>
    </PageWrapper>
  );
};

export default UsersPage;
