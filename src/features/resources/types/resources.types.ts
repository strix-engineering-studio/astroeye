/**
 * Resource type definitions based on ResourcesEntity model
 */

export interface Resource {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  category: string;
  fileType: string;
  creatorId: string;
  downloads: number;
  isPremium: boolean;
  /** Price in major currency units (authoritative value is read server-side). */
  price?: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface ResourceFilters extends Record<
  string,
  string | number | boolean | Date | null | undefined
> {
  search?: string;
  category?: string;
  fileType?: string;
  isPremium?: boolean;
  creatorId?: string;
  minDownloads?: number;
  maxDownloads?: number;
  createdAfter?: Date | string;
  createdBefore?: Date | string;
  sortBy?: "createdAt" | "updatedAt" | "downloads" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ResourceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface ResourceStats {
  totalResources: number;
  totalDownloads: number;
  mostPopularCategory: string;
  mostDownloadedResource: Resource | null;
  premiumResources: number;
  freeResources: number;
}

export type CreateResourceInput = Omit<
  Resource,
  "id" | "createdAt" | "updatedAt" | "downloads"
>;
export type UpdateResourceInput = Partial<
  Omit<Resource, "id" | "createdAt" | "creatorId">
>;

// Re-export enums from resources.enums for backward compatibility
export {
  ResourceCategory as ResourceCategoryEnum,
  ResourceFileType as ResourceFileTypeEnum,
  ResourceStatus,
  ResourceVisibility,
  CATEGORY_OPTIONS,
  FILE_TYPE_OPTIONS,
  FILE_TYPE_MIME_MAP,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE,
} from "./resources.enums";
