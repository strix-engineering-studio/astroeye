"use client";

import { useParams } from "next/navigation";

import {
  Calendar,
  Clock,
  Crown,
  Download,
  ExternalLink,
  FileText,
  FileType,
  Globe,
  Link as LinkIcon,
  Tag,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import PageWrapper from "@/components/wrappers/PageWrapper";

import { useResourceQuery } from "@/features/resources";

import type { Resource } from "@/features/resources/types/resources.types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
      <span className="text-muted-foreground text-sm">{label}</span>

      <span className="text-right font-medium">{value ?? "-"}</span>
    </div>
  );
}

function ResourceAboutSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Main */}
      <div className="space-y-6 lg:col-span-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>

          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-lg" />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>

          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>

          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6 lg:col-span-4">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  );
}

function formatDate(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }

  if (value instanceof Date) {
    return formatValidDate(value);
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return formatValidDate((value as { toDate: () => Date }).toDate());
  }

  if (typeof value === "object" && value !== null && "seconds" in value) {
    const seconds = Number((value as { seconds: unknown }).seconds);

    if (Number.isFinite(seconds)) {
      return formatValidDate(new Date(seconds * 1000));
    }
  }

  if (typeof value === "object" && value !== null && "_seconds" in value) {
    const seconds = Number((value as { _seconds: unknown })._seconds);

    if (Number.isFinite(seconds)) {
      return formatValidDate(new Date(seconds * 1000));
    }
  }

  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return formatValidDate(date);
    }
  }

  return "-";
}

function formatValidDate(date: Date): string {
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }

  let date: Date | null = null;

  if (value instanceof Date) {
    date = value;
  } else if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    date = (value as { toDate: () => Date }).toDate();
  } else if (
    typeof value === "object" &&
    value !== null &&
    "seconds" in value
  ) {
    const seconds = Number((value as { seconds: unknown }).seconds);

    if (Number.isFinite(seconds)) {
      date = new Date(seconds * 1000);
    }
  } else if (
    typeof value === "object" &&
    value !== null &&
    "_seconds" in value
  ) {
    const seconds = Number((value as { _seconds: unknown })._seconds);

    if (Number.isFinite(seconds)) {
      date = new Date(seconds * 1000);
    }
  } else if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);

    if (!Number.isNaN(parsed.getTime())) {
      date = parsed;
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
  });
}

