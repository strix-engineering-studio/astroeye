
"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { storageService } from "@/lib/firebase/storage";

import type { ProductFormValues } from "../schemas";
import { ProductForm } from "../components/ProductFrom";
import { useProductQuery, useUpdateProductMutation } from "../hooks/useProduct";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const productId = params.id;

  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useProductQuery(productId);

 

  const updateProduct = useUpdateProductMutation();



  const handleSubmit = async (
    values: ProductFormValues,
    image?: File,
  ) => {
    try {
      const imageUrl = image
        ? await storageService.uploadFile("products", image)
        : values.imageUrl || undefined;

      await updateProduct.mutateAsync({
        id: productId,
        data: {
          ...values,
          imageUrl,
        },
      });

      router.push("/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update product.",
      );
    }
  };

  if (isProductLoading ) {
    return (
      <div className="flex h-64 items-center justify-center">
        Loading product...
      </div>
    );
  }

  if (isProductError || !product) {
    return (
      <div className="container mx-auto max-w-7xl space-y-4 p-6">
        <Button variant="ghost" onClick={() => router.push("/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-3"
          disabled={updateProduct.isPending}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground">{product.name}</p>
      </div>

      <ProductForm
        mode="edit"
        defaultValues={{
          name: product.name,
          description: product.description ?? "",
          categoryId: product.categoryId,
          price: product.price,
          stockQuantity: product.stockQuantity,
          isPublished: product.isPublished,
          imageUrl: product.imageUrl ?? "",
        }}
        categories={[]}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isSubmitting={updateProduct.isPending}
      />
    </div>
  );
}
