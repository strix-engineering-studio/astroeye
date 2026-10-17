"use client";

import * as React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import {
  Product,
  createProductSchema,
  ProductFormValues,
} from "../index";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../hooks/useProduct";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  categoryId: "telescopes",
  price: 0,
  stockQuantity: 1,
  isPublished: true,
};

export function ProductDialog({
  open,
  onOpenChange,
  product,
}: ProductDialogProps) {
  const isEditMode = Boolean(product);

  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues,
  });

  const isPublished = watch("isPublished");

  useEffect(() => {
    if (!open) return;

    if (product) {
      reset({
        name: product.name,
        description: product.description || "",
        categoryId: product.categoryId || "telescopes",
        price: product.price,
        stockQuantity: product.stockQuantity,
        isPublished: product.isPublished,
      });
      return;
    }

    reset(defaultValues);
  }, [open, product, reset]);

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (isEditMode && product) {
        await updateMutation.mutateAsync({
          id: product.id,
          data: values,
        });
      } else {
        await createMutation.mutateAsync(values);
      }

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const isBusy = createMutation.isPending || updateMutation.isPending || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Product" : "New Product"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update product details, pricing, and inventory."
              : "Add a new product to your optical catalog."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              placeholder="e.g. AstroEye Precision Telescope X1"
              {...register("name")}
              disabled={isBusy}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category *</Label>
              <Input
                id="categoryId"
                placeholder="e.g. telescopes, lenses, filters"
                {...register("categoryId")}
                disabled={isBusy}
              />
              {errors.categoryId && (
                <p className="text-xs text-destructive">{errors.categoryId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹ INR) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="4999"
                {...register("price")}
                disabled={isBusy}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockQuantity">Stock Quantity *</Label>
            <Input
              id="stockQuantity"
              type="number"
              step="1"
              placeholder="10"
              {...register("stockQuantity")}
              disabled={isBusy}
            />
            {errors.stockQuantity && (
              <p className="text-xs text-destructive">
                {errors.stockQuantity.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="High quality optical instrument..."
              rows={3}
              {...register("description")}
              disabled={isBusy}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="isPublished">Publish to Storefront</Label>
              <p className="text-xs text-muted-foreground">
                Visible to customers for purchase when published
              </p>
            </div>
            <Switch
              id="isPublished"
              checked={isPublished}
              onCheckedChange={(checked) => setValue("isPublished", checked)}
              disabled={isBusy}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isBusy}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isBusy} className="gap-2">
              {isBusy && <Spinner className="h-4 w-4" />}
              {isEditMode ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