export default function ResourceAboutPage() {
  const { id } = useParams<{ id: string }>();

  const { data: resource, isLoading, isError } = useResourceQuery(id);

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="container mx-auto max-w-7xl p-6">
          <ResourceAboutSkeleton />
        </div>
      </PageWrapper>
    );
  }

  if (isError || !resource) {
    return (
      <PageWrapper>
        <div className="container mx-auto max-w-7xl p-6">
          <Card>
            <CardContent className="flex min-h-56 items-center justify-center">
              <p className="text-muted-foreground">Resource not found.</p>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* ==========================================================
          MAIN CONTENT
      ========================================================== */}

      <div className="space-y-6 lg:col-span-8">
        {/* ========================================================
            RESOURCE INFORMATION
        ======================================================== */}

        <Card>
          <CardHeader>
            <CardTitle>Resource Information</CardTitle>

            <CardDescription>
              Basic information about this resource.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <InfoRow label="Title" value={resource.title} />

            <InfoRow label="Category" value={resource.category} />

            <InfoRow label="File Type" value={resource.fileType} />

            <InfoRow
              label="Access"
              value={
                <Badge
                  variant={resource.isPremium ? "default" : "secondary"}
                  className="gap-1"
                >
                  {resource.isPremium && <Crown className="h-3 w-3" />}

                  {resource.isPremium ? "Premium" : "Free"}
                </Badge>
              }
            />

            <InfoRow
              label="Downloads"
              value={resource.downloads.toLocaleString()}
            />
          </CardContent>
        </Card>

        {/* ========================================================
            DESCRIPTION
        ======================================================== */}

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>

            <CardDescription>
              Detailed description of the resource.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground text-sm leading-7 whitespace-pre-wrap">
              {resource.description || "No description available."}
            </p>
          </CardContent>
        </Card>

        {/* ========================================================
            RESOURCE ACCESS
        ======================================================== */}

        <Card>
          <CardHeader>
            <CardTitle>Resource Access</CardTitle>

            <CardDescription>
              Links and access information for this resource.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <InfoRow
              label="Access Type"
              value={
                <Badge
                  variant={resource.isPremium ? "default" : "secondary"}
                  className="gap-1"
                >
                  {resource.isPremium && <Crown className="h-3 w-3" />}

                  {resource.isPremium ? "Premium" : "Free"}
                </Badge>
              }
            />

            <InfoRow
              label="File Type"
              value={
                <div className="flex items-center gap-2">
                  <FileType className="text-muted-foreground h-4 w-4" />
                  {resource.fileType}
                </div>
              }
            />

            <InfoRow
              label="Resource URL"
              value={
                resource.url ? (
                  <Link
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Resource
                  </Link>
                ) : (
                  "Not available"
                )
              }
            />
          </CardContent>
        </Card>

        {/* ========================================================
            RESOURCE URL
        ======================================================== */}

        {resource.url && (
          <Card>
            <CardHeader>
              <CardTitle>Resource URL</CardTitle>

              <CardDescription>
                Direct URL associated with this resource.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="bg-muted flex items-center gap-3 rounded-lg border p-4">
                <LinkIcon className="text-muted-foreground h-5 w-5 shrink-0" />

                <p className="min-w-0 flex-1 truncate text-sm">
                  {resource.url}
                </p>

                <Button size="sm" variant="outline" asChild>
                  <Link
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ========================================================
            METADATA
        ======================================================== */}

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>

            <CardDescription>
              System information associated with this resource.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <InfoRow label="Resource ID" value={resource.id} />

            <InfoRow label="Creator ID" value={resource.creatorId} />

            <InfoRow
              label="Created At"
              value={formatDateTime(resource.createdAt)}
            />

            <InfoRow
              label="Updated At"
              value={
                resource.updatedAt
                  ? formatDateTime(resource.updatedAt)
                  : "Never updated"
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* ==========================================================
          SIDEBAR
      ========================================================== */}

      <div className="space-y-6 lg:col-span-4">
        {/* ========================================================
            RESOURCE STATUS
        ======================================================== */}

        <Card>
          <CardHeader>
            <CardTitle>Resource Status</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                {resource.isPremium ? (
                  <Crown className="h-5 w-5" />
                ) : (
                  <Globe className="text-muted-foreground h-5 w-5" />
                )}
              </div>

              <div>
                <p className="text-muted-foreground text-xs uppercase">
                  Access
                </p>

                <p className="font-semibold">
                  {resource.isPremium ? "Premium" : "Free"}
                </p>
              </div>
            </div>

            <Separator />

            <InfoRow
              label="Category"
              value={
                <div className="flex items-center gap-2">
                  <Tag className="text-muted-foreground h-4 w-4" />
                  {resource.category}
                </div>
              }
            />

            <InfoRow
              label="File Type"
              value={
                <div className="flex items-center gap-2">
                  <FileText className="text-muted-foreground h-4 w-4" />
                  {resource.fileType}
                </div>
              }
            />

            <InfoRow
              label="Downloads"
              value={resource.downloads.toLocaleString()}
            />
          </CardContent>
        </Card>

        {/* ========================================================
            CREATOR
        ======================================================== */}

        <Card>
          <CardHeader>
            <CardTitle>Creator</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-3">
              <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                <User className="text-muted-foreground h-6 w-6" />
              </div>

              <div className="min-w-0">
                <p className="text-muted-foreground text-xs uppercase">
                  Creator ID
                </p>

                <p className="truncate font-semibold">{resource.creatorId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========================================================
            TIMELINE
        ======================================================== */}

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="text-muted-foreground mt-0.5 h-4 w-4" />

              <div>
                <p className="text-sm font-medium">Created</p>

                <p className="text-muted-foreground text-xs">
                  {formatDateTime(resource.createdAt)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Clock className="text-muted-foreground mt-0.5 h-4 w-4" />

              <div>
                <p className="text-sm font-medium">Last Updated</p>

                <p className="text-muted-foreground text-xs">
                  {resource.updatedAt
                    ? formatDateTime(resource.updatedAt)
                    : "Never updated"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ========================================================
            DOWNLOAD STATISTICS
        ======================================================== */}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-lg">
                <Download className="h-5 w-5" />
              </div>

              <div>
                <p className="text-muted-foreground text-sm">Total Downloads</p>

                <p className="text-2xl font-bold">
                  {resource.downloads.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
