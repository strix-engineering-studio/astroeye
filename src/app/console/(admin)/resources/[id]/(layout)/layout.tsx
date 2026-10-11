"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  ArrowLeft,
  Calendar,
  Crown,
  Download,
  Edit,
  ExternalLink,
  FileText,
  FileType,
  Tag,
  Trash2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import PageWrapper from "@/components/wrappers/PageWrapper";

import {
  useResourceQuery,
  useDeleteResourceMutation,
} from "@/features/resources";

const tabs = [
  {
    label: "About",
    path: "",
  },
  {
    label: "Orders",
    path: "orders",
  },
];

function ResourceDetailsSkeleton() {
  return (
    <PageWrapper>
      <div className="container mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />

            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
        </div>

        {/* Resource Profile */}
        <Card className="overflow-hidden border-0 shadow-lg">
          <div className="flex flex-col lg:flex-row">
            {/* Thumbnail */}
            <Skeleton className="min-h-[280px] w-full rounded-none lg:min-h-[320px] lg:w-[380px]" />

            {/* Information */}
            <CardContent className="flex-1 p-8">
              <div className="space-y-6">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>

                <Skeleton className="h-10 w-96 max-w-full" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-full max-w-2xl" />
                  <Skeleton className="h-4 w-3/4 max-w-xl" />
                </div>

                <Skeleton className="h-12 w-56" />

                <div className="flex gap-6">
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-1 rounded-lg border p-1">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    </PageWrapper>
  );
}

export default function ResourceDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { id } = useParams<{ id: string }>();

  // ============================================================
  // RESOURCE QUERY
  // ============================================================

  const { data: resource, isLoading, isError } = useResourceQuery(id);

  // ============================================================
  // MUTATION
  // ============================================================

  const deleteResourceMutation = useDeleteResourceMutation();

  // ============================================================
  // DIALOG STATE
  // ============================================================

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return <ResourceDetailsSkeleton />;
  }

  // ============================================================
  // ERROR / NOT FOUND
  // ============================================================

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

  // ============================================================
  // HELPERS
  // ============================================================

  const basePath = `/resources/${resource.id}`;

  const createdDate = new Date(resource.createdAt);

  const formatDate = (date: Date): string => {
    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ============================================================
  // ACTIONS
  // ============================================================

  const handleBack = () => {
    router.back();
  };

  const handleEdit = () => {
    router.push(`/resources/${resource.id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await deleteResourceMutation.mutateAsync(resource.id);

      setIsDeleteDialogOpen(false);

      router.push("/resources");
    } catch {
      // Error toast is already handled by the mutation.
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <PageWrapper>
      <div className="container mx-auto max-w-7xl space-y-6 p-6">
        {/* ========================================================
            TOP HEADER
        ======================================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Resource Details
              </h1>

              <p className="text-muted-foreground text-sm">
                View and manage resource information and orders.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            RESOURCE PROFILE
        ======================================================== */}

        <Card className="overflow-hidden border-0 shadow-lg">
          {/* ====================================================
    THUMBNAIL — 16:9
==================================================== */}
          <div className="bg-muted relative aspect-video w-full overflow-hidden lg:w-[380px] lg:shrink-0">
            {resource.thumbnail ? (
              <img
                src={resource.thumbnail}
                alt={resource.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="text-muted-foreground h-20 w-20" />
              </div>
            )}

            {/* Premium */}
            {resource.isPremium && (
              <div className="absolute top-4 left-4">
                <Badge className="gap-1">
                  <Crown className="h-3 w-3" />
                  Premium
                </Badge>
              </div>
            )}
          </div>
          <div className="flex flex-col lg:flex-row">
            {/* ====================================================
                RESOURCE INFORMATION
            ==================================================== */}
            <CardContent className="flex-1 p-6 sm:p-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 space-y-5">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{resource.category}</Badge>

                    <Badge variant="secondary">{resource.fileType}</Badge>

                    {resource.isPremium ? (
                      <Badge className="gap-1">
                        <Crown className="h-3 w-3" />
                        Premium
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Free</Badge>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight break-words">
                      {resource.title}
                    </h2>

                    <p className="text-muted-foreground mt-3 max-w-3xl leading-7">
                      {resource.description || "No description available."}
                    </p>
                  </div>

                  {/* Creator */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                      <User className="text-muted-foreground h-6 w-6" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-muted-foreground text-xs font-medium uppercase">
                        Created By
                      </p>

                      <p className="truncate font-semibold">
                        {resource.creatorId}
                      </p>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
                    <div className="flex items-center gap-2">
                      <Download className="text-muted-foreground h-4 w-4" />

                      <div>
                        <p className="text-sm font-medium">
                          {resource.downloads.toLocaleString()}
                        </p>

                        <p className="text-muted-foreground text-xs">
                          Downloads
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileType className="text-muted-foreground h-4 w-4" />

                      <div>
                        <p className="text-sm font-medium">
                          {resource.fileType}
                        </p>

                        <p className="text-muted-foreground text-xs">
                          File Type
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Tag className="text-muted-foreground h-4 w-4" />

                      <div>
                        <p className="text-sm font-medium">
                          {resource.category}
                        </p>

                        <p className="text-muted-foreground text-xs">
                          Category
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="text-muted-foreground h-4 w-4" />

                      <div>
                        <p className="text-sm font-medium">
                          {formatDate(createdDate)}
                        </p>

                        <p className="text-muted-foreground text-xs">Created</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ==================================================
                    ACTIONS
                ================================================== */}

                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button variant="outline" onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>

                  {resource.url && (
                    <Button  variant="outline">
                      <Link
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open
                      </Link>
                    </Button>
                  )}

                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={deleteResourceMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />

                    {deleteResourceMutation.isPending
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* ========================================================
            RESOURCE NAVIGATION
        ======================================================== */}

        <div className="w-full overflow-x-auto">
          <nav className="bg-card flex min-w-max gap-1 rounded-lg border p-1">
            {tabs.map((tab) => {
              const href = tab.path ? `${basePath}/${tab.path}` : basePath;

              const isSelected =
                tab.path === ""
                  ? pathname === basePath
                  : pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={tab.path || "about"}
                  href={href}
                  className={[
                    "rounded-md px-4 py-2 text-sm font-medium",
                    "whitespace-nowrap transition-colors",
                    "focus-visible:ring-ring focus-visible:ring-2",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  ].join(" ")}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ========================================================
            CURRENT TAB CONTENT
        ======================================================== */}

        <main className="min-w-0">{children}</main>
      </div>

      {/* ==========================================================
          DELETE DIALOG
      ========================================================== */}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &quot;{resource.title}&quot;?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will remove the resource from the active resource list. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteResourceMutation.isPending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteResourceMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteResourceMutation.isPending
                ? "Deleting..."
                : "Delete Resource"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
