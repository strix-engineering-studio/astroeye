"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  useUserQuery,
  useDeleteUserMutation,
} from "@/features/users/hooks/useUsers";

import { UserDetailsPage } from "@/features/users/pages/UserDetailsPage";

import { useAuth } from "@/providers/AuthProvider";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();

  const { user: currentAdmin } = useAuth();

  const { data, isLoading } = useUserQuery(id);

  const deleteUser = useDeleteUserMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // const updateStatus = useUpdateUserStatusMutation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>User not found.</div>;
  }

  return (
    <>
      <UserDetailsPage
        user={data}
        onEdit={() => router.push(`/users/${id}/edit`)}
        onDelete={() => setDeleteDialogOpen(true)}
        onSuspend={
          () => {}
          // updateStatus.mutate({
          //   id,
          //   status: UserStatus.SUSPENDED,
          //   adminDetails: {
          //     adminId: currentAdmin?.id ?? '',
          //     adminName: currentAdmin?.displayName ?? 'Admin',
          //     reason: 'User suspended by administrator',
          //   },
          // })
        }
        onActivate={
          () => {}
          // updateStatus.mutate({
          //   id,
          //   status: UserStatus.ACTIVE,
          //   adminDetails: {
          //     adminId: currentAdmin?.id ?? '',
          //     adminName: currentAdmin?.displayName ?? 'Admin',
          //     reason: 'User activated by administrator',
          //   },
          // })
        }
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteDialogOpen(false);
          }
        }}
        title="Delete user?"
        description={
          <>
            Delete{" "}
            <span className="text-foreground font-medium">{data.fullName}</span>
            ? This can be undone from Restore Users.
          </>
        }
        confirmText="Delete User"
        destructive
        onConfirm={() => {
          deleteUser.mutate(id, {
            onSuccess: () => setDeleteDialogOpen(false),
          });
        }}
        loading={deleteUser.isPending}
      />
    </>
  );
}
