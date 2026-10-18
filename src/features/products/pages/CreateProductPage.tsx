
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { storageService } from "@/lib/firebase/storage";


import type { ProductFormValues } from "../schemas";
import { ProductForm } from "../components/ProductFrom";
import { useCreateProductMutation } from "../hooks/useProduct";

export default function CreateProductPage() {
  const router = useRouter();

  const createProduct = useCreateProductMutation();
 


  const handleSubmit = async (
    values: ProductFormValues,
    image?: File,
  ) => {
    try {
      const imageUrl = image
        ? await storageService.uploadFile("products", image)
        : values.imageUrl || undefined;

      await createProduct.mutateAsync({
        ...values,
        imageUrl,
        categoryId: '1'
      });

      router.push("/console/products");
    } catch (error) {
      console.error("Failed to create product:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create product.",
      );
    }
  };


  
  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-3"
          disabled={createProduct.isPending}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold">Create Product</h1>
        <p className="text-muted-foreground">
          Add a product to your catalog and configure its pricing,
          inventory, and publication status.
        </p>
      </div>

      <ProductForm
        mode="create"
        categories={[{
            id: "1",
            name: "Test Category",
        }]}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        isSubmitting={createProduct.isPending}
      />
    </div>
  );
}

