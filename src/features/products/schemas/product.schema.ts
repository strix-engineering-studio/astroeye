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



export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(120, "Product name cannot exceed 120 characters"),

  description: z
    .string()
    .max(5000, "Description cannot exceed 5000 characters")
    .optional()
    .transform((value) => value?.trim() ?? ""),

  categoryId: z
    .string()
    .trim()
    .min(0, "Please select a category").optional(),

  price: z
    .number({
      error: "Price is required",
    })
    .finite("Enter a valid price")
    .min(0, "Price cannot be negative"),

  stockQuantity: z
    .number({
      error: "Stock quantity is required",
    })
    .int("Stock quantity must be a whole number")
    .min(0, "Stock quantity cannot be negative"),

  isPublished: z.boolean(),

  imageUrl: z
    .string()
    .optional()
    .transform((value) => value?.trim() ?? "")
    .refine(
      (value) =>
        value === "" || z.url().safeParse(value).success,
      "Enter a valid image URL",
    ),
});

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;
