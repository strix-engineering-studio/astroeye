"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateResourceMutation } from "../hooks/useResources";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";
import ResourceForm from "../components/ResourceForm";
import type { CreateResourceFormValues } from "../schemas";
import { storageService } from "@/lib/firebase/storage";

export const CreateResourcePage: React.FC = () => {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createResource } = useCreateResourceMutation();

  const handleSubmit = async (
    values: CreateResourceFormValues,
    thumbnailFile?: File,
  ) => {
    try {
      setIsSubmitting(true);

      const thumbnail = thumbnailFile
        ? await storageService.uploadFile("resources/thumbnails", thumbnailFile)
        : values.thumbnail;

      const submissionData: CreateResourceFormValues = {
        ...values,
        thumbnail,
        creatorId: currentUser?.id || "admin",
      };

      createResource(submissionData, {
        onSuccess: (newResource) => {
          setIsSubmitting(false);
          toast.success(
            `Resource "${newResource.title}" created successfully!`,
          );
          router.push("/resources");
        },
        onError: (error: unknown) => {
          setIsSubmitting(false);
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to create resource",
          );
        },
      });
    } catch (error) {
      setIsSubmitting(false);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload thumbnail",
      );
    }
  };

  const handleCancel = () => {
    router.push("/resources");
  };

  return (
    <div className="animate-fade-in space-y-6 p-6">
      {/* Back navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Create New Resource
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Add educational materials, templates, or digital downloads to the
            platform.
          </p>
        </div>
      </div>

      {/* Form */}

      <ResourceForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        defaultValues={{
          creatorId: currentUser?.id || "admin",
        }}
      />
    </div>
  );
};

export default CreateResourcePage;
