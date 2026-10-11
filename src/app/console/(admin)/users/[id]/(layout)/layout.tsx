"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  Crown,
  Edit,
  Mail,
  Phone,
  ShieldAlert,
  Trash2,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUserQuery,
} from "@/features/users";

import { Spinner } from "@/components/ui/spinner";
import PageWrapper from "@/components/wrappers/PageWrapper";

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
import React from "react";

const tabs = [
  {
    label: "About",
    path: "",
  },
  {
    label: "Communities",
    path: "communities",
  },
  {
    label: "Expert Requests",
    path: "expert-requests",
  },
  {
    label: "Payments",
    path: "payments",
  },
  {
    label: "Posts",
    path: "posts",
  },
  {
    label: "Resources",
    path: "resources",
  },
  {
    label: "Webinars",
    path: "webinars",
  },
];

export default function UserDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useUserQuery(id);

  const deleteUser = useDeleteUserMutation();
  const updateUser = useUpdateUserMutation();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = React.useState(false);

  const initials =
    data?.fullName
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const formatDate = (date?: Date | string) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const basePath = `/users/${data?.id}`;

  const handleEdit = () => {
    if (!data) return;

    router.push(`/users/${data.id}/edit`);
  };

  const handleDelete = () => {
    if (!data) return;

    deleteUser.mutate(data.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        router.push("/users");
      },
    });
  };

  const handleSuspend = () => {
    if (!data) return;

    updateUser.mutate(
      {
        id: data.id,
        data: { isActive: false },
      },
      {
        onSuccess: () => {
          setIsSuspendDialogOpen(false);
        },
      },
    );
  };

  const handleActivate = () => {
    if (!data) return;

    updateUser.mutate({
      id: data.id,
      data: { isActive: true },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!data) {
    return <div>User not found.</div>;
  }

  return (
    <PageWrapper>
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* ============================================================
          USER PROFILE HEADER
        ============================================================ */}
        <Card>
          <CardContent className="flex w-full justify-between p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              {/* Avatar */}
              <Avatar className="h-24 w-24 shrink-0 border">
                {data.profileImageUrl ? (
                  <AvatarImage src={data.profileImageUrl} alt={data.fullName} />
                ) : null}

                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>

              {/* User Information */}
              <div className="min-w-0 flex-1 space-y-3">
                {/* Name + Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-semibold">{data.fullName}</h2>

                  <Badge variant="secondary">
                    <Crown className="mr-1 h-3.5 w-3.5" />
                    {data.membershipType}
                  </Badge>

                  {!data.isActive && (
                    <Badge variant="destructive">Suspended</Badge>
                  )}
                </div>

                {/* Contact Information */}
                <div className="text-muted-foreground flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{data.email || "-"}</span>
                  </div>

                  {data.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>{data.phoneNumber}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>Joined {formatDate(data.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>

              {data.isActive ? (
                <Button
                  variant="outline"
                  onClick={() => setIsSuspendDialogOpen(true)}
                >
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Suspend
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleActivate}
                  disabled={updateUser.isPending}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  {updateUser.isPending ? "Activating..." : "Activate"}
                </Button>
              )}

              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* ============================================================
          USER SUB-NAVIGATION
        ============================================================ */}
        {/* User Sub-Navigation */}
        <div className="w-full overflow-x-auto">
          <nav className="bg-card flex gap-1 rounded-lg border p-1">
            {tabs.map((tab) => {
              // Only show Expert Requests tab for expert users
              if (tab.path === "expert-requests" && !data.isExpert) {
                return null;
              }

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

        {/* ============================================================
          CURRENT SUB-SCREEN
        ============================================================ */}
        <main className="min-w-0">{children}</main>
      </div>

      {/* ============================================================
          SUSPEND CONFIRMATION DIALOG
      ============================================================ */}
      <AlertDialog
        open={isSuspendDialogOpen}
        onOpenChange={setIsSuspendDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend {data.fullName}?</AlertDialogTitle>

            <AlertDialogDescription>
              This will deactivate the user&apos;s account. They will no longer
              be able to use the application until their account is activated
              again.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateUser.isPending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleSuspend}
              disabled={updateUser.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {updateUser.isPending ? "Suspending..." : "Suspend User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ============================================================
          DELETE CONFIRMATION DIALOG
      ============================================================ */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {data.fullName}?</AlertDialogTitle>

            <AlertDialogDescription>
              This will remove the user from the active users list. The user can
              be restored later from Restore Users.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteUser.isPending}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteUser.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteUser.isPending ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
