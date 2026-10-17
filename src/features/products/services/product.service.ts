import { apiClient } from "@/lib/api/client";

import {
  Product,
  ProductFormData,
  UpdateProductData,
} from "../types/product.type";

export const productsService = {
  async fetchProducts(options?: {
    all?: boolean;
    categoryId?: string;
    search?: string;
  }) {
    const params = new URLSearchParams();
    if (options?.all) params.set("all", "true");
    if (options?.categoryId) params.set("categoryId", options.categoryId);
    if (options?.search) params.set("search", options.search);

    const qs = params.toString();
    return apiClient.get<Product[]>(`/products${qs ? `?${qs}` : ""}`);
  },

  async fetchProductById(id: string) {
    return apiClient.get<Product>(`/products/${id}`);
  },

  async fetchProductsByCategoryId(categoryId: string) {
    return apiClient.get<Product[]>(
      `/products?categoryId=${encodeURIComponent(categoryId)}`,
    );
  },

  async fetchProductByName(name: string) {
    return apiClient.get<Product>(`/products?search=${encodeURIComponent(name)}`);
  },

  async searchProducts(searchTerm: string) {
    return apiClient.get<Product[]>(
      `/products?search=${encodeURIComponent(searchTerm)}`,
    );
  },

  async createProduct(data: ProductFormData) {
    return apiClient.post<Product>("/products", data);
  },

  async updateProduct(id: string, data: UpdateProductData) {
    return apiClient.patch<Product>(`/products/${id}`, data);
  },

  async deleteProduct(id: string) {
    return apiClient.delete<void>(`/products/${id}`);
  },

  async updateProductStatus(id: string, isPublished: boolean) {
    return apiClient.patch<Product>(`/products/${id}`, {
      isPublished,
    });
  },
};

export default productsService;
