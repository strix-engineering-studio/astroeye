"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Table } from "lucide-react";

import { useUsersQuery } from "../hooks/useUsers";
import type { UserFilters } from "../types";

import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/wrappers/PageWrapper";
import { DataTableFilter } from "@/components/tables/FilterDropdown";

// IMPORTANT:
// Leaflet/react-leaflet accesses browser APIs such as `window`.
// Do not allow the map component to be rendered/imported during SSR.
const UsersMap = dynamic(() => import("../components/UsersMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-muted flex h-[650px] items-center justify-center">
      <p className="text-muted-foreground text-sm">Loading map...</p>
    </div>
  ),
});

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
  limit: 1000,
};

export const UsersMapPage: React.FC = () => {
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  const { data: users = [], isLoading } = useUsersQuery(filters);

  const updateFilter = <K extends keyof UserFilters>(
    key: K,
    value: UserFilters[K],
  ) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
      page: 1,
    }));
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
              Browse registered users and their locations.
            </p>
          </div>

          <Link href="/users">
            <Button className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              View Users
            </Button>
          </Link>
        </div>

        {/* Map */}
        <div className="border-border bg-card overflow-hidden rounded-xl border">
          {isLoading ? (
            <div className="bg-muted flex h-[650px] items-center justify-center">
              <p className="text-muted-foreground text-sm">Loading users...</p>
            </div>
          ) : (
            <UsersMap users={users} />
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default UsersMapPage;
