"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCcw } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { UserForm } from "../components/UserForm";

import type { EditUserFormValues } from "../schemas";

import {
  useRestoreUserMutation,
  useUpdateUserMutation,
  useUserQuery,
} from "../hooks/useUsers";
import { storageService } from "@/lib/firebase/storage";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();

  const userId = params.id as string;

  const { data: user, isLoading } = useUserQuery(userId);
  const updateUser = useUpdateUserMutation();
  const restoreUser = useRestoreUserMutation();

  const handleSubmit = async (values: EditUserFormValues, image?: File) => {
    try {
      const profileImageUrl = image
        ? await storageService.uploadFile("users", image)
        : values.profileImageUrl;

      await updateUser.mutateAsync({
        id: userId,
        data: {
          ...values,
          ...(profileImageUrl ? { profileImageUrl } : {}),
        },
      });
      toast.success("User updated successfully.");
      router.push("/users");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user.");
    }
  };

  const handleRestore = () => {
    restoreUser.mutate(userId, {
      onSuccess: () => {
        toast.success("User restored successfully.");
        router.push("/users");
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to restore user.");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        Loading user...
      </div>
    );
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-3"
              disabled={updateUser.isPending || restoreUser.isPending}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <h1 className="text-3xl font-bold">Edit User</h1>

            <p className="text-muted-foreground">{user.fullName}</p>
          </div>

          {user.isDeleted ? (
            <Button
              variant="secondary"
              onClick={handleRestore}
              disabled={restoreUser.isPending}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Restore User
            </Button>
          ) : null}
        </div>
      </div>

      <UserForm
        mode="edit"
        defaultValues={{
          fullName: user.fullName,
          email: user.email,
          countryCode: (() => {
            const cleaned = user.phoneNumber?.replace(/\D/g, "") ?? "";
            return cleaned.length > 10
              ? cleaned.slice(0, cleaned.length - 10)
              : "91";
          })(),
          phoneNumber: (() => {
            const cleaned = user.phoneNumber?.replace(/\D/g, "") ?? "";
            return cleaned.slice(-10);
          })(),
          membershipType: user.membershipType,
          isActive: user.isActive,
          isExpert: user.isExpert,
          gender: user.gender,
          profileImageUrl: user.profileImageUrl,
        }}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isSubmitting={updateUser.isPending}
      />
    </div>
  );
}
