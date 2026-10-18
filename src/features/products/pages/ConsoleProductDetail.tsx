
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Boxes,
  CalendarDays,
  Edit,
  Image as ImageIcon,
  IndianRupee,
  Package,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useProductQuery, useUpdateProductStatusMutation, useDeleteProductMutation } from "../hooks/useProduct";



export default function ConsoleProductDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useProductQuery(productId);

  const updateStatus = useUpdateProductStatusMutation();
  const deleteProduct = useDeleteProductMutation();

  const isBusy = updateStatus.isPending || deleteProduct.isPending;

  const handleTogglePublication = async () => {
    if (!product) return;

    try {
      await updateStatus.mutateAsync({
        id: product.id,
        isPublished: !product.isPublished,
      });
    } catch (error) {
      console.error("Failed to update product publication status:", error);
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    try {
      await deleteProduct.mutateAsync(product.id);
      setDeleteDialogOpen(false);
      router.push("/products");
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        Loading product...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto max-w-7xl space-y-4 p-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/products")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <Package className="text-muted-foreground h-10 w-10" />
            <h2 className="text-lg font-semibold">
              Unable to load product
            </h2>
            <p className="text-muted-foreground text-sm">
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred."}
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto max-w-7xl space-y-4 p-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/products")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  const formatDate = (value?: Date | string) => {
    if (!value) return "Not available";

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) return "Not available";

    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="-ml-3"
          disabled={isBusy}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-lg">
              <Package className="h-6 w-6" />
            </div>

            <div className="min-w-0 space-y-1">
              <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
                {product.name}
              </h1>

              <p className="text-muted-foreground text-sm">
                Product ID: {product.id}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <Badge
                  variant={product.isPublished ? "default" : "secondary"}
                >
                  {product.isPublished ? "Published" : "Draft"}
                </Badge>

                <Badge
                  variant={
                    product.stockQuantity > 0 ? "outline" : "destructive"
                  }
                >
                  {product.stockQuantity > 0
                    ? "In stock"
                    : "Out of stock"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/products/${product.id}/edit`)}
              disabled={isBusy}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>

            <Button
              variant={product.isPublished ? "secondary" : "default"}
              onClick={handleTogglePublication}
              disabled={isBusy}
            >
              {product.isPublished ? (
                <EyeOff className="mr-2 h-4 w-4" />
              ) : (
                <Eye className="mr-2 h-4 w-4" />
              )}
              {product.isPublished ? "Unpublish" : "Publish"}
            </Button>

            <AlertDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogTrigger >
                <Button
                  variant="destructive"
                  disabled={isBusy}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete this product?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to delete "{product.name}". This action
                    may be irreversible and may affect storefront visibility
                    and related records.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleteProduct.isPending}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(event) => {
                      event.preventDefault();
                      void handleDelete();
                    }}
                    disabled={deleteProduct.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {deleteProduct.isPending
                      ? "Deleting..."
                      : "Delete Product"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <Separator />

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
        <div className="space-y-6">
          {/* Product image */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Product Image
              </CardTitle>
              <CardDescription>
                Primary image associated with this product.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {product.imageUrl ? (
                <div className="bg-muted flex min-h-64 items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-[480px] w-full object-contain"
                  />
                </div>
              ) : (
                <div className="bg-muted text-muted-foreground flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg">
                  <ImageIcon className="h-12 w-12" />
                  <p className="text-sm">No product image uploaded</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>
                General information stored for this product.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <DetailRow label="Product Name" value={product.name} />

              <DetailRow
                label="Category ID"
                value={product.categoryId || "Not assigned"}
              />

              <div className="space-y-2">
                <p className="text-muted-foreground text-sm">Description</p>
                <p className="break-words whitespace-pre-wrap text-sm leading-6">
                  {product.description?.trim() || "No description provided."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Selling Price</p>
                <p className="text-3xl font-bold">
                  {formatPrice(product.price)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Boxes className="h-5 w-5" />
                Inventory
              </CardTitle>
              <CardDescription>
                Current available stock quantity.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">
                  Stock Quantity
                </p>
                <p className="text-2xl font-semibold">
                  {product.stockQuantity.toLocaleString("en-IN")}
                  <span className="text-muted-foreground ml-2 text-sm font-normal">
                    units
                  </span>
                </p>
              </div>

              <Separator />

              <DetailRow
                label="Inventory Status"
                value={product.stockQuantity > 0 ? "In stock" : "Out of stock"}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Record Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <DetailRow
                label="Created At"
                value={formatDate(product.createdAt)}
              />

              <Separator />

              <DetailRow
                label="Last Updated"
                value={formatDate(product.updatedAt)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publication</CardTitle>
              <CardDescription>
                Storefront visibility for this product.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground text-sm">Status</span>
                <Badge
                  variant={product.isPublished ? "default" : "secondary"}
                >
                  {product.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>

              <p className="text-muted-foreground text-xs leading-relaxed">
                {product.isPublished
                  ? "This product is marked as published. Actual storefront visibility also depends on your storefront query and filtering rules."
                  : "This product is currently marked as unpublished."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => router.push("/products")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="break-all text-sm font-medium sm:max-w-[65%] sm:text-right">
        {value}
      </span>
    </div>
  );
}
