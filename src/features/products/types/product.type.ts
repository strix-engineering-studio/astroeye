export interface Product {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  stockQuantity: number;
  isPublished: boolean;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  stockQuantity: number;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  stockQuantity?: number;
  isPublished?: boolean;
}
