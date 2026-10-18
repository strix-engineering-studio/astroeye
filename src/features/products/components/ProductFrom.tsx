
"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Package,
  IndianRupee,
  Boxes,
  Image as ImageIcon,
  Settings2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { FormWrapper } from "@/components/wrappers/FormWrapper";


import {
  ProductFormInput,
  productFormSchema,
  ProductFormValues,
} from "../schemas";
import { ImageUploader } from "@/src/components/upload/ImageUploader";

interface ProductCategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<ProductFormValues>;
  categories: ProductCategoryOption[];
  onSubmit: (
    values: ProductFormValues,
    image?: File,
  ) => void | Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const EMPTY_PRODUCT: ProductFormValues = {
  name: "",
  description: "",
  categoryId: "",
  price: 0,
  stockQuantity: 0,
  isPublished: false,
  imageUrl: "",
};

export function ProductForm({
  mode,
  defaultValues,
  categories,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProductFormProps) {
  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: "onChange",
    defaultValues: {
      ...EMPTY_PRODUCT,
      ...defaultValues,
    },
  });

  const [selectedImageFile, setSelectedImageFile] =
    useState<File | null>(null);

  const isPublished = form.watch("isPublished");
  const isCreateMode = mode === "create";

  // Reset the form when the product being edited changes.
  useEffect(() => {
    if (!defaultValues) return;

    form.reset({
      ...EMPTY_PRODUCT,
      ...defaultValues,
    });

    setSelectedImageFile(null);
  }, [defaultValues, form]);

  const handleFormSubmit = async (values: ProductFormValues) => {
    await onSubmit(values, selectedImageFile ?? undefined);
  };

  return (
    <FormProvider {...form}>
      <FormWrapper
        form={form}
        showHeader={false}
        showDevelopmentDebug={true}
        submitting={isSubmitting}
        submitLabel={isCreateMode ? "Create Product" : "Save Changes"}
        title={isCreateMode ? "Create Product" : "Edit Product"}
        description={
          isCreateMode
            ? "Add a new product to your catalog."
            : "Update product information, pricing, and availability."
        }
        onCancel={onCancel}
        onSubmit={handleFormSubmit}
      >
        {/* Product image */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ImageIcon className="h-5 w-5" />
              Product Image
            </CardTitle>
            <CardDescription>
              Upload the primary image displayed in your storefront.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <ImageUploader
              value={form.watch("imageUrl") || undefined}
              folder="products"
              title="Upload Product Image"
              description="Use a clear, high-quality image of the product."
              onFileChange={(file) => {
                setSelectedImageFile(file ?? null);
              }}
            />
          </CardContent>
        </Card>

        {/* Basic information */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Define the product name, description, and category.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            <FormField
              label="Product Name"
              htmlFor="name"
              required
              error={form.formState.errors.name?.message}
            >
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter product name"
                maxLength={120}
              />
            </FormField>

            <FormField
              label="Description"
              htmlFor="description"
              error={form.formState.errors.description?.message}
            >
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe the product and its key details"
                rows={5}
                maxLength={5000}
              />
              <p className="text-muted-foreground text-xs">
                Provide useful details to help customers understand the
                product.
              </p>
            </FormField>

            {/* <FormField
              label="Category"
              required
              error={form.formState.errors.categoryId?.message}
            >
              <Select
                value={form.watch("categoryId")}
                onValueChange={(value) =>
                  form.setValue("categoryId", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField> */}
          </CardContent>
        </Card>

        {/* Pricing and inventory */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <IndianRupee className="h-5 w-5" />
              Pricing & Inventory
            </CardTitle>
            <CardDescription>
              Set the selling price and available stock quantity.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                label="Price (INR)"
                htmlFor="price"
                required
                error={form.formState.errors.price?.message}
              >
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  {...form.register("price", {
                    valueAsNumber: true,
                  })}
                />
                <p className="text-muted-foreground text-xs">
                  Enter the selling price in Indian rupees.
                </p>
              </FormField>

              <FormField
                label="Stock Quantity"
                htmlFor="stockQuantity"
                required
                error={form.formState.errors.stockQuantity?.message}
              >
                <Input
                  id="stockQuantity"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  placeholder="0"
                  {...form.register("stockQuantity", {
                    valueAsNumber: true,
                  })}
                />
                <p className="text-muted-foreground text-xs">
                  Number of units currently available.
                </p>
              </FormField>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Boxes className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Inventory Management</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Stock quantity is maintained independently of the
                  publication status.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publication settings */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b px-6 py-5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings2 className="h-5 w-5" />
              Publication Settings
            </CardTitle>
            <CardDescription>
              Control whether customers can see this product in the
              storefront.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-6">
            <div
              className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                isPublished ? "bg-muted/30" : ""
              }`}
            >
              <Checkbox
                id="isPublished"
                checked={isPublished}
                onCheckedChange={(checked) =>
                  form.setValue("isPublished", checked === true, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                className="mt-0.5"
              />

              <div className="flex-1 space-y-1">
                <label
                  htmlFor="isPublished"
                  className="cursor-pointer text-sm font-medium"
                >
                  Publish Product
                </label>

                <p className="text-muted-foreground text-xs leading-relaxed">
                  {isPublished
                    ? "This product is marked as published and can be displayed in the storefront."
                    : "This product remains unpublished until you enable publication."}
                </p>
              </div>

              <span
                className={
                  isPublished
                    ? "inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                }
              >
                {isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </CardContent>
        </Card>
      </FormWrapper>
    </FormProvider>
  );
}

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({
  label,
  htmlFor,
  error,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && (
          <span className="ml-1 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
