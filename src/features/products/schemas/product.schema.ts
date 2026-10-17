import { z } from "zod";

export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be greater than 0"),
  stockQuantity: z.number().int().nonnegative("Stock cannot be negative"),
  isPublished: z.boolean().default(false),
  imageUrl: z.string().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stockQuantity: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  isPublished: z.boolean().default(false).optional(),
  imageUrl: z.string().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Product name cannot be empty").optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1).optional(),
  price: z.coerce.number().positive("Price must be greater than 0").optional(),
  stockQuantity: z.coerce.number().int().nonnegative("Stock cannot be negative").optional(),
  isPublished: z.boolean().optional(),
  imageUrl: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof createProductSchema>;
