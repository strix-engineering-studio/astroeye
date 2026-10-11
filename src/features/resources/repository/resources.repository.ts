import { FieldValue } from "firebase-admin/firestore";

import {
  Resource,
  CreateResourceInput,
  UpdateResourceInput,
  ResourceStats,
} from "../types/resources.types";

import { ResourceFile, StoreProduct } from "../types";

import { COLLECTIONS } from "@/lib/constants/COLLECTIONS";
import { firestoreService } from "@/lib/firebase/admin-firestore";
import { logger } from "@/lib/logger";

class ResourcesRepository {
  // --------------------------------------------------------------------------
  // Resources
  // --------------------------------------------------------------------------

  async findAll(): Promise<Resource[]> {
    try {
      logger.info("Fetching all resources");
      const resources = await firestoreService.getDocuments<Resource>(
        COLLECTIONS.RESOURCES,
      );
      logger.debug("Fetched resources count:", resources.length);
      return resources;
    } catch (error) {
      logger.error("Error fetching all resources:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Resource | null> {
    try {
      logger.info("Fetching resource by ID:", id);
      const resource = await firestoreService.getDocument<Resource>(
        COLLECTIONS.RESOURCES,
        id,
      );

      if (!resource) {
        logger.debug("Resource not found with ID:", id);
        return null;
      }

      logger.debug("Resource found successfully:", resource.id);
      return resource;
    } catch (error) {
      logger.error(`Error in findById for resource ${id}:`, error);
      throw error;
    }
  }

  async create(data: CreateResourceInput): Promise<Resource> {
    try {
      logger.info("Creating new resource:", data.title);

      const id = await firestoreService.addDocument(COLLECTIONS.RESOURCES, {
        ...data,

        downloads: 0,

        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const resource = await this.findById(id as string);

      if (!resource) {
        throw new Error("Failed to create resource");
      }

      logger.info("Resource created successfully with ID:", resource.id);
      return resource;
    } catch (error) {
      logger.error("Error creating resource:", error);
      throw error;
    }
  }

  async update(id: string, data: UpdateResourceInput): Promise<Resource> {
    try {
      logger.info("Updating resource:", id);

      await firestoreService.updateDocument(COLLECTIONS.RESOURCES, id, {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const resource = await this.findById(id);

      if (!resource) {
        throw new Error("Resource not found");
      }

      logger.info("Resource updated successfully:", id);
      return resource;
    } catch (error) {
      logger.error(`Error updating resource ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      logger.info("Deleting resource:", id);
      await firestoreService.deleteDocument(COLLECTIONS.RESOURCES, id);
      logger.info("Resource deleted successfully:", id);
    } catch (error) {
      logger.error(`Error deleting resource ${id}:`, error);
      throw error;
    }
  }

  async incrementDownloads(id: string): Promise<Resource> {
    try {
      logger.info("Incrementing downloads for resource:", id);
      await firestoreService.incrementField(
        COLLECTIONS.RESOURCES,
        id,
        "downloads",
        1,
      );

      const resource = await this.findById(id);

      if (!resource) {
        throw new Error("Resource not found");
      }

      logger.info("Resource downloads incremented successfully:", id);
      return resource;
    } catch (error) {
      logger.error(`Error incrementing downloads for resource ${id}:`, error);
      throw error;
    }
  }

  async findByCreator(creatorId: string): Promise<Resource[]> {
    try {
      logger.info("Fetching resources by creator:", creatorId);
      const resources = await firestoreService.getDocumentsByField<Resource>(
        COLLECTIONS.RESOURCES,
        "creatorId",
        creatorId,
      );
      logger.debug("Found resources for creator:", {
        creatorId,
        count: resources.length,
      });
      return resources;
    } catch (error) {
      logger.error(`Error fetching resources for creator ${creatorId}:`, error);
      throw error;
    }
  }

  async getRecent(limit = 10): Promise<Resource[]> {
    try {
      logger.info("Fetching recent resources with limit:", limit);
      const resources = await firestoreService.getDocumentsOrdered<Resource>(
        COLLECTIONS.RESOURCES,
        "createdAt",
        limit,
        "desc",
      );
      logger.debug("Found recent resources count:", resources.length);
      return resources;
    } catch (error) {
      logger.error("Error fetching recent resources:", error);
      throw error;
    }
  }

  async getPopular(limit = 10): Promise<Resource[]> {
    try {
      logger.info("Fetching popular resources with limit:", limit);
      const resources = await firestoreService.getDocumentsOrdered<Resource>(
        COLLECTIONS.RESOURCES,
        "downloads",
        limit,
        "desc",
      );
      logger.debug("Found popular resources count:", resources.length);
      return resources;
    } catch (error) {
      logger.error("Error fetching popular resources:", error);
      throw error;
    }
  }

  async getStats(): Promise<ResourceStats> {
    try {
      logger.info("Calculating resource statistics");
      const resources = await this.findAll();

      const categoryCounts = resources.reduce<Record<string, number>>(
        (counts, resource) => {
          counts[resource.category] = (counts[resource.category] ?? 0) + 1;

          return counts;
        },
        {},
      );

      const stats: ResourceStats = {
        totalResources: resources.length,

        totalDownloads: resources.reduce(
          (sum, resource) => sum + (resource.downloads ?? 0),
          0,
        ),

        mostPopularCategory:
          Object.entries(categoryCounts).sort(
            ([, a], [, b]) => b - a,
          )[0]?.[0] ?? "None",

        mostDownloadedResource: resources.reduce<Resource | null>(
          (mostDownloaded, resource) =>
            !mostDownloaded || resource.downloads > mostDownloaded.downloads
              ? resource
              : mostDownloaded,
          null,
        ),

        premiumResources: resources.filter((resource) => resource.isPremium)
          .length,

        freeResources: resources.filter((resource) => !resource.isPremium)
          .length,
      };

      logger.info("Resource stats calculated successfully");
      return stats;
    } catch (error) {
      logger.error("Error calculating resource stats:", error);
      throw error;
    }
  }

  // --------------------------------------------------------------------------
  // Resource Files (Legacy)
  // --------------------------------------------------------------------------

  async findFiles(): Promise<ResourceFile[]> {
    try {
      logger.info("Fetching all resource files");
      const files = await firestoreService.getDocuments<ResourceFile>(
        COLLECTIONS.RESOURCES,
      );
      logger.debug("Fetched resource files count:", files.length);
      return files;
    } catch (error) {
      logger.error("Error fetching resource files:", error);
      throw error;
    }
  }

  // --------------------------------------------------------------------------
  // Products
  // --------------------------------------------------------------------------

  async findProducts(): Promise<StoreProduct[]> {
    try {
      logger.info("Fetching all products");
      const products =
        await firestoreService.getDocuments<StoreProduct>("products");
      logger.debug("Fetched products count:", products.length);
      return products;
    } catch (error) {
      logger.error("Error fetching products:", error);
      throw error;
    }
  }

  async findProductById(id: string): Promise<StoreProduct | null> {
    try {
      logger.info("Fetching product by ID:", id);
      const product = await firestoreService.getDocument<StoreProduct>(
        "products",
        id,
      );

      if (!product) {
        logger.debug("Product not found with ID:", id);
        return null;
      }

      logger.debug("Product found successfully:", product.id);
      return product;
    } catch (error) {
      logger.error(`Error in findProductById for product ${id}:`, error);
      throw error;
    }
  }

  async createProduct(
    data: Omit<StoreProduct, "id" | "createdAt" | "updatedAt" | "salesCount">,
  ): Promise<StoreProduct> {
    try {
      logger.info("Creating new product:", data.title);

      const id = await firestoreService.addDocument("products", {
        ...data,

        salesCount: 0,

        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const product = await this.findProductById(id as string);

      if (!product) {
        throw new Error("Failed to create product");
      }

      logger.info("Product created successfully with ID:", product.id);
      return product;
    } catch (error) {
      logger.error("Error creating product:", error);
      throw error;
    }
  }

  async updateProduct(
    id: string,
    data: Partial<Omit<StoreProduct, "id" | "createdAt" | "updatedAt">>,
  ): Promise<StoreProduct> {
    try {
      logger.info("Updating product:", id);

      await firestoreService.updateDocument("products", id, {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      });

      const product = await this.findProductById(id);

      if (!product) {
        throw new Error("Product not found");
      }

      logger.info("Product updated successfully:", id);
      return product;
    } catch (error) {
      logger.error(`Error updating product ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      logger.info("Deleting product:", id);
      await firestoreService.deleteDocument("products", id);
      logger.info("Product deleted successfully:", id);
    } catch (error) {
      logger.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }
}

export const resourcesRepository = new ResourcesRepository();
