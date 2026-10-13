import "server-only";

import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import { firestoreService } from "@/lib/firebase/admin-firestore";
import { logger } from "@/lib/logger";

import { Product, ProductFormData } from "../types/product.type";

class ProductRepository {
  /**
   * Convert a Firestore timestamp or serialized date into a JavaScript Date.
   */
  private toDate(value: unknown): Date | undefined {
    if (!value) {
      return undefined;
    }

    if (value instanceof Timestamp) {
      return value.toDate();
    }

    if (value instanceof Date) {
      return value;
    }

    if (typeof value === "object" && value !== null && "_seconds" in value) {
      const timestamp = value as {
        _seconds?: unknown;
        _nanoseconds?: unknown;
      };

      const seconds = Number(timestamp._seconds);
      const nanoseconds = Number(timestamp._nanoseconds ?? 0);

      if (Number.isFinite(seconds) && Number.isFinite(nanoseconds)) {
        return new Date(seconds * 1000 + Math.floor(nanoseconds / 1_000_000));
      }
    }

    if (typeof value === "string") {
      const date = new Date(value);

      if (!Number.isNaN(date.getTime())) {
        return date;
      }
    }

    return undefined;
  }

  /**
   * Normalize a Firestore product document into the application model.
   */
  private normalize(data: Record<string, unknown>): Product {
    const createdAt = this.toDate(data.createdAt);
    const updatedAt = this.toDate(data.updatedAt);

    return {
      ...data,
      id: typeof data.id === "string" ? data.id : "",
      name: typeof data.name === "string" ? data.name : "",
      description:
        typeof data.description === "string" ? data.description : undefined,
      categoryId: typeof data.categoryId === "string" ? data.categoryId : "",
      price: typeof data.price === "number" ? data.price : 0,
      stockQuantity:
        typeof data.stockQuantity === "number" ? data.stockQuantity : 0,
      isPublished:
        typeof data.isPublished === "boolean" ? data.isPublished : false,
      createdAt,
      updatedAt,
    } as Product;
  }

  /**
   * Get all products.
   */
  async findAll(): Promise<Product[]> {
    try {
      logger.info("Finding all products");

      const products = await firestoreService.getDocuments<
        Record<string, unknown>
      >(COLLECTIONS.PRODUCTS);

      const mappedProducts = products.map((product) => this.normalize(product));

      logger.debug({ count: mappedProducts.length }, "Returning all products");

      return mappedProducts;
    } catch (error) {
      logger.error({ error }, "Error finding all products");
      throw error;
    }
  }

  /**
   * Get all products ordered by creation date.
   */
  async findAllOrdered(): Promise<Product[]> {
    try {
      logger.info("Finding products ordered by creation date");

      const products = await firestoreService.getDocumentsOrdered<
        Record<string, unknown>
      >(COLLECTIONS.PRODUCTS, "createdAt", undefined, "desc");

      return products.map((product) => this.normalize(product));
    } catch (error) {
      logger.error({ error }, "Error finding ordered products");
      throw error;
    }
  }

  /**
   * Find a product by Firestore document ID.
   */
  async findById(id: string): Promise<Product | null> {
    try {
      logger.info({ id }, "Finding product by ID");

      const product = await firestoreService.getDocument<
        Record<string, unknown>
      >(COLLECTIONS.PRODUCTS, id);

      if (!product) {
        logger.warn({ id }, "Product not found");
        return null;
      }

      return this.normalize({ ...product, id });
    } catch (error) {
      logger.error({ id, error }, "Error finding product by ID");
      throw error;
    }
  }

  /**
   * Find products by category ID.
   */
  async findByCategoryId(categoryId: string): Promise<Product[]> {
    try {
      logger.info({ categoryId }, "Finding products by category");

      const products = await firestoreService.queryDocuments<
        Record<string, unknown>
      >(COLLECTIONS.PRODUCTS, {
        filters: [
          {
            field: "categoryId",
            operator: "==",
            value: categoryId,
          },
        ],
      });

      return products.map((product) => this.normalize(product));
    } catch (error) {
      logger.error({ categoryId, error }, "Error finding products by category");
      throw error;
    }
  }

