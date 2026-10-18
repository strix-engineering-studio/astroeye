export interface Product {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  price: number;  
  stockQuantity: number;
  isPublished: boolean;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  categoryId?: string;
  price: number;
  stockQuantity: number;
  isPublished?: boolean;
  imageUrl?: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  stockQuantity?: number;
  isPublished?: boolean;
  imageUrl?: string;
}

export type ProductFormData = CreateProductInput;
export type UpdateProductData = UpdateProductInput;