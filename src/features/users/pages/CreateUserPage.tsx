"use client";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { UserForm } from "../components/UserForm";

import { useCreateUserMutation } from "../hooks/useUsers";
import { storageService } from "@/lib/firebase/storage";

import type { CreateUserFormValues } from "../schemas";
import PageWrapper from "@/components/wrappers/PageWrapper";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateUserPage() {
  const router = useRouter();

  const createUser = useCreateUserMutation();

  const handleSubmit = async (values: CreateUserFormValues, image?: File) => {
    try {
      let profileImageUrl: string | undefined;

      // Upload profile image first
      if (image) {
        profileImageUrl = await storageService.uploadFile("users", image);
      }

      // Create user with uploaded image URL
      await createUser.mutateAsync({
        ...values,
        ...(profileImageUrl ? { profileImageUrl } : {}),
      });

      toast.success("User created successfully.");
      router.push("/users");
    } catch (error) {
      console.error("❌ USER CREATION ERROR:", error);

      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" &&
              error !== null &&
              "message" in error &&
              typeof error.message === "string"
            ? error.message
            : "Failed to create user.";

      toast.error(message);
    }
  };

  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Page Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-3 -ml-3"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">Create User</h1>

          <p className="text-muted-foreground mt-1">
            Create and configure a new user account.
          </p>
        </div>

        {/* Form handles its own layout, sections, footer, and development debug */}
        <Card>
          <UserForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            isSubmitting={createUser.isPending}
          />
        </Card>
      </div>
    </PageWrapper>
  );
}
