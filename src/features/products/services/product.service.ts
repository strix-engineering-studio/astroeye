import { apiClient } from "@/lib/api/client";

import {
  Product,
  ProductFormData,
  UpdateProductData,
} from "../types/product.type";

export const productsService = {
  async fetchProducts() {
    return apiClient.get<Product[]>("/products");
  },

  async fetchProductById(id: string) {
    return apiClient.get<Product>(`/products/${id}`);
  },

  async fetchProductsByCategoryId(categoryId: string) {
    return apiClient.get<Product[]>(
      `/products/category/${encodeURIComponent(categoryId)}`,
    );
  },

  async fetchProductByName(name: string) {
    return apiClient.get<Product>(`/products/name/${encodeURIComponent(name)}`);
  },

  async searchProducts(searchTerm: string) {
    return apiClient.get<Product[]>(
      `/products/search?q=${encodeURIComponent(searchTerm)}`,
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
