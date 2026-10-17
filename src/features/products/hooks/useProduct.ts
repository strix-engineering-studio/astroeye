"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";

import productsService from "../services/product.service";
import {
  Product,
  ProductFormData,
  UpdateProductData,
} from "../types/product.type";

export const useProductsQuery = (options?: {
  all?: boolean;
  categoryId?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: [COLLECTIONS.PRODUCTS, options],
    queryFn: () => productsService.fetchProducts(options),
  });
};

export const useProductQuery = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [COLLECTIONS.PRODUCTS, id],
    queryFn: () => productsService.fetchProductById(id),
    enabled: Boolean(id),

    initialData: () => {
      const listQueries = queryClient.getQueriesData<Product[]>({
        queryKey: [COLLECTIONS.PRODUCTS],
      });

      return listQueries
        .flatMap(([, products]) => products ?? [])
        .find((product) => product.id === id);
    },
  });
};

export const useProductsByCategoryQuery = (categoryId: string) => {
  return useQuery({
    queryKey: [COLLECTIONS.PRODUCTS, "category", categoryId],
    queryFn: () => productsService.fetchProductsByCategoryId(categoryId),
    enabled: Boolean(categoryId),
  });
};

export const useProductByNameQuery = (name: string) => {
  return useQuery({
    queryKey: [COLLECTIONS.PRODUCTS, "name", name],
    queryFn: () => productsService.fetchProductByName(name),
    enabled: Boolean(name.trim()),
  });
};

export const useSearchProductsQuery = (searchTerm: string) => {
  return useQuery({
    queryKey: [COLLECTIONS.PRODUCTS, "search", searchTerm],
    queryFn: () => productsService.searchProducts(searchTerm),
    enabled: Boolean(searchTerm.trim()),
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductFormData) => productsService.createProduct(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.PRODUCTS],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "stats"],
      });

      toast.success("Product created successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to create product");
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductData }) =>
      productsService.updateProduct(id, data),

    onSuccess: (updated) => {
      queryClient.setQueryData([COLLECTIONS.PRODUCTS, updated.id], updated);

      queryClient.setQueriesData<Product[]>(
        { queryKey: [COLLECTIONS.PRODUCTS] },
        (old) =>
          old?.map((product) =>
            product.id === updated.id ? updated : product,
          ) ?? [],
      );

      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.PRODUCTS],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "stats"],
      });

      toast.success(`Product "${updated.name}" updated successfully`);
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update product");
    },
  });
};

export const useUpdateProductStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      productsService.updateProductStatus(id, isPublished),

    onSuccess: (updated) => {
      queryClient.setQueryData([COLLECTIONS.PRODUCTS, updated.id], updated);

      queryClient.setQueriesData<Product[]>(
        { queryKey: [COLLECTIONS.PRODUCTS] },
        (old) =>
          old?.map((product) =>
            product.id === updated.id ? updated : product,
          ) ?? [],
      );

      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.PRODUCTS],
      });

      toast.success(
        updated.isPublished
          ? "Product published successfully"
          : "Product unpublished successfully",
      );
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to update product status");
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),

    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: [COLLECTIONS.PRODUCTS, id],
      });

      queryClient.setQueriesData<Product[]>(
        { queryKey: [COLLECTIONS.PRODUCTS] },
        (old) => old?.filter((product) => product.id !== id) ?? [],
      );

      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS.PRODUCTS],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard", "stats"],
      });

      toast.success("Product deleted successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });
};
