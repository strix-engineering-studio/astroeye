"use client";

import React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createResourceSchema,
  CreateResourceFormValues,
  updateResourceSchema,
} from "../schemas";

import {
  ResourceCategoryEnum,
  ResourceFileTypeEnum,
} from "../types/resources.types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUploader } from "@/components/upload/ImageUploader";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormWrapper } from "@/components/wrappers/FormWrapper";

interface ResourceFormProps {
  onSubmit: (
    values: CreateResourceFormValues,
    thumbnailFile?: File,
  ) => void | Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CreateResourceFormValues>;
  isEditMode?: boolean;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues = {},
  isEditMode = false,
}) => {
  const [selectedThumbnailFile, setSelectedThumbnailFile] =
    React.useState<File | null>(null);
  const schema = isEditMode ? updateResourceSchema : createResourceSchema;

  const form = useForm<CreateResourceFormValues>({
    resolver: zodResolver(
      schema,
    ) as unknown as Resolver<CreateResourceFormValues>,

    defaultValues: {
      title: "",
      description: "",
      category: ResourceCategoryEnum.GUIDES,
      fileType: ResourceFileTypeEnum.PDF,
      thumbnail: "",
      url: "",
      isPremium: false,
      creatorId: "",
      ...defaultValues,
    },

    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = form;

  const isPremium = watch("isPremium");
  const thumbnail = watch("thumbnail");

  return (
    <FormWrapper
      form={form}
      title={isEditMode ? "Edit Resource" : "Create Resource"}
      description={
        isEditMode
          ? "Update resource information and settings."
          : "Add educational materials, templates, or digital downloads to the platform."
      }
      submitting={isSubmitting}
      showFooter={false}
      onSubmit={(values) =>
        onSubmit(values, selectedThumbnailFile ?? undefined)
      }
    >
      <div className="space-y-6 text-left font-sans">
        {/* Title */}
        <div className="space-y-1">
          <Label
            htmlFor="title"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Resource Title
          </Label>

          <Input
            id="title"
            placeholder="Enter resource title (e.g., Toddler Milestone Tracker)"
            className="h-10 focus-visible:ring-indigo-500/30"
            disabled={isSubmitting}
            {...register("title")}
          />

          {errors.title && (
            <p className="text-destructive text-xs font-semibold">
              {errors.title.message as string}
            </p>
          )}
          <p className="text-muted-foreground text-xs">
            Uploaded thumbnails are stored in Firebase Storage. External URLs
            remain unchanged.
          </p>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label
            htmlFor="description"
            className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
          >
            Description
          </Label>

          <Textarea
            id="description"
            placeholder="Enter a detailed description of the resource..."
            className="min-h-[100px] focus-visible:ring-indigo-500/30"
            disabled={isSubmitting}
            {...register("description")}
          />

          {errors.description && (
            <p className="text-destructive text-xs font-semibold">
              {errors.description.message as string}
            </p>
          )}
        </div>

        {/* Category / File Type / Premium */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Category */}
          <div className="space-y-1">
            <Label
              htmlFor="category"
              className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
            >
              Category
            </Label>

            <Select
              value={watch("category")}
              onValueChange={(value) => {
                setValue(
                  "category",
                  value as CreateResourceFormValues["category"],
                  {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  },
                );
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-10 focus-visible:ring-indigo-500/30">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {Object.values(ResourceCategoryEnum).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.category && (
              <p className="text-destructive text-xs font-semibold">
                {errors.category.message as string}
              </p>
            )}
          </div>

          {/* File Type */}
          <div className="space-y-1">
            <Label
              htmlFor="fileType"
              className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
            >
              File Type
            </Label>

            <Select
              value={watch("fileType")}
              onValueChange={(value) => {
                setValue(
                  "fileType",
                  value as CreateResourceFormValues["fileType"],
                  {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  },
                );
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger className="h-10 focus-visible:ring-indigo-500/30">
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>

              <SelectContent>
                {Object.values(ResourceFileTypeEnum).map((fileType) => (
                  <SelectItem key={fileType} value={fileType}>
                    {fileType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.fileType && (
              <p className="text-destructive text-xs font-semibold">
                {errors.fileType.message as string}
              </p>
            )}
          </div>

          {/* Premium */}
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Premium Resource
            </Label>

            <div className="flex h-10 items-center space-x-2">
              <Switch
                checked={isPremium}
                onCheckedChange={(checked) => {
                  setValue("isPremium", checked, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
                disabled={isSubmitting}
              />

              <span className="text-xs font-medium">
                {isPremium ? "Premium (Paid)" : "Free"}
              </span>
            </div>

            {errors.isPremium && (
              <p className="text-destructive text-xs font-semibold">
                {errors.isPremium.message as string}
              </p>
            )}
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Thumbnail */}
          <div className="space-y-1">
            <ImageUploader
              value={thumbnail}
              folder="resources"
              onFileChange={(file) => setSelectedThumbnailFile(file ?? null)}
              disabled={isSubmitting}
              title="Thumbnail image"
              description="Upload to Firebase Storage, or use an external image URL below."
            />

            {errors.thumbnail && (
              <p className="text-destructive text-xs font-semibold">
                {errors.thumbnail.message as string}
              </p>
            )}

            {thumbnail && (
              <div className="mt-2">
                <img
                  src={thumbnail}
                  alt="Thumbnail preview"
                  className="h-20 w-20 rounded-lg object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Resource URL */}
          <div className="space-y-1">
            <Label
              htmlFor="url"
              className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
            >
              Resource URL
            </Label>

            <Input
              id="url"
              type="url"
              placeholder="https://example.com/resource.pdf"
              className="h-10 focus-visible:ring-indigo-500/30"
              disabled={isSubmitting}
              {...register("url")}
            />

            {errors.url && (
              <p className="text-destructive text-xs font-semibold">
                {errors.url.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Creator ID */}
        {isEditMode && (
          <div className="space-y-1">
            <Label
              htmlFor="creatorId"
              className="text-muted-foreground text-xs font-bold tracking-wider uppercase"
            >
              Creator ID
            </Label>

            <Input
              id="creatorId"
              placeholder="Creator user ID"
              className="h-10 focus-visible:ring-indigo-500/30"
              readOnly
              disabled={isSubmitting}
              {...register("creatorId")}
            />

            {errors.creatorId && (
              <p className="text-destructive text-xs font-semibold">
                {errors.creatorId.message as string}
              </p>
            )}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="border-border/50 flex justify-end gap-2 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Update Resource"
                : "Create Resource"}
          </Button>
        </div>
      </div>
    </FormWrapper>
  );
};

export default ResourceForm;