  /**
   * Find a product by its exact name.
   */
  async findByName(name: string): Promise<Product | null> {
    try {
      logger.info({ name }, "Finding product by name");

      const productRef = await firestoreService.getDocumentReferenceByField(
        COLLECTIONS.PRODUCTS,
        "name",
        name,
      );

      if (!productRef) {
        logger.warn({ name }, "Product not found for name");
        return null;
      }

      return this.findById(productRef.id);
    } catch (error) {
      logger.error({ name, error }, "Error finding product by name");
      throw error;
    }
  }

  /**
   * Search products by name or description.
   *
   * Firestore does not provide native substring or case-insensitive
   * text search. This implementation filters the retrieved products
   * in application memory.
   */
  async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      logger.info({ searchTerm }, "Searching products");

      const normalizedSearchTerm = searchTerm.trim().toLowerCase();

      if (!normalizedSearchTerm) {
        return [];
      }

      const products = await this.findAll();

      const matchedProducts = products.filter((product) => {
        const nameMatches = product.name
          .toLowerCase()
          .includes(normalizedSearchTerm);

        const descriptionMatches = product.description
          ?.toLowerCase()
          .includes(normalizedSearchTerm);

        return nameMatches || Boolean(descriptionMatches);
      });

      logger.debug(
        {
          searchTerm,
          count: matchedProducts.length,
        },
        "Returning matching products",
      );

      return matchedProducts;
    } catch (error) {
      logger.error({ searchTerm, error }, "Error searching products");
      throw error;
    }
  }

  /**
   * Create a new product.
   */
  async create(data: ProductFormData): Promise<Product> {
    try {
      logger.info({ name: data.name }, "Creating product");

      const productData = {
        ...data,
        isPublished: data.isPublished ?? false,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const createdProduct = await firestoreService.addDocument<
        Record<string, unknown>
      >(
        COLLECTIONS.PRODUCTS,
        productData as Omit<Record<string, unknown>, "id">,
      );

      const product = await this.findById(createdProduct.id as string);

      if (!product) {
        logger.error(
          { id: createdProduct.id },
          "Failed to retrieve created product",
        );

        throw new Error("Failed to retrieve created product");
      }

      logger.info(
        { id: product.id, name: product.name },
        "Successfully created product",
      );

      return product;
    } catch (error) {
      logger.error({ error }, "Error creating product");
      throw error;
    }
  }

  /**
   * Update an existing product.
   */
  async update(id: string, data: Partial<ProductFormData>): Promise<Product> {
    try {
      logger.info({ id }, "Updating product");

      const existingProduct = await this.findById(id);

      if (!existingProduct) {
        logger.warn({ id }, "Cannot update product: product not found");
        throw new Error("Product not found");
      }

      await firestoreService.updateDocument(COLLECTIONS.PRODUCTS, id, {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const updatedProduct = await this.findById(id);

      if (!updatedProduct) {
        throw new Error("Failed to retrieve updated product");
      }

      logger.info({ id }, "Successfully updated product");

      return updatedProduct;
    } catch (error) {
      logger.error({ id, error }, "Error updating product");
      throw error;
    }
  }

  /**
   * Delete an existing product.
   */
  async delete(id: string): Promise<void> {
    try {
      logger.info({ id }, "Deleting product");

      const existingProduct = await this.findById(id);

      if (!existingProduct) {
        logger.warn({ id }, "Cannot delete product: product not found");
        throw new Error("Product not found");
      }

      await firestoreService.deleteDocument(COLLECTIONS.PRODUCTS, id);

      logger.info({ id }, "Successfully deleted product");
    } catch (error) {
      logger.error({ id, error }, "Error deleting product");
      throw error;
    }
  }
}

export const productsRepository = new ProductRepository();
